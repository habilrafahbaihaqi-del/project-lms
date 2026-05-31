import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Panggil satpam Supabase kita di sini
  return await updateSession(request);
}

// Konfigurasi ini memberi tahu Next.js rute mana saja yang harus dijaga
export const config = {
  matcher: [
    /*
     * Jaga semua rute, KECUALI:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico (ikon web)
     * - gambar dan file media lainnya
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
