"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Arahkan kembali ke halaman login setelah keluar
  redirect("/login");
}
