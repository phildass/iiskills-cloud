/**
 * Next.js Edge Middleware — learn-chemistry
 *
 * Admin bypass (infallible rule): reads the Supabase auth cookie, decodes the
 * JWT to extract the user's email and is_admin flag, then calls hasAccess().
 * If hasAccess() returns true the request is tagged with x-admin-access and
 * allowed through immediately — no payment redirect will fire.
 *
 * Fallback: if the URL contains ?admin_access=true the same bypass is applied
 * without requiring a valid session (admin preview links from apps/main).
 *
 * All other requests pass through unchanged — access control for lesson
 * pages is handled client-side by the useUserAccess hook.
 */
import { NextResponse } from "next/server";
import { hasAccess, parseUserFromCookies } from "@iiskills/access-control";

export function proxy(request) {
  const { searchParams } = request.nextUrl;

  // Admin preview URL param — pass through immediately.
  if (searchParams.get("admin_access") === "true") {
    const response = NextResponse.next();
    response.headers.set("x-admin-access", "1");
    return response;
  }

  // Infallible admin bypass via session cookie.
  const user = parseUserFromCookies(request);
  if (user && hasAccess(user)) {
    const response = NextResponse.next();
    response.headers.set("x-admin-access", "1");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|images/).*)"],
};
