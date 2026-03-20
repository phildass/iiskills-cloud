import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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
          const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

          if (options?.maxAge != null) parts.push(`Max-Age=${options.maxAge}`);
          if (options?.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
          if (options?.path) parts.push(`Path=${options.path}`);
          if (options?.domain) parts.push(`Domain=${options.domain}`);
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
