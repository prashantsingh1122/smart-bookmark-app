import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm sticky top-0 z-40">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100 hover:opacity-75 transition-opacity"
        >
          <span className="text-2xl">🔖</span>
          <span className="hidden sm:inline">Smart Bookmarks</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            Home
          </Link>
          {user && (
            <Link
              href="/bookmarks"
              className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            >
              Bookmarks
            </Link>
          )}
        </div>

        {/* Right Section - Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Signed in as</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-xs">
                  {user.user_metadata?.name || user.email}
                </p>
              </div>
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
