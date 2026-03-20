import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

// Minimal subset of cookie options we actually use in this file.
// Avoids depending on @supabase/ssr's exported TS types (which can vary by version).
type CookieOptionsWithName = {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | string;
  maxAge?: number;
};

// Inject .iiskills.cloud domain on all auth cookies so sessions are shared
// across every sub-app subdomain (e.g. learn-ai.iiskills.cloud).
// Falls back to undefined on localhost so development cookies work normally.
const COOKIE_DOMAIN =
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN ||
  (process.env.NODE_ENV === "production" ? ".iiskills.cloud" : undefined);

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
        // Inject cross-subdomain domain so the session cookie is visible on
        // all *.iiskills.cloud subdomains once set by apps/main API routes.
        const merged = COOKIE_DOMAIN
          ? { ...options, domain: options.domain ?? COOKIE_DOMAIN }
          : options;
        // Next API routes can set cookies via Set-Cookie header.
        // Multiple cookies must be appended, not overwritten.
        const cookie = serializeCookie(name, value, merged);
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
        const merged = COOKIE_DOMAIN
          ? { ...options, domain: options.domain ?? COOKIE_DOMAIN }
          : options;
        const cookie = serializeCookie(name, "", { ...merged, maxAge: 0 });
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

// Minimal cookie serializer that matches the local CookieOptionsWithName type.
function serializeCookie(name: string, value: string, options: CookieOptionsWithName) {
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
