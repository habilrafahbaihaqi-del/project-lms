import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#060b19] text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navbar Publik */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#060b19]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center space-x-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-extrabold text-white font-heading shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              K
            </span>
            <span className="text-2xl font-bold font-heading tracking-tight">
              Klassa
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <Link
              href="/courses"
              className="hover:text-white transition-colors"
            >
              Katalog Kelas
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Testimoni
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800 hidden sm:flex"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Konten Halaman */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer Sederhana */}
      <footer className="border-t border-slate-800/60 bg-[#080d1e] py-8 text-center text-slate-400">
        <p className="text-sm">
          © {new Date().getFullYear()} Klassa. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
