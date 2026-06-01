"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCourses() {
  const supabase = await createClient();
  // Kita melakukan 'join' ke tabel categories untuk mendapatkan nama kategorinya
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      category:categories(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCategoriesForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createCourseDraft(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const categoryId = formData.get("category_id") as string;

  // Membuat slug unik (menambahkan stempel waktu agar tidak bentrok jika judulnya sama)
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const uniqueSlug = `${baseSlug}-${Date.now()}`;

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug: uniqueSlug,
      category_id: categoryId,
      status: "draft",
      price: 0,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // Mengembalikan ID course yang baru dibuat agar frontend bisa melakukan redirect
  return { success: true, courseId: data.id };
}

// Mengambil detail 1 course spesifik berdasarkan ID
export async function getCourseById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Menyimpan pembaruan Informasi Dasar course
export async function updateCourseBasicInfo(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const category_id = formData.get("category_id") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const level = formData.get("level") as string;

  const { error } = await supabase
    .from("courses")
    .update({
      title,
      category_id,
      description,
      price,
      level,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

// 1. Ambil Modul dan Materi sekaligus (Relational Join)
export async function getCourseCurriculum(courseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `
      *,
      lessons (*)
    `,
    )
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  // Urutkan lessons di dalam tiap module berdasarkan sort_order secara manual
  const sortedData = data?.map((mod) => ({
    ...mod,
    lessons: mod.lessons.sort((a: any, b: any) => a.sort_order - b.sort_order),
  }));

  return sortedData || [];
}

// 2. Buat Modul Baru
export async function createModule(
  courseId: string,
  title: string,
  sortOrder: number,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .insert({ course_id: courseId, title, sort_order: sortOrder })
    .select()
    .single();

  if (error) return { error: error.message };
  return { success: true, data };
}

// 3. Buat Materi (Lesson) Baru
export async function createLesson(
  moduleId: string,
  title: string,
  contentType: "video" | "pdf",
  sortOrder: number,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      title,
      content_type: contentType,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { success: true, data };
}

// 4. Update Urutan Modul (Setelah Drag & Drop)
export async function updateModulesOrder(
  modules: { id: string; sort_order: number }[],
) {
  const supabase = await createClient();

  // Lakukan update satu per satu di database
  for (const mod of modules) {
    await supabase
      .from("modules")
      .update({ sort_order: mod.sort_order })
      .eq("id", mod.id);
  }

  return { success: true };
}

// 5. Update Urutan Materi (Setelah Drag & Drop)
export async function updateLessonsOrder(
  lessons: { id: string; sort_order: number }[],
) {
  const supabase = await createClient();

  for (const les of lessons) {
    await supabase
      .from("lessons")
      .update({ sort_order: les.sort_order })
      .eq("id", les.id);
  }

  return { success: true };
}

// 1. Hapus Modul
export async function deleteModule(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// 2. Hapus Materi (Lesson)
export async function deleteLesson(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// 3. Update Status dan Thumbnail Course
export async function updateCourseSettings(
  id: string,
  status: "draft" | "published" | "archived",
  thumbnailUrl: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .update({
      status,
      thumbnail_url: thumbnailUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
