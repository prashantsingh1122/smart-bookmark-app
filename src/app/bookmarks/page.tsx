import { createServerSupabase } from "@/lib/supabase/server";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";
import type { Bookmark } from "@/types/bookmark";
import { redirect } from "next/navigation";

export default async function BookmarksPage() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="max-w-2xl mx-auto">
        <div className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
          <h2 className="font-semibold text-red-900 dark:text-red-200 mb-1">Failed to load bookmarks</h2>
          <p className="text-sm text-red-800 dark:text-red-300">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Your Bookmarks</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Save, organize, and access your bookmarks from anywhere
        </p>
      </div>

      {/* Add Bookmark Form */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Add a new bookmark</h2>
        <AddBookmarkForm />
      </div>

      {/* Bookmark List */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Your saved bookmarks {bookmarks && bookmarks.length > 0 && <span className="text-sm font-normal text-zinc-600 dark:text-zinc-400">({bookmarks.length})</span>}
        </h2>
        <BookmarkList
          initialBookmarks={(bookmarks as Bookmark[]) ?? []}
          userId={user.id}
        />
      </div>
    </section>
  );
}
