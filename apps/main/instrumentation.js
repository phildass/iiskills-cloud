/**
 * Next.js Server Instrumentation
 *
 * This file is automatically loaded by Next.js at server startup (before any
 * API routes or page handlers run). It is the designated place for one-time
 * server-side initialisation such as loading environment variables.
 *
 * Loading /etc/iiskills.env here ensures that backend-only secrets
 * (e.g. ADMIN_SESSION_SIGNING_KEY, SUPABASE_SERVICE_ROLE_KEY) are
 * available to every API route without adding dotenv calls to each
 * individual handler.
 *
 * IMPORTANT: This file runs only on the server (Node.js runtime).
 * It is never sent to the browser, so secrets loaded here stay server-side.
 *
 * Reference: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Load env vars in Node.js runtime (standard API routes and server startup).
  // Also handle the case where NEXT_RUNTIME is not set (Pages Router, some
  // server-start contexts). Skip only for Edge runtime where Node.js built-ins
  // like "fs" are unavailable.
  if (process.env.NEXT_RUNTIME !== "edge") {
    const { config } = await import("dotenv");
    config({ path: "/etc/iiskills.env" });
  }
}
