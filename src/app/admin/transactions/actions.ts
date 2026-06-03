"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Mengambil seluruh data pesanan beserta info pembeli dan judul course
export async function getTransactions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, order_number, final_price, status, created_at,
      user:profiles!user_id(name, email),
      course:courses(title)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil transaksi:", error);
    return [];
  }
  return data || [];
}

// Menyetujui pesanan secara manual dan membukakan akses kelas
export async function manualApproveOrder(orderId: string) {
  const supabase = await createClient();

  // 1. Ambil detail order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) return { error: "Pesanan tidak ditemukan." };
  if (order.status === "success" || order.status === "manual_approved") {
    return { error: "Pesanan ini sudah berstatus sukses." };
  }

  // 2. Cek apakah siswa sudah punya akses (mencegah duplikasi data)
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("order_id", orderId)
    .single();

  if (!existingEnrollment) {
    // 3. Masukkan siswa ke dalam kelas (Auto-Enrollment manual)
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: order.user_id,
      course_id: order.course_id,
      order_id: order.id,
      status: "active",
    });

    if (enrollError)
      return { error: "Gagal memberikan akses kelas kepada siswa." };
  }

  // 4. Ubah status pesanan menjadi manual_approved
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "manual_approved", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (updateError) return { error: "Gagal memperbarui status pesanan." };

  revalidatePath("/admin/transactions");
  return { success: true };
}
