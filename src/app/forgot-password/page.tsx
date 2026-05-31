"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);
    const result = await requestPasswordReset(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({
        type: "success",
        text: "Tautan reset kata sandi telah dikirim ke email Anda. Silakan cek kotak masuk atau folder spam.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050914] p-4 text-slate-50 overflow-hidden font-sans">
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-md rounded-[2rem] border border-slate-700/50 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-50 font-heading">
            Lupa Kata Sandi?
          </h2>
          <p className="text-sm text-slate-400">
            Masukkan email yang terdaftar, kami akan mengirimkan tautan untuk
            mengatur ulang kata sandi Anda.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          {message && (
            <div
              className={`rounded-lg p-3 text-sm text-center border ${message.type === "error" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}`}
            >
              {message.text}
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
              className="bg-slate-950/50 border-slate-700 text-slate-200 focus-visible:ring-blue-500 h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold"
          >
            {isLoading ? "Mengirim..." : "Kirim Tautan Reset"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Ingin kembali?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-500 hover:text-blue-400 hover:underline"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
