"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    return { error: authError.message };
  }

  // Jika login berhasil, cek role di tabel profiles
  if (authData.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_user_id", authData.user.id)
      .single();

    // Arahkan berdasarkan role masing-masing
    if (profile?.role === "super_admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  // Fallback (jika terjadi anomali, lemparkan ke dashboard user)
  redirect("/dashboard");
}
