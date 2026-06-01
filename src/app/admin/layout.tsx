"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  Receipt,
  Ticket,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminLogout } from "./actions";
import { Toaster } from "sonner"; // <-- Import Sonner ditambahkan di sini

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Daftar menu untuk mempermudah render dan pengecekan active state
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Kelola User", path: "/admin/users", icon: Users },
    { name: "Manajemen Kategori", path: "/admin/categories", icon: Layers },
    { name: "Manajemen Course", path: "/admin/courses", icon: BookOpen },
    { name: "Manajemen Sertifikat", path: "/admin/certificates", icon: Award },
    { name: "Transaksi", path: "/admin/transactions", icon: Receipt },
    { name: "Manajemen Voucher", path: "/admin/vouchers", icon: Ticket },
    { name: "Pengaturan", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#060b19] text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Sidebar Kiri */}
      <aside className="w-72 border-r border-slate-800/60 bg-[#080d1e]/80 backdrop-blur-xl flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="h-24 flex items-center px-8 border-b border-slate-800/60">
          <Link href="/admin" className="flex items-center space-x-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-extrabold text-white font-heading shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              K
            </span>
            <div className="leading-tight">
              <span className="text-xl font-bold font-heading block">
                Klassa
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Site Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Navigasi Sidebar Dinamis */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Logika pengecekan URL aktif (Exact match untuk /admin, startsWith untuk yang lain)
            const isActive =
              item.path === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.path);

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                }`}
              >
                <Icon size={20} />
                <span
                  className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout di Bawah Sidebar */}
        <div className="p-4 border-t border-slate-800/60">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex w-full items-center space-x-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="ml-72 flex-1 flex flex-col min-h-screen">
        {/* Header Kanan Atas */}
        <header className="h-24 flex items-center justify-end px-10 border-b border-slate-800/60 bg-[#060b19]/90 backdrop-blur-md sticky top-0 z-40 space-x-6">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#060b19]"></span>
          </button>

          {/* Dropdown Profil dengan Logout */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center space-x-3 cursor-pointer pl-4 border-l border-slate-800">
                <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                    alt="Admin Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-200 leading-tight">
                    Admin Klassa
                  </p>
                  <p className="text-xs text-slate-400">Super Admin</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#0b1226] border-slate-800 text-slate-300"
            >
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="focus:bg-slate-800 focus:text-slate-100 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />

              {/* Form Logout yang dibungkus dengan benar */}
              <form action={adminLogout}>
                <DropdownMenuItem asChild>
                  <button
                    type="submit"
                    className="flex w-full items-center text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Area Render Halaman */}
        <div className="flex-1 p-10">{children}</div>
      </main>

      {/* Komponen Toaster dari Sonner diletakkan di sini */}
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  );
}
