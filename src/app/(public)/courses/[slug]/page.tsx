"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  PlayCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourseBySlug } from "../actions";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk melacak modul mana yang sedang dibuka (Accordion)
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await getCourseBySlug(slug);
        setCourse(data);
        // Otomatis buka bab pertama
        if (data?.modules?.length > 0) {
          setOpenModuleId(data.modules[0].id);
        }
      } catch (error) {
        console.error("Gagal memuat course:", error);
      }
      setIsLoading(false);
    }
    fetchCourse();
  }, [slug]);

  const toggleModule = (id: string) => {
    setOpenModuleId(openModuleId === id ? null : id);
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#060b19] text-center px-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">
          Kelas Tidak Ditemukan
        </h1>
        <p className="text-slate-400 mb-8">
          Kelas yang Anda cari mungkin sudah tidak tersedia atau URL tidak
          valid.
        </p>
        <Link href="/courses">
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Kembali ke Katalog
          </Button>
        </Link>
      </div>
    );
  }

  // Menghitung total materi
  const totalLessons =
    course.modules?.reduce(
      (total: number, mod: any) => total + (mod.lessons?.length || 0),
      0,
    ) || 0;

  return (
    <div className="flex-1 bg-[#060b19] text-slate-50 pb-24">
      {/* 1. Header & Hero Section */}
      <div className="bg-[#080d1e] border-b border-slate-800/60 pt-10 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/courses"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" /> Kembali ke Katalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1.5 rounded-md">
                {course.category?.name || "Kategori Umum"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-50 tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed line-clamp-3">
                {course.description ||
                  "Bergabunglah dengan kelas ini untuk meningkatkan keahlian Anda ke level selanjutnya."}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-slate-300">
                <div className="flex items-center space-x-2">
                  <BookOpen size={18} className="text-blue-500" />
                  <span>{course.modules?.length || 0} Bab Utama</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PlayCircle size={18} className="text-purple-500" />
                  <span>{totalLessons} Materi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  <span>Akses Selamanya</span>
                </div>
              </div>
            </div>

            {/* Kotak Harga & CTA (Tampil di atas untuk mobile, di kanan untuk Desktop) */}
            <div className="bg-[#0b1226] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

              <div className="aspect-video w-full rounded-xl bg-slate-900 border border-slate-800 mb-6 overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={48} className="text-slate-700" />
                  </div>
                )}
              </div>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-slate-400 text-sm mb-1">
                    Investasi Belajar
                  </p>
                  <p className="text-4xl font-extrabold text-slate-50">
                    {course.price === 0
                      ? "Gratis"
                      : `Rp ${course.price.toLocaleString("id-ID")}`}
                  </p>
                </div>

                {/* CTA - Akan diarahkan ke halaman checkout */}
                <Link href={`/checkout/${slug}`} className="block">
                  <Button className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] rounded-xl">
                    {course.price === 0
                      ? "Daftar Sekarang (Gratis)"
                      : "Beli Course Ini"}
                  </Button>
                </Link>
                <p className="text-xs text-center text-slate-500 font-medium">
                  * Pembayaran aman & garansi akses instan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content & Silabus */}
      <div className="container mx-auto max-w-6xl px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Deskripsi */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-heading text-slate-100 border-b border-slate-800 pb-4">
              Tentang Kelas Ini
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
              {course.description}
            </div>
          </section>

          {/* Kurikulum / Silabus */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold font-heading text-slate-100">
                Silabus Kurikulum
              </h2>
              <span className="text-sm font-medium text-slate-400 bg-slate-900 px-3 py-1 rounded-full">
                {totalLessons} Materi
              </span>
            </div>

            <div className="space-y-4">
              {course.modules?.length === 0 ? (
                <p className="text-slate-500 italic">
                  Silabus sedang dalam tahap penyusunan.
                </p>
              ) : (
                course.modules?.map((mod: any, index: number) => (
                  <div
                    key={mod.id}
                    className="border border-slate-800/80 rounded-2xl bg-[#0b1226] overflow-hidden"
                  >
                    {/* Header Bab (Bisa di-klik) */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-slate-900/40 hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <div>
                        <span className="text-sm text-blue-500 font-semibold mb-1 block">
                          Bab {index + 1}
                        </span>
                        <h3 className="font-semibold text-slate-200">
                          {mod.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 text-slate-400">
                        <span className="text-xs">
                          {mod.lessons?.length || 0} Materi
                        </span>
                        {openModuleId === mod.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </button>

                    {/* Isi Materi (Tampil jika Bab dibuka) */}
                    {openModuleId === mod.id && (
                      <div className="px-6 py-2 border-t border-slate-800/80 bg-[#0b1226]">
                        {mod.lessons?.length === 0 ? (
                          <p className="text-sm text-slate-500 py-3">
                            Belum ada materi.
                          </p>
                        ) : (
                          <div className="divide-y divide-slate-800/60">
                            {mod.lessons?.map((les: any, lIdx: number) => (
                              <div
                                key={les.id}
                                className="py-4 flex items-start space-x-3"
                              >
                                {les.content_type === "video" ? (
                                  <PlayCircle
                                    size={18}
                                    className="text-slate-500 mt-0.5 shrink-0"
                                  />
                                ) : (
                                  <FileText
                                    size={18}
                                    className="text-slate-500 mt-0.5 shrink-0"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-slate-300">
                                    {lIdx + 1}. {les.title}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
