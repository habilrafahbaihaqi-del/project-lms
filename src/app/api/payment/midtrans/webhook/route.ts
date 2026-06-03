import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      order_id, // Ini adalah order_number di database kita
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    // 1. Validasi Keamanan (Signature Key) dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      console.error("Webhook Invalid Signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Gunakan Service Role Key untuk bypass RLS (karena tidak ada sesi user)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Cari Order di Database berdasarkan order_number
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Konversi Status Midtrans ke Status Internal Kita
    let internalStatus = order.status;
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      if (fraud_status === "challenge") {
        internalStatus = "pending"; // Midtrans mencurigai transaksi
      } else {
        internalStatus = "success"; // Pembayaran Lunas!
      }
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny"
    ) {
      internalStatus = "failed";
    } else if (transaction_status === "expire") {
      internalStatus = "expired";
    }

    // 5. Update Status Order di Database
    await supabaseAdmin
      .from("orders")
      .update({ status: internalStatus, updated_at: new Date().toISOString() })
      .eq("id", order.id);

    // 6. AUTO-ENROLLMENT: Jika status sukses, berikan akses kelas!
    if (internalStatus === "success") {
      // Cek apakah user sudah di-enroll (mencegah duplikasi data jika webhook terpanggil 2x)
      const { data: existingEnrollment } = await supabaseAdmin
        .from("enrollments")
        .select("id")
        .eq("order_id", order.id)
        .single();

      if (!existingEnrollment) {
        await supabaseAdmin.from("enrollments").insert({
          user_id: order.user_id,
          course_id: order.course_id,
          order_id: order.id,
          status: "active",
        });
      }
    }

    // Kembalikan 200 OK agar Midtrans tahu kita sudah menerima pesannya
    return NextResponse.json(
      { message: "Webhook berhasil diproses" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Webhook Error System:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
