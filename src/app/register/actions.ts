"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const institution = formData.get("institution") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  // 1. Daftarkan akun (Trigger database akan otomatis mengisi tabel profiles)
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        whatsapp: whatsapp || null,
        institution: institution || null,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // 2. Hapus sesi otomatis bawaan Supabase agar user benar-benar 'logout'
  await supabase.auth.signOut();

  // 3. Arahkan user ke halaman login
  redirect("/login");
}
