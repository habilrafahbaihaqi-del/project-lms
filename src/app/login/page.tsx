"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Eye,
  Shield,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await login(formData);

    if (result?.error) {
      setError("Email atau kata sandi salah.");
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050914] p-4 sm:p-8 text-slate-50 overflow-hidden">
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="z-10 grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Kolom Kiri */}
        <div className="hidden lg:flex flex-col space-y-10">
          <div className="space-y-4">
            <h1 className="flex items-center space-x-3 text-5xl font-bold tracking-tight font-heading">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-3xl font-extrabold text-white">
                K
              </span>
              <span>
                Klassa <span className="text-blue-500">Site</span>
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Platform LMS modern untuk belajar, mengajar, dan berkembang
              bersama.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">
                  Kelola & Akses Materi
                </h3>
                <p className="text-sm text-slate-400">
                  Akses ribuan course berkualitas kapan saja, di mana saja.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">
                  Pantau Progres Belajar
                </h3>
                <p className="text-sm text-slate-400">
                  Lihat perkembangan Anda dengan laporan yang akurat.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">
                  Aman & Terpercaya
                </h3>
                <p className="text-sm text-slate-400">
                  Keamanan data berstandar tinggi untuk pengalaman belajar
                  terbaik.
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex max-w-sm items-center space-x-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
            <Shield className="text-blue-500" size={24} />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                Akses aman & terenkripsi
              </h4>
              <p className="text-xs text-slate-400">
                Data Anda dilindungi dengan enkripsi end-to-end.
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="flex justify-center lg:justify-end w-full">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-700/50 bg-slate-900/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex lg:hidden justify-center items-center space-x-2 mb-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-2xl font-extrabold text-white font-heading">
                K
              </span>
              <span className="text-2xl font-bold font-heading">
                Klassa <span className="text-blue-500">Site</span>
              </span>
            </div>

            <div className="mb-8 text-center space-y-2">
              <div className="mx-auto mb-4 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-50 font-heading">
                Masuk ke Akun Anda
              </h2>
              <p className="text-sm text-slate-400">
                Selamat datang kembali! Silakan masuk untuk melanjutkan.
              </p>
            </div>

            <form action={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="Masukkan email Anda"
                  className="bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Kata Sandi
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    placeholder="Masukkan kata sandi Anda"
                    className="bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-500 hover:text-blue-400 hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-700"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0c1222] px-2 text-slate-400">atau</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-slate-950/50 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Masuk dengan Akun Google
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-500 hover:text-blue-400 hover:underline"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
