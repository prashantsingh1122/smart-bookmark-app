"use client";
import { useTransition } from "react";
import { deleteBookmark } from "@/app/bookmarks/actions";

export function DeleteBookmarkButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;
    startTransition(async () => {
      await deleteBookmark(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="p-2 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Delete bookmark"
      title="Delete bookmark"
    >
      {pending ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.006c0 .414.336.75.75.75h.006a.75.75 0 00-.756-.75v-.006a1.25 1.25 0 011.25-1.25h2.5a1.25 1.25 0 011.25 1.25v.006a.75.75 0 00-.756.75h.006a.75.75 0 00.75-.75v-.006A2.75 2.75 0 0011.25 1h-2.5zM4.78 4.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h10.44a.75.75 0 00.75-.75v-8.5a.75.75 0 00-.75-.75H4.78zM5.5 7a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 015.5 7zm4 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
