"use client";

import {
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  Clock,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";

// Data Mockup untuk Grafik Penjualan
const salesData = [
  { name: "1 Mei", total: 20 },
  { name: "5 Mei", total: 110 },
  { name: "10 Mei", total: 155 },
  { name: "15 Mei", total: 105 },
  { name: "20 Mei", total: 180 },
  { name: "25 Mei", total: 250 },
  { name: "31 Mei", total: 140 },
];

// Data Mockup untuk Progress User (Donut Chart)
const progressData = [
  { name: "Belum Mulai", value: 3124, color: "#3b82f6" }, // Biru
  { name: "Sedang Belajar", value: 6078, color: "#8b5cf6" }, // Ungu
  { name: "Selesai", value: 3256, color: "#10b981" }, // Hijau
];

export default function SuperAdminDashboard() {
  /* * LOGIKA PENGAMBILAN DATA REAL-TIME (TBD saat tabel transaksi siap)
   * * const supabase = createClient();
   * * // 1. Total User
   * const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
   * * // 2. Total Course
   * const { count: totalCourses } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published');
   * * // 3. Total Transaksi & Pendapatan
   * const { data: transactions } = await supabase.from('orders').select('final_price').eq('status', 'success');
   * const totalRevenue = transactions.reduce((acc, curr) => acc + curr.final_price, 0);
   * * // 4. Pembayaran Pending
   * const { count: pendingPayments } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
   */

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Judul & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-50 tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Pantau performa bisnis, course, user, dan transaksi dalam satu
            tempat.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="bg-[#0b1226] border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white h-10 px-4 rounded-xl"
          >
            <Calendar className="mr-2 h-4 w-4 text-slate-400" />
            Periode: 1 - 31 Mei 2026
          </Button>
          <Button
            variant="outline"
            className="bg-[#0b1226] border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white h-10 px-4 rounded-xl"
          >
            <Download className="mr-2 h-4 w-4 text-slate-400" />
            Export Laporan
          </Button>
        </div>
      </div>

      {/* Grid 5 Kartu Statistik dengan Efek Glow 3D */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Card 1: Total User */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1633] to-[#080d1e] border border-slate-700/50 p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">
                Total User
              </p>
              <h3 className="text-2xl font-bold text-slate-50">12.458</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="flex items-center text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded font-medium">
              <ArrowUpRight size={14} className="mr-0.5" /> 12.5%
            </span>
            <span className="text-slate-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        {/* Card 2: Total Course */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1633] to-[#080d1e] border border-slate-700/50 p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">
                Total Course
              </p>
              <h3 className="text-2xl font-bold text-slate-50">126</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="flex items-center text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded font-medium">
              <ArrowUpRight size={14} className="mr-0.5" /> 8.3%
            </span>
            <span className="text-slate-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        {/* Card 3: Total Transaksi */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1633] to-[#080d1e] border border-slate-700/50 p-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <ShoppingCart size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">
                Total Transaksi
              </p>
              <h3 className="text-2xl font-bold text-slate-50">3.842</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="flex items-center text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded font-medium">
              <ArrowUpRight size={14} className="mr-0.5" /> 15.7%
            </span>
            <span className="text-slate-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        {/* Card 4: Total Pendapatan */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1633] to-[#080d1e] border border-slate-700/50 p-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">
                Total Pendapatan
              </p>
              <h3 className="text-xl font-bold text-slate-50">
                Rp 1.245.780.000
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="flex items-center text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded font-medium">
              <ArrowUpRight size={14} className="mr-0.5" /> 18.6%
            </span>
            <span className="text-slate-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        {/* Card 5: Pembayaran Pending */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1325] to-[#080d1e] border border-slate-700/50 p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">
                Pembayaran Pending
              </p>
              <h3 className="text-2xl font-bold text-slate-50">216</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="flex items-center text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded font-medium">
              <ArrowDownRight size={14} className="mr-0.5" /> 5.2%
            </span>
            <span className="text-slate-500 ml-2">dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Grid Grafik & Top Course */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Penjualan (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center before:content-[''] before:block before:w-3 before:h-1 before:bg-blue-500 before:rounded-full before:mr-2">
              Grafik Penjualan
            </h3>
            <select className="bg-[#121b33] border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 outline-none">
              <option>Harian</option>
              <option>Mingguan</option>
              <option>Bulanan</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} jt`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#0f172a",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#3b82f6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Terlaris */}
        <div className="rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-100">
              Course Terlaris
            </h3>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-400">
              Lihat Semua
            </a>
          </div>
          <div className="space-y-6">
            {/* Item 1 */}
            <div className="flex items-center space-x-4">
              <div className="font-bold text-slate-500">1</div>
              <div className="h-10 w-16 bg-blue-900/40 rounded border border-blue-800/50 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  Belajar UI/UX Design
                </p>
                <p className="text-xs text-slate-400">1.245 Terjual</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-500">85%</p>
              </div>
            </div>
            {/* Item 2 */}
            <div className="flex items-center space-x-4">
              <div className="font-bold text-slate-500">2</div>
              <div className="h-10 w-16 bg-slate-800 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  Python untuk Pemula
                </p>
                <p className="text-xs text-slate-400">987 Terjual</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-500">67%</p>
              </div>
            </div>
            {/* Item 3 */}
            <div className="flex items-center space-x-4">
              <div className="font-bold text-slate-500">3</div>
              <div className="h-10 w-16 bg-slate-800 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  Digital Marketing Mastery
                </p>
                <p className="text-xs text-slate-400">765 Terjual</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-500">52%</p>
              </div>
            </div>
            {/* Item 4 */}
            <div className="flex items-center space-x-4">
              <div className="font-bold text-slate-500">4</div>
              <div className="h-10 w-16 bg-slate-800 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  Data Science Dasar
                </p>
                <p className="text-xs text-slate-400">543 Terjual</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-500">37%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Bawah: Donut Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        {/* Progress User */}
        <div className="rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            Progress User
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="h-[200px] w-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Angka di tengah Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-50">12.458</span>
                <span className="text-[10px] text-slate-400">Total User</span>
              </div>
            </div>

            {/* Legend Progress */}
            <div className="space-y-4 w-full sm:w-1/2 mt-4 sm:mt-0">
              {progressData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-300 text-xs">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-200 text-xs">
                    {Math.round((item.value / 12458) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaksi Terbaru (Table) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 shadow-lg overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-100">
              Transaksi Terbaru
            </h3>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-400">
              Lihat Semua
            </a>
          </div>
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-500 bg-slate-800/30 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium rounded-tl-lg">
                  ID Transaksi
                </th>
                <th className="px-4 py-3 font-medium">Nama User</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium rounded-tr-lg">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-3 text-slate-300">TRX-250531-001</td>
                <td className="px-4 py-3">Andi Pratama</td>
                <td className="px-4 py-3">Belajar UI/UX Design</td>
                <td className="px-4 py-3">
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs">
                    Success
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">Rp 450.000</td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-3 text-slate-300">TRX-250531-002</td>
                <td className="px-4 py-3">Siti Aisyah</td>
                <td className="px-4 py-3">Python untuk Pemula</td>
                <td className="px-4 py-3">
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded text-xs">
                    Pending
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">Rp 350.000</td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-3 text-slate-300">TRX-250531-003</td>
                <td className="px-4 py-3">Budi Santoso</td>
                <td className="px-4 py-3">Digital Marketing Mastery</td>
                <td className="px-4 py-3">
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs">
                    Success
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">Rp 550.000</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="px-4 py-3 text-slate-300">TRX-250531-004</td>
                <td className="px-4 py-3">Dewi Lestari</td>
                <td className="px-4 py-3">Data Science Dasar</td>
                <td className="px-4 py-3">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-xs">
                    Failed
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">Rp 300.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
