/**
 * Next.js Edge Middleware — learn-ai
 *
 * Admin bypass: if the request URL contains ?admin_access=true (appended by
 * admin preview links from apps/main), the request is tagged with the
 * x-admin-access header and allowed through without any payment redirect.
 *
 * All other requests pass through unchanged — access control for lesson
 * pages is handled client-side by the useUserAccess hook.
 */
import { NextResponse } from "next/server";

export function middleware(request) {
  const { searchParams } = request.nextUrl;

  if (searchParams.get("admin_access") === "true") {
    // Admin preview — pass through immediately, disable any payment redirect.
    const response = NextResponse.next();
    response.headers.set("x-admin-access", "1");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|images/).*)"],
};
