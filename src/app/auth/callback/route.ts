import { NextResponse, NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// Handles the OAuth redirect from Supabase (Google in this setup)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/bookmarks";
  const errorParam = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // Handle OAuth errors (e.g., user denied access)
  if (errorParam) {
    console.error("OAuth error:", errorParam, errorDescription);
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", errorDescription || errorParam);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Session exchange error:", error.message);
      const loginUrl = new URL("/login", url.origin);
      loginUrl.searchParams.set("error", "Authentication failed. Please try again.");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to intended destination
  return NextResponse.redirect(new URL(next, url.origin));
}
