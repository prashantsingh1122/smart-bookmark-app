"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { DeleteBookmarkButton } from "./DeleteBookmarkButton";
import type { Bookmark } from "@/types/bookmark";

type Props = {
  initialBookmarks: Bookmark[];
  userId: string;
};

export function BookmarkList({ initialBookmarks, userId }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Subscribe to realtime changes for this user's bookmarks
    const channel = supabase
      .channel("bookmarks-realtime")
      .on<Bookmark>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Add new bookmark to the top of the list
          setBookmarks((prev) => [payload.new, ...prev]);
        }
      )
      .on<Bookmark>(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Remove deleted bookmark from list
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
        }
      )
      .subscribe(() => {
        setIsLoading(false);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (isLoading && bookmarks.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!bookmarks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-4xl mb-3">🔖</div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          No bookmarks yet
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-sm">
          Start saving your favorite links above. They'll appear here instantly and sync across all your devices.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <a
          key={bookmark.id}
          href={bookmark.url}
          target="_blank"
          rel="noreferrer"
          className="group block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-700 dark:hover:shadow-lg/20 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {bookmark.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {new URL(bookmark.url).hostname}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: bookmark.created_at.startsWith(new Date().getFullYear().toString()) ? undefined : "numeric",
                })}
              </p>
            </div>
            <DeleteBookmarkButton id={bookmark.id} />
          </div>
        </a>
      ))}
    </div>
  );
}
