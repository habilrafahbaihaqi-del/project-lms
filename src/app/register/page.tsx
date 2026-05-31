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
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "./actions"; // Import Server Action

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State baru untuk loading dan error dari database
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isMatch = password !== "" && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isFormValid = hasMinLength && hasUppercase && hasNumber && isMatch;

  // Fungsi untuk menangani Submit
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setServerError(null);

    const result = await registerUser(formData);

    if (result?.error) {
      setServerError(result.error);
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
              Mulai perjalanan belajarmu sekarang. Bergabunglah dengan ribuan
              pembelajar lainnya.
            </p>
          </div>
          {/* Sisanya sama... */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">
                  Akses Tanpa Batas
                </h3>
                <p className="text-sm text-slate-400">
                  Beli sekali, pelajari selamanya. Akses materi 24/7.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">
                  Sertifikat Kelulusan
                </h3>
                <p className="text-sm text-slate-400">
                  Dapatkan sertifikat resmi setelah menyelesaikan course.
                </p>
              </div>
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

            <div className="mb-6 text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-50 font-heading">
                Buat Akun Baru
              </h2>
              <p className="text-sm text-slate-400">
                Lengkapi data diri Anda untuk mulai belajar.
              </p>
            </div>

            {/* Hubungkan function handleSubmit ke form */}
            <form action={handleSubmit} className="space-y-4">
              {/* Alert Error Database */}
              {serverError && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
                  {serverError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-300">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="Contoh: Budi Santoso"
                  className="bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                />
              </div>

              <div className="space-y-1.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className="text-slate-300">
                    No. WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    disabled={isLoading}
                    placeholder="081234567890"
                    className="bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="institution" className="text-slate-300">
                    Instansi/Sekolah
                  </Label>
                  <Input
                    id="institution"
                    name="institution"
                    type="text"
                    disabled={isLoading}
                    placeholder="Opsional"
                    className="bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-300">
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      placeholder="Masukkan kata sandi baru"
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

                  <div className="pt-1 flex flex-col space-y-1">
                    <span
                      className={`text-xs flex items-center space-x-1.5 ${hasMinLength ? "text-green-500" : "text-slate-500"}`}
                    >
                      {hasMinLength ? (
                        <Check size={14} />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />
                      )}
                      <span>Minimal 8 karakter</span>
                    </span>
                    <span
                      className={`text-xs flex items-center space-x-1.5 ${hasUppercase ? "text-green-500" : "text-slate-500"}`}
                    >
                      {hasUppercase ? (
                        <Check size={14} />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />
                      )}
                      <span>Terdapat minimal 1 huruf kapital</span>
                    </span>
                    <span
                      className={`text-xs flex items-center space-x-1.5 ${hasNumber ? "text-green-500" : "text-slate-500"}`}
                    >
                      {hasNumber ? (
                        <Check size={14} />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />
                      )}
                      <span>Terdapat minimal 1 angka</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-slate-300">
                    Konfirmasi Kata Sandi
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      placeholder="Ulangi kata sandi Anda"
                      className={`bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500 h-11 pr-10 ${isMismatch ? "border-red-500 focus-visible:ring-red-500" : ""} ${isMatch ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <div className="pt-1">
                      {isMatch ? (
                        <span className="text-xs text-green-500 flex items-center space-x-1">
                          <Check size={14} />
                          <span>Kata sandi sesuai</span>
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 flex items-center space-x-1">
                          <X size={14} />
                          <span>Kata sandi tidak sesuai</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-2 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
              >
                {isLoading ? "Memproses..." : "Daftar Akun"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-500 hover:text-blue-400 hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
