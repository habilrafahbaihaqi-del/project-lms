import Link from "next/link";
import { ArrowRight, BookOpen, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20 text-sm font-medium mb-4">
          <Star size={16} className="text-yellow-500" />
          <span>Platform Pembelajaran Digital No. 1</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-white tracking-tight leading-tight">
          Tingkatkan Keahlianmu, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Kuasai Karier Masa Depan
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Pelajari keterampilan profesional langsung dari praktisi industri.
          Akses materi terstruktur, studi kasus dunia nyata, dan tingkatkan
          nilai profesionalmu sekarang.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/courses">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] rounded-xl w-full sm:w-auto"
            >
              Lihat Katalog Kelas <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl w-full sm:w-auto"
            >
              Buat Akun Gratis
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-16 border-t border-slate-800/60 mt-16 text-left max-w-3xl mx-auto">
          <div className="flex flex-col space-y-2 items-center md:items-start">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
              <BookOpen size={24} />
            </div>
            <h3 className="text-white font-bold text-lg">Materi Terstruktur</h3>
            <p className="text-slate-400 text-sm text-center md:text-left">
              Kurikulum didesain khusus untuk kebutuhan industri.
            </p>
          </div>
          <div className="flex flex-col space-y-2 items-center md:items-start">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
              <Users size={24} />
            </div>
            <h3 className="text-white font-bold text-lg">Akses Selamanya</h3>
            <p className="text-slate-400 text-sm text-center md:text-left">
              Belajar kapan saja tanpa batas waktu berlangganan.
            </p>
          </div>
          <div className="flex flex-col space-y-2 items-center md:items-start col-span-2 md:col-span-1">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2">
              <Star size={24} />
            </div>
            <h3 className="text-white font-bold text-lg">Sertifikat Resmi</h3>
            <p className="text-slate-400 text-sm text-center md:text-left">
              Validasi keahlianmu untuk membangun portofolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
