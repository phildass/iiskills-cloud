import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

// This middleware protects /admin routes by checking for authentication
// All /admin routes require authentication, preventing direct URL access
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route
  if (pathname.startsWith("/admin")) {
    // Try to create Supabase client for session validation
    const supabaseClient = await createClient(request);
    
    if (supabaseClient) {
      // Supabase is configured - check Supabase session
      const { supabase, response } = supabaseClient;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // No Supabase session - allow access to /admin for login
        if (pathname === "/admin") {
          return response;
        }
        
        // For any other /admin subroutes, redirect to /admin login
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
      
      // Verify email is confirmed (additional security layer)
      // Note: When Supabase email confirmation is properly configured, auth.getUser() 
      // should only return users with confirmed emails. This check provides defense-in-depth
      // for cases where email confirmation is enforced at the project level.
      if (user.email_confirmed_at === null && user.confirmed_at === null) {
        // User hasn't confirmed their email - redirect to login
        if (pathname === "/admin") {
          return response;
        }
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
      
      // Check if user has admin role - CRITICAL SECURITY CHECK
      // Only users with user_metadata.is_admin === true can access admin routes
      const isAdmin = user.user_metadata?.is_admin === true;
      
      if (!isAdmin) {
        // User is authenticated but not an admin
        // Redirect to home page with unauthorized message
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
      
      // User is authenticated and is an admin - set compatibility cookie
      const isProduction = process.env.NODE_ENV === "production";
      response.cookies.set("learnapt-admin-auth", "true", {
        path: "/",
        sameSite: "strict",
        secure: isProduction,
      });
      
      return response;
    } else {
      // Supabase not configured - fall back to cookie-based auth
      const authCookie = request.cookies.get("learnapt-admin-auth");
      
      if (!authCookie || authCookie.value !== "true") {
        // Allow access to /admin root for login form
        if (pathname === "/admin") {
          return NextResponse.next();
        }
        
        // For any other /admin subroutes, redirect to /admin login
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    // Match /admin and all /admin subroutes
    "/admin",
    "/admin/:path*",
  ],
};
