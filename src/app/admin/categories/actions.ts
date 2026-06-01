"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveCategory(formData: FormData, id?: string) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // Otomatis membuat slug dari nama (contoh: "Web Design" -> "web-design")
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (id) {
    // Mode Update
    const { error } = await supabase
      .from("categories")
      .update({ name, slug, description })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    // Mode Create
    const { error } = await supabase
      .from("categories")
      .insert({ name, slug, description });
    if (error) return { error: error.message };
  }

  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
