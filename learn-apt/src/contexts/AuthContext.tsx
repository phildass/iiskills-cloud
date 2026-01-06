"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

// Optional legacy fallback admin password (for dev only)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "phil123";
const AUTH_STORAGE_KEY = "learnapt-admin-auth";

// Cookie helpers - only run on client
function setAuthCookie(value: string) {
  if (typeof window === 'undefined') return;
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = [
    `learnapt-admin-auth=${value}`,
    "path=/",
    "SameSite=Strict",
    isProduction ? "Secure" : "",
  ].filter(Boolean).join("; ");
  document.cookie = cookieOptions;
}

function clearAuthCookie() {
  if (typeof window === 'undefined') return;
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = [
    "learnapt-admin-auth=",
    "path=/",
    "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "SameSite=Strict",
    isProduction ? "Secure" : "",
  ].filter(Boolean).join("; ");
  document.cookie = cookieOptions;
}

function getAuthCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const cookieAuth = document.cookie
    .split("; ")
    .find((row) => row.startsWith("learnapt-admin-auth="));
  return cookieAuth?.split("=")[1] === "true";
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  useSupabase: boolean;
  userEmail?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  // Detect Supabase configuration on mount
  useEffect(() => {
    setUseSupabase(!!(supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  }, [supabase]);

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      if (useSupabase && supabase) {
        // Supabase session init
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setUser(session.user);
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            setAuthCookie("true");
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setUserEmail(null);
            clearAuthCookie();
          }
        } catch {
          setUser(null);
          setIsAuthenticated(false);
          setUserEmail(null);
          clearAuthCookie();
        }
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setUser(session.user);
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            setAuthCookie("true");
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setUserEmail(null);
            clearAuthCookie();
          }
        });
        setIsLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Legacy cookie fallback (dev/demo only)
        if (typeof window !== 'undefined') {
          try {
            const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
            const hasCookie = getAuthCookie();
            const isAuth = storedAuth === "true" || hasCookie;
            setIsAuthenticated(isAuth);
            setUser(null);
            setUserEmail(null);
            if (isAuth && storedAuth !== "true") {
              sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
            }
          } catch {
            setIsAuthenticated(false);
          }
        }
        setIsLoading(false);
      }
    };
    initAuth();
  }, [useSupabase, supabase]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Provide user-friendly error messages for common authentication issues
          // Note: String matching is defensive - Supabase should provide consistent error messages
          const errorMsg = error.message.toLowerCase();
          if (errorMsg.includes('email not confirmed') || 
              errorMsg.includes('verify') ||
              errorMsg.includes('confirmation')) {
            return { 
              success: false, 
              error: "Please confirm your email address before logging in. Check your inbox for the confirmation link." 
            };
          }
          return { success: false, error: error.message };
        }
        if (data.session) {
          setUser(data.session.user);
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || null);
          setAuthCookie("true");
          return { success: true };
        }
        return { success: false, error: "Failed to create session" };
      } catch {
        return { success: false, error: "An unexpected error occurred" };
      } finally {
        setIsLoading(false);
      }
    } else {
      // Legacy fallback (dev/demo only)
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        }
        setAuthCookie("true");
        setUser(null);
        setUserEmail(email ?? null);
        setIsLoading(false);
        return { success: true };
      }
      setIsAuthenticated(false);
      setIsLoading(false);
      return { success: false, error: "Invalid password" };
    }
  };

  // Register function
  const register = async (email: string, password: string) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          if (data.user.identities && data.user.identities.length === 0)
            return { success: false, error: "An account with this email already exists" };
          if (data.session) {
            setUser(data.session.user);
            setIsAuthenticated(true);
            setUserEmail(data.session.user.email || null);
            setAuthCookie("true");
            return { success: true };
          }
          // Email needs confirmation - provide clear instructions
          return { 
            success: true, 
            error: "Registration successful! Please check your email inbox for a confirmation link. You must confirm your email before you can log in." 
          };
        }
        return { success: false, error: "Failed to create account" };
      } catch {
        return { success: false, error: "An unexpected error occurred" };
      }
    } else {
      return { success: false, error: "Registration is not available. Use the default password (dev only)." };
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    if (useSupabase && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // log but ignore
      }
      setUser(null);
      setIsAuthenticated(false);
      setUserEmail(null);
      clearAuthCookie();
      setIsLoading(false);
    } else {
      // Legacy
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
      clearAuthCookie();
      setUser(null);
      setUserEmail(null);
      setIsLoading(false);
    }
  };

  // Helper: Admin detection - checks user_metadata.is_admin
  // For fallback auth (when useSupabase is false), authenticated users are admin
  const isAdmin = useSupabase 
    ? (user ? (user.user_metadata?.is_admin === true) : false)
    : isAuthenticated; // Fallback: all authenticated users are admin

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    logout,
    register,
    useSupabase,
    userEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}