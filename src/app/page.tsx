import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-center gap-12 py-12 px-4">
      {/* Content Section */}
      <div className="max-w-2xl flex-1 space-y-6">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            Save and sync your bookmarks
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A modern bookmark manager that syncs across all your devices in real-time. Clean, fast, and privacy-focused.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 py-6">
          <div className="flex gap-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Real-time Sync</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Bookmarks sync instantly across all your devices</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">🔐</div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Privacy First</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Your bookmarks are encrypted and yours alone</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Simple & Clean</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Clutter-free interface that gets out of your way</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          {user ? (
            <>
              <Link
                href="/bookmarks"
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Go to Bookmarks
                <span className="ml-2">→</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Get Started
                <span className="ml-2">→</span>
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Learn More
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Illustration Section */}
      <div className="flex-1 relative w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 p-8 flex items-center justify-center">
        <div className="space-y-4 w-full">
          <div className="rounded-lg bg-white dark:bg-zinc-800 p-4 shadow-sm transform hover:scale-105 transition-transform">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">GitHub</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">github.com</p>
          </div>
          <div className="rounded-lg bg-white dark:bg-zinc-800 p-4 shadow-sm transform hover:scale-105 transition-transform" style={{ marginLeft: '20px' }}>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Blog Post</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">myblog.com/article</p>
          </div>
          <div className="rounded-lg bg-white dark:bg-zinc-800 p-4 shadow-sm transform hover:scale-105 transition-transform">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Documentation</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">docs.example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
