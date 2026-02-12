import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/SignInButton";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/bookmarks");

  const { error } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Welcome Back</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to access your bookmarks
          </p>
        </div>

        {/* Sign In Card */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
              <div className="flex gap-2 items-start">
                <span className="text-base">⚠️</span>
                <div>
                  <p className="font-medium">Authentication Error</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Features List */}
          <div className="space-y-3 py-4">
            <div className="flex gap-3 text-sm">
              <span className="text-lg">🔐</span>
              <p className="text-zinc-600 dark:text-zinc-400">Secure login with Google</p>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-lg">⚡</span>
              <p className="text-zinc-600 dark:text-zinc-400">Quick and seamless access</p>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-lg">🌍</span>
              <p className="text-zinc-600 dark:text-zinc-400">Sync across all devices</p>
            </div>
          </div>

          {/* Sign In Button */}
          <SignInButton redirectTo="/bookmarks" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
