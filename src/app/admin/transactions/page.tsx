"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getTransactions, manualApproveOrder } from "./actions";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    setIsLoading(true);
    const data = await getTransactions();
    setTransactions(data);
    setIsLoading(false);
  }

  const handleManualApprove = async (orderId: string) => {
    if (
      !confirm(
        "Setujui pesanan ini secara manual dan berikan akses kelas kepada siswa?",
      )
    )
      return;

    setProcessingId(orderId);
    const res = await manualApproveOrder(orderId);

    if (res.success) {
      toast.success("Pesanan disetujui!", {
        description: "Siswa kini memiliki akses ke materi kelas.",
      });
      loadTransactions(); // Refresh data tabel
    } else {
      toast.error("Gagal memproses", { description: res.error });
    }
    setProcessingId(null);
  };

  // Filter pencarian berdasarkan nama, email, atau nomor order
  const filteredTransactions = transactions.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.order_number?.toLowerCase().includes(query) ||
      t.user?.name?.toLowerCase().includes(query) ||
      t.user?.email?.toLowerCase().includes(query) ||
      t.course?.title?.toLowerCase().includes(query)
    );
  });

  // Helper untuk warna badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
      case "manual_approved":
        return (
          <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle size={12} className="mr-1.5" /> Berhasil
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Clock size={12} className="mr-1.5" /> Menunggu
          </span>
        );
      case "failed":
      case "expired":
      case "cancelled":
        return (
          <span className="flex items-center text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            <XCircle size={12} className="mr-1.5" /> Gagal/Batal
          </span>
        );
      default:
        return (
          <span className="text-xs text-slate-500 uppercase">{status}</span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-50">
            Riwayat Transaksi
          </h1>
          <p className="text-slate-400 mt-1">
            Pantau pembayaran dan berikan persetujuan manual jika diperlukan.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
          <Input
            placeholder="Cari order, nama, atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#0b1226] border-slate-700/80 text-slate-200 focus-visible:ring-blue-500 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="bg-[#0b1226] border border-slate-800/80 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800/80">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID & Tanggal</th>
                <th className="px-6 py-4 font-medium">Informasi Siswa</th>
                <th className="px-6 py-4 font-medium">Kelas & Nominal</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                    <p className="text-slate-400 mt-2">
                      Memuat riwayat transaksi...
                    </p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Belum ada data transaksi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200 mb-1">
                        {t.order_number}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(t.created_at), "dd MMM yyyy • HH:mm", {
                          locale: id,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-200 font-medium">
                        {t.user?.name || "Anonim"}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {t.user?.email || "Tidak ada email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-slate-300 line-clamp-1 mb-1 max-w-[200px]"
                        title={t.course?.title}
                      >
                        {t.course?.title || "Kelas Dihapus"}
                      </div>
                      <div className="font-bold text-slate-100">
                        Rp {t.final_price?.toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {t.status === "pending" ? (
                        <Button
                          onClick={() => handleManualApprove(t.id)}
                          disabled={processingId === t.id}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] h-8"
                        >
                          {processingId === t.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 mr-1.5" />
                          )}
                          Terima Pembayaran
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          Selesai diproses
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
