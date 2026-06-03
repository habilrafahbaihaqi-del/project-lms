"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen, BarChart, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPublishedCourses, getPublicCategories } from "./actions";

export default function CatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          getPublishedCourses(),
          getPublicCategories(),
        ]);
        setCourses(coursesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Gagal memuat katalog", error);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Logika Filter Dinamis
  const filteredCourses = courses.filter((course) => {
    const matchSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory
      ? course.category?.name === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex-1 bg-[#060b19] pb-24">
      {/* Header Katalog */}
      <div className="bg-[#080d1e] border-b border-slate-800/60 pt-16 pb-12 px-6">
        <div className="container mx-auto max-w-6xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-50 tracking-tight">
            Eksplorasi <span className="text-blue-500">Katalog Kelas</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Temukan materi yang relevan dengan tujuan kariermu. Pilih kelas,
            pelajari materinya, dan jadilah ahli di bidangmu.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 mt-10 space-y-10">
        {/* Area Filter & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0b1226] p-4 rounded-2xl border border-slate-800/80 shadow-lg">
          {/* Pil Filter Kategori */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              Semua Kelas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.name
                    ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                    : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kelas..."
              className="pl-9 bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-blue-500 rounded-xl h-11"
            />
          </div>
        </div>

        {/* Area Grid Course */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-400">Memuat katalog kelas...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-[#0b1226] border border-slate-800/80 rounded-3xl border-dashed">
            <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200">
              Kelas Tidak Ditemukan
            </h3>
            <p className="text-slate-400 mt-2">
              Coba gunakan kata kunci pencarian atau kategori lain.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              variant="outline"
              className="mt-6 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <div className="group bg-[#0b1226] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full cursor-pointer">
                  {/* Thumbnail Image */}
                  <div className="h-48 w-full bg-slate-900 relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-700">
                        <BookOpen size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/80 backdrop-blur text-blue-400 border border-blue-500/20 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {course.category?.name || "Uncategorized"}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-400 mb-4">
                      <BarChart size={14} />
                      <span className="capitalize">{course.level} Level</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-50">
                        {course.price === 0
                          ? "Gratis"
                          : `Rp ${course.price.toLocaleString("id-ID")}`}
                      </span>
                      <Button
                        size="sm"
                        className="bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg"
                      >
                        Detail <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
