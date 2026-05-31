"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, X, KeyRound } from "lucide-react";
import { updatePassword } from "./actions";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatch = password !== "" && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isFormValid = hasMinLength && hasUppercase && hasNumber && isMatch;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setServerError(null);
    const result = await updatePassword(formData);
    if (result?.error) setServerError(result.error);
    setIsLoading(false);
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050914] p-4 text-slate-50 overflow-hidden font-sans">
      <div className="z-10 w-full max-w-md rounded-[2rem] border border-slate-700/50 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-50 font-heading">
            Buat Kata Sandi Baru
          </h2>
          <p className="text-sm text-slate-400">
            Silakan masukkan kata sandi baru yang kuat untuk akun Anda.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          {serverError && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Kata Sandi Baru</Label>
              <div className="relative">
                <Input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  className="bg-slate-950/50 border-slate-700 text-slate-200 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
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
              <Label className="text-slate-300">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  className={`bg-slate-950/50 border-slate-700 text-slate-200 h-11 pr-10 ${isMismatch ? "border-red-500" : ""} ${isMatch ? "border-green-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
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
            className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold disabled:bg-slate-800 disabled:text-slate-500"
          >
            {isLoading ? "Memproses..." : "Simpan Kata Sandi"}
          </Button>
        </form>
      </div>
    </div>
  );
}
