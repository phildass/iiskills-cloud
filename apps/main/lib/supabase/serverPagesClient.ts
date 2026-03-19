import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

// Inject .iiskills.cloud domain on all auth cookies so sessions are shared
// across every sub-app subdomain (e.g. learn-ai.iiskills.cloud).
// Falls back to undefined on localhost so development cookies work normally.
const COOKIE_DOMAIN =
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN ||
  (process.env.NODE_ENV === "production" ? ".iiskills.cloud" : undefined);

function parseCookieHeader(header: string): { name: string; value: string }[] {
  if (!header) return [];
  return header.split(";").map((pair) => {
    const idx = pair.indexOf("=");
    const name = decodeURIComponent(pair.slice(0, idx).trim());
    const value = decodeURIComponent(pair.slice(idx + 1).trim());
    return { name, value };
  });
}

export function createSupabasePagesServerClient(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env missing: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.cookie || "");
      },
      setAll(cookies) {
        const setCookies = cookies.map(({ name, value, options }) => {
          // Inject cross-subdomain domain so the session cookie is visible on
          // all *.iiskills.cloud subdomains once set by apps/main API routes.
          const domain = options?.domain ?? COOKIE_DOMAIN;
          const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

          if (options?.maxAge != null) parts.push(`Max-Age=${options.maxAge}`);
          if (options?.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
          if (options?.path) parts.push(`Path=${options.path}`);
          if (domain) parts.push(`Domain=${domain}`);
          if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`);
          if (options?.secure) parts.push("Secure");
          if (options?.httpOnly) parts.push("HttpOnly");

          return parts.join("; ");
        });

        const existing = res.getHeader("Set-Cookie");
        const merged = []
          .concat(existing ? (Array.isArray(existing) ? existing : [existing]) : [])
          .concat(setCookies);

        res.setHeader("Set-Cookie", merged);
      },
    },
  });
}
