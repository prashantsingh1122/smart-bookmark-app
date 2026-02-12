"use server";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

export type ActionState = {
  ok?: boolean;
  error?: string;
};

export async function addBookmark(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();

  if (!title) return { error: "Title is required" };
  if (!url) return { error: "URL is required" };
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return { error: "URL must start with http(s)" };
  } catch {
    return { error: "Invalid URL" };
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("bookmarks")
    .insert({ title, url, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/bookmarks");
  return { ok: true };
}

export async function deleteBookmark(id: string): Promise<ActionState> {
  if (!id) return { error: "Missing id" };
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Only delete if bookmark belongs to current user
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/bookmarks");
  return { ok: true };
}
