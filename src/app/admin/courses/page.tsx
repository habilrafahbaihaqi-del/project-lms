"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  MoreHorizontal,
  FileEdit,
  Trash2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCourses,
  getCategoriesForSelect,
  createCourseDraft,
} from "./actions";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State untuk form Buat Draf
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [coursesData, categoriesData] = await Promise.all([
          getCourses(),
          getCategoriesForSelect(),
        ]);
        setCourses(coursesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Gagal memuat data", error);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId) return alert("Judul dan Kategori wajib diisi!");

    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category_id", categoryId);

    const result = await createCourseDraft(formData);

    if (result.success && result.courseId) {
      // Langsung lemparkan Super Admin ke ruang kerja (workspace) course tersebut
      router.push(`/admin/courses/${result.courseId}`);
    } else {
      alert("Gagal membuat course: " + result.error);
      setIsSaving(false);
    }
  };

  // Helper untuk warna status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
            Published
          </span>
        );
      case "archived":
        return (
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
            Archived
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Aksi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-50 tracking-tight">
            Manajemen Course
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Kelola katalog course, buat draf baru, dan atur materi pembelajaran.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
            <Input
              placeholder="Cari course..."
              className="pl-9 bg-[#0b1226] border-slate-700/60 text-slate-200 focus-visible:ring-blue-500 h-10 rounded-xl"
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] h-10 rounded-xl px-4 shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Buat Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0b1226] border-slate-800 text-slate-200 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-heading">
                  Mulai Draf Course Baru
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDraft} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Judul Course</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isSaving}
                    className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-blue-500"
                    placeholder="Cth: Menguasai React.js dari Nol"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Kategori</Label>
                  <Select
                    onValueChange={setCategoryId}
                    required
                    disabled={isSaving || categories.length === 0}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200 focus:ring-blue-500">
                      <SelectValue
                        placeholder={
                          categories.length === 0
                            ? "Belum ada kategori..."
                            : "Pilih Kategori"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={4}
                      className="bg-slate-900 border-slate-800 text-slate-200 z-[100] w-[var(--radix-select-trigger-width)]"
                    >
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="focus:bg-slate-800 focus:text-slate-100"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving || !title || !categoryId}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-4 w-4" /> Lanjut ke
                        Workspace
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabel Daftar Course */}
      <div className="rounded-2xl bg-[#0b1226] border border-slate-800/80 overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-medium w-[40%]">
                Informasi Course
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Kategori
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Harga
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Status
              </TableHead>
              <TableHead className="text-slate-400 font-medium text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-slate-800">
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-slate-500"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow className="border-slate-800">
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-slate-500"
                >
                  Belum ada course yang dibuat. Mulai dengan membuat draf
                  pertama Anda.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow
                  key={course.id}
                  className="border-slate-800/50 hover:bg-slate-800/30"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-12 rounded bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt=""
                            className="h-full w-full object-cover rounded"
                          />
                        ) : (
                          <BookOpen size={16} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200 line-clamp-1">
                          {course.title}
                        </p>
                        <p className="text-xs text-slate-500">/{course.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {course.category?.name || (
                      <span className="text-slate-600 italic">
                        Tanpa Kategori
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300 font-medium">
                    {course.price === 0
                      ? "Gratis"
                      : `Rp ${course.price.toLocaleString("id-ID")}`}
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => router.push(`/admin/courses/${course.id}`)}
                      size="sm"
                      variant="outline"
                      className="bg-[#121b33] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <FileEdit size={14} className="mr-2" /> Kelola
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
