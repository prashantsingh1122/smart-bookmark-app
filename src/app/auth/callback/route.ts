import { NextResponse, NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// Handles the OAuth redirect from Supabase (Google in this setup)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/bookmarks";
  const errorParam = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // Debug: Log all received parameters
  console.log("Auth callback received:", {
    url: req.url,
    code: code ? "present" : "missing",
    error: errorParam,
    errorDescription,
    allParams: Object.fromEntries(url.searchParams)
  });

  // Handle OAuth errors (e.g., user denied access)
  if (errorParam) {
    console.error("OAuth error:", errorParam, errorDescription);
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", errorDescription || errorParam);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    // No code parameter - this shouldn't happen in normal OAuth flow
    console.error("No authorization code received in callback");
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "No authorization code received. Check OAuth configuration.");
    return NextResponse.redirect(loginUrl);
  }

  // Exchange code for session
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error.message);
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "Authentication failed: " + error.message);
    return NextResponse.redirect(loginUrl);
  }

  // Verify session was established successfully
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Session established but no user found");
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "Session verification failed. Please try again.");
    return NextResponse.redirect(loginUrl);
  }

  console.log("Authentication successful for user:", user.email);

  // Redirect to intended destination
  return NextResponse.redirect(new URL(next, url.origin));
}
