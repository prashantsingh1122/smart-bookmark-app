"use client";
import { useActionState, useRef, useEffect, useState } from "react";
import { addBookmark, ActionState } from "@/app/bookmarks/actions";

const VALID_URL_PATTERN = /^https?:\/\/.+/;

export function AddBookmarkForm() {
  const [state, formAction, pending] = useActionState<ActionState | undefined, FormData>(
    addBookmark,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // Reset form on success
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setUrl("");
      setUrlError("");
    }
  }, [state]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);

    // Validate URL in real-time
    if (value && !VALID_URL_PATTERN.test(value)) {
      setUrlError("URL must start with http:// or https://");
    } else {
      setUrlError("");
    }
  };

  const isFormValid = url && !urlError;

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-sm">
        <div className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Bookmark Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., GitHub, My Blog, Documentation"
              required
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder:text-zinc-500 dark:focus:ring-blue-400 transition-colors"
            />
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Bookmark URL
            </label>
            <input
              id="url"
              name="url"
              type="text"
              placeholder="https://example.com"
              required
              value={url}
              onChange={handleUrlChange}
              className={`w-full rounded-md border px-4 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors dark:bg-zinc-800 dark:placeholder:text-zinc-500 ${
                urlError
                  ? "border-red-300 focus:ring-red-500 dark:border-red-700 dark:focus:ring-red-400"
                  : "border-zinc-300 focus:ring-blue-500 dark:border-zinc-700 dark:focus:ring-blue-400"
              }`}
            />
            {urlError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>⚠️</span>
                <span>{urlError}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={pending || !isFormValid}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {pending && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span>{pending ? "Adding bookmark..." : "Add Bookmark"}</span>
          </button>

          {/* Error Message from Server */}
          {state?.error && (
            <div className="rounded-md bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <span className="mt-0.5">✕</span>
              <span>{state.error}</span>
            </div>
          )}

          {/* Success Message */}
          {state?.ok && (
            <div className="rounded-md bg-green-50 dark:bg-green-950 p-3 text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
              <span>✓</span>
              <span>Bookmark added successfully!</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
