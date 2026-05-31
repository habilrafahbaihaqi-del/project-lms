import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fungsi Server Action untuk Logout
  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#050914] text-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-heading">
              Dashboard Pembelajar
            </h1>
            <p className="text-slate-400 mt-1">
              Selamat datang kembali, {user?.email}!
            </p>
          </div>

          <form action={signOut}>
            <Button
              type="submit"
              variant="destructive"
              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </form>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
          <p>Fitur daftar course akan segera hadir di Phase berikutnya.</p>
        </div>
      </div>
    </div>
  );
}
