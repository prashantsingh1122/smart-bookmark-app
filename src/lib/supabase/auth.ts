"use client";
import { supabase } from "./client";

export async function signInWithGoogle(redirectTo?: string) {
  const redirectUrl = `${window.location.origin}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`;
  console.log("Starting Google OAuth with redirect:", redirectUrl);
  console.log("Current origin:", window.location.origin);
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          // Ensures fresh Google account selection each time (optional)
          prompt: "select_account",
        },
      },
    });
    
    console.log("OAuth response:", { 
      data: data ? {
        url: data.url,
        provider: data.provider
      } : null, 
      error: error?.message 
    });
    
    if (error) {
      console.error("OAuth error:", error);
      throw error;
    }
    
    // The OAuth flow should redirect to Google automatically
    if (data?.url) {
      console.log("Redirecting to Google:", data.url);
      // Try multiple redirect methods
      try {
        window.location.href = data.url;
      } catch (e) {
        console.log("href failed, trying assign");
        window.location.assign(data.url);
      }
    }
  } catch (err) {
    console.error("Sign in error:", err);
    throw err;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
