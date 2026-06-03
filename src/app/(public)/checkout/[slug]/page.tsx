"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Loader2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getCourseBySlug } from "../../courses/actions";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await getCourseBySlug(slug);
        setCourse(data);
      } catch (error) {
        toast.error("Gagal memuat detail kelas");
      }
      setIsLoading(false);
    }
    fetchCourse();
  }, [slug]);

  // Fungsi untuk memanggil API Checkout & Membuka Midtrans Snap
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Terjadi kesalahan saat memproses pesanan.",
        );
      }

      // Jika kelas gratis, langsung ke dashboard
      if (data.isFree) {
        toast.success(data.message);
        router.push("/dashboard");
        return;
      }

      // Memanggil Jendela Midtrans Snap
      (window as any).snap.pay(data.token, {
        onSuccess: function (result: any) {
          toast.success("Pembayaran berhasil!");
          router.push("/dashboard");
        },
        onPending: function (result: any) {
          toast.info("Menunggu pembayaran Anda...");
          router.push("/dashboard");
        },
        onError: function (result: any) {
          toast.error("Pembayaran gagal diproses.");
          setIsProcessing(false);
        },
        onClose: function () {
          toast.error("Anda menutup jendela sebelum menyelesaikan pembayaran.");
          setIsProcessing(false);
        },
      });
    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b19]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#060b19] text-center px-6 text-slate-200">
        <h3>Kelas tidak ditemukan.</h3>
        <Button onClick={() => router.push("/courses")} className="mt-4">
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#060b19] text-slate-50 py-12 px-6 min-h-screen">
      {/* Script Midtrans (Dimuat secara dinamis) */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="container mx-auto max-w-5xl">
        <Link
          href={`/courses/${slug}`}
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-2" /> Batal dan Kembali
        </Link>

        <h1 className="text-3xl font-bold font-heading text-slate-100 mb-8">
          Checkout Pembelajaran
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Kolom Kiri: Detail Kelas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b1226] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-4 mb-6">
                Informasi Kelas
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-40 aspect-video sm:aspect-square bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                  {course.thumbnail_url && (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 leading-tight mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 mr-2"
                      />{" "}
                      Akses materi selamanya
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 mr-2"
                      />{" "}
                      Sertifikat penyelesaian
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4 text-blue-100">
              <ShieldCheck
                className="text-blue-400 shrink-0 mt-0.5"
                size={24}
              />
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">
                  Transaksi Aman Terlindungi
                </h4>
                <p className="text-sm text-blue-200/80 leading-relaxed">
                  Pembayaran Anda diproses secara instan dan dienkripsi oleh
                  sistem keamanan berlapis berstandar bank (Midtrans).
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Rincian Pembayaran */}
          <div className="space-y-6">
            <div className="bg-[#0b1226] border border-slate-800/80 rounded-2xl p-6 shadow-lg sticky top-28">
              <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-4 mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 text-sm text-slate-300 mb-6">
                <div className="flex justify-between">
                  <span>Harga Normal</span>
                  <span>Rp {course.price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Diskon Kelas</span>
                  <span>- Rp 0</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between text-lg font-bold text-slate-100">
                  <span>Total Tagihan</span>
                  <span>Rp {course.price.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Area Input Voucher (UI Dummy sementara untuk PRD) */}
              <div className="mb-6 relative">
                <Input
                  placeholder="Masukkan kode voucher"
                  className="bg-slate-900 border-slate-700 text-slate-200 pr-24 h-11"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-1 top-1 h-9 bg-slate-800 text-slate-300 hover:text-white"
                >
                  Terapkan
                </Button>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-[0_0_20px_rgba(37,99,235,0.3)] rounded-xl flex items-center justify-center"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5" />
                )}
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              </Button>
              <div className="mt-4 flex items-center justify-center space-x-2 grayscale opacity-50">
                <img
                  src="https://gopay.co.id/icon.png"
                  alt="Gopay"
                  className="h-4 object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/86/Bank_Central_Asia.svg"
                  alt="BCA"
                  className="h-4 object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                  Powered by Midtrans
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
