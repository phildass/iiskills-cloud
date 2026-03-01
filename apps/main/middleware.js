/**
 * Next.js Edge Middleware
 *
 * Applies lightweight in-process rate limiting to sensitive routes:
 *   - /api/auth/* — authentication endpoints
 *   - /api/pay    — payment order creation
 *   - /api/payment/* — payment callbacks / webhooks
 *   - /api/verify-otp — OTP verification
 *   - /admin/*   — admin panel (optionally protected by IP allowlist)
 *
 * Implementation uses a sliding-window counter stored in a module-level
 * Map.  Because Next.js middleware runs in the Edge Runtime each instance
 * has its own in-process store, which is sufficient for single-server
 * deployments.  For multi-replica setups, replace the Map with an external
 * store (Redis / KV) using the same interface.
 *
 * Rate-limit windows and maximums are intentionally conservative.
 * Adjust via environment variables:
 *   RATE_LIMIT_AUTH_MAX      (default 10)  — auth requests per window
 *   RATE_LIMIT_PAYMENT_MAX   (default 5)   — payment requests per window
 *   RATE_LIMIT_ADMIN_MAX     (default 30)  — admin requests per window
 *   RATE_LIMIT_WINDOW_MS     (default 60000) — window size in ms (1 minute)
 */

import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// In-process sliding-window store
// key: `${route_group}:${ip}` → { count, windowStart }
// ---------------------------------------------------------------------------
const store = new Map();

function getRateLimit(routeGroup) {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
  const maxMap = {
    auth: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '10', 10),
    payment: parseInt(process.env.RATE_LIMIT_PAYMENT_MAX || '5', 10),
    admin: parseInt(process.env.RATE_LIMIT_ADMIN_MAX || '30', 10),
  };
  return { windowMs, max: maxMap[routeGroup] ?? 30 };
}

function getClientIp(request) {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

function checkRateLimit(key, routeGroup) {
  const now = Date.now();
  const { windowMs, max } = getRateLimit(routeGroup);

  // Lazy cleanup: prune stale entries when the store grows large
  if (store.size > 10_000) {
    for (const [k, e] of store.entries()) {
      if (now - e.windowStart > windowMs * 2) store.delete(k);
    }
  }

  const entry = store.get(key) ?? { count: 0, windowStart: now };

  if (now - entry.windowStart > windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: max - 1, reset: now + windowMs };
  }

  entry.count += 1;
  store.set(key, entry);

  const remaining = Math.max(0, max - entry.count);
  const reset = entry.windowStart + windowMs;
  return { allowed: entry.count <= max, remaining, reset };
}

// ---------------------------------------------------------------------------
// Route-group classification
// ---------------------------------------------------------------------------
function getRouteGroup(pathname) {
  if (
    pathname.startsWith('/api/auth/') ||
    pathname === '/api/auth'
  ) return 'auth';

  if (
    pathname === '/api/pay' ||
    pathname.startsWith('/api/payment/') ||
    pathname === '/api/verify-otp' ||
    pathname === '/api/paymentMembershipHandler'
  ) return 'payment';

  if (pathname.startsWith('/admin')) return 'admin';

  return null; // Not rate-limited
}

// ---------------------------------------------------------------------------
// Optional IP allowlist for admin routes
// ---------------------------------------------------------------------------
function isAdminIpAllowed(ip) {
  const allowlist = process.env.ADMIN_IP_ALLOWLIST;
  if (!allowlist) return true; // No allowlist configured — allow all
  const allowed = allowlist.split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.includes(ip);
}

// ---------------------------------------------------------------------------
// Middleware entry-point
// ---------------------------------------------------------------------------
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const routeGroup = getRouteGroup(pathname);

  if (!routeGroup) return NextResponse.next();

  const ip = getClientIp(request);

  // IP allowlist check for admin routes (before rate limiting)
  if (routeGroup === 'admin' && !isAdminIpAllowed(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const key = `${routeGroup}:${ip}`;
  const { allowed, remaining, reset } = checkRateLimit(key, routeGroup);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests', retryAfter: Math.ceil((reset - Date.now()) / 1000) }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(getRateLimit(routeGroup).max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(reset / 1000)));
  return response;
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/pay',
    '/api/payment/:path*',
    '/api/verify-otp',
    '/api/paymentMembershipHandler',
    '/admin/:path*',
  ],
};
