"use server";

import { createClient } from "@/lib/supabase/server";

// Mengambil semua kategori untuk menu filter
export async function getPublicCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// Mengambil hanya course yang berstatus 'published'
export async function getPublishedCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id, title, slug, description, price, level, thumbnail_url,
      category:categories(name)
    `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// Mengambil detail course dan silabus kurikulum berdasarkan slug
export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      category:categories(name),
      modules (
        id, title, sort_order,
        lessons (id, title, content_type, sort_order)
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) throw new Error(error.message);

  // Urutkan modul dan materi secara berurutan sesuai pengaturan Super Admin
  if (data && data.modules) {
    data.modules.sort((a: any, b: any) => a.sort_order - b.sort_order);
    data.modules.forEach((mod: any) => {
      mod.lessons.sort((a: any, b: any) => a.sort_order - b.sort_order);
    });
  }

  return data;
}
