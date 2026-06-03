import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // 1. Inisialisasi Supabase & Cek Sesi User
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Anda harus login untuk membeli kelas" },
        { status: 401 },
      );
    }

    // 2. Ambil data dari request frontend
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "ID Course tidak valid" },
        { status: 400 },
      );
    }

    // 3. Ambil Detail Course dari Database
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title, price")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cek apakah user sudah pernah membeli kelas ini sebelumnya
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Anda sudah memiliki kelas ini" },
        { status: 400 },
      );
    }

    // Ambil detail profil user untuk dikirim ke Midtrans
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, whatsapp")
      .eq("auth_user_id", user.id)
      .single();

    // 4. Generate Nomor Order Unik
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const amount = course.price;

    // 5. Simpan Pesanan ke Database (Status: Pending)
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        course_id: course.id,
        order_number: orderNumber,
        original_price: amount,
        final_price: amount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw new Error("Gagal membuat pesanan di database");

    // LOMPATAN LOGIKA: Jika kelas GRATIS, langsung sukseskan tanpa Midtrans
    if (amount === 0) {
      // Ubah status order jadi success
      await supabase
        .from("orders")
        .update({ status: "success" })
        .eq("id", orderData.id);
      // Masukkan ke enrollments
      await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: course.id,
        order_id: orderData.id,
        status: "active",
      });
      return NextResponse.json({
        isFree: true,
        message: "Kelas gratis berhasil diklaim!",
      });
    }

    // 6. Siapkan Payload untuk Midtrans Snap API
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    // Midtrans mewajibkan Server Key dienkripsi ke Base64 dengan titik dua di belakangnya
    const encodedKey = Buffer.from(serverKey + ":").toString("base64");
    const midtransUrl = process.env.MIDTRANS_API_URL!;

    const midtransPayload = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: amount,
      },
      customer_details: {
        first_name: profile?.name || "Member",
        last_name: "Klassa",
        email: user.email,
        phone: profile?.whatsapp || "",
      },
      item_details: [
        {
          id: course.id.substring(0, 10),
          price: amount,
          quantity: 1,
          name: course.title.substring(0, 50), // Midtrans membatasi panjang nama item maksimal 50 karakter
        },
      ],
    };

    // 7. Panggil Server Midtrans
    const response = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
      body: JSON.stringify(midtransPayload),
    });

    const midtransData = await response.json();

    if (!response.ok) {
      console.error("Midtrans Error:", midtransData);
      throw new Error(
        midtransData.error_messages?.[0] ||
          "Gagal menghubungi layanan pembayaran",
      );
    }

    // 8. Simpan Token Midtrans ke Database Order kita
    await supabase
      .from("orders")
      .update({
        payment_token: midtransData.token,
        payment_redirect_url: midtransData.redirect_url,
      })
      .eq("id", orderData.id);

    // 9. Kembalikan Token ke Frontend agar Pop-up muncul
    return NextResponse.json({
      token: midtransData.token,
      redirect_url: midtransData.redirect_url,
    });
  } catch (error: any) {
    console.error("API Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
