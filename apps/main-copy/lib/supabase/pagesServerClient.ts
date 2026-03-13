import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";

// Creates a Supabase client for Pages Router API routes (pages/api/*)
// that reads/writes auth cookies via the API req/res.
export function createSupabasePagesServerClient(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing SUPABASE env vars. Expected NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies?.[name];
      },
      set(name: string, value: string, options: CookieOptionsWithName) {
        // Next API routes can set cookies via Set-Cookie header.
        // Multiple cookies must be appended, not overwritten.
        const cookie = serializeCookie(name, value, options);
        const existing = res.getHeader("Set-Cookie");
        if (!existing) {
          res.setHeader("Set-Cookie", cookie);
        } else if (Array.isArray(existing)) {
          res.setHeader("Set-Cookie", [...existing, cookie]);
        } else {
          res.setHeader("Set-Cookie", [existing as string, cookie]);
        }
      },
      remove(name: string, options: CookieOptionsWithName) {
        const cookie = serializeCookie(name, "", { ...options, maxAge: 0 });
        const existing = res.getHeader("Set-Cookie");
        if (!existing) {
          res.setHeader("Set-Cookie", cookie);
        } else if (Array.isArray(existing)) {
          res.setHeader("Set-Cookie", [...existing, cookie]);
        } else {
          res.setHeader("Set-Cookie", [existing as string, cookie]);
        }
      },
    },
  });
}

// Minimal cookie serializer to avoid adding a dependency.
// Supports fields used by @supabase/ssr CookieOptionsWithName.
function serializeCookie(
  name: string,
  value: string,
  options: CookieOptionsWithName & { maxAge?: number }
) {
  const enc = encodeURIComponent;
  let str = `${name}=${enc(value)}`;

  if (options.maxAge !== undefined) str += `; Max-Age=${options.maxAge}`;
  if (options.domain) str += `; Domain=${options.domain}`;
  if (options.path) str += `; Path=${options.path}`;
  if (options.expires) str += `; Expires=${options.expires.toUTCString()}`;
  if (options.httpOnly) str += `; HttpOnly`;
  if (options.secure) str += `; Secure`;
  if (options.sameSite) str += `; SameSite=${options.sameSite}`;

  return str;
}
