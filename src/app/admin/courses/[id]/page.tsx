"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  ArrowLeft,
  Save,
  LayoutTemplate,
  BookOpen,
  Settings,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getCourseById,
  getCategoriesForSelect,
  updateCourseBasicInfo,
  updateCourseSettings,
} from "../actions";
import CurriculumBuilder from "./curriculum-builder";

export default function CourseWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // State Form Informasi Dasar
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    price: 0,
    level: "beginner",
  });

  // State Form Pengaturan Lanjutan (Status & Thumbnail)
  const [courseStatus, setCourseStatus] = useState<
    "draft" | "published" | "archived"
  >("draft");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [courseData, categoriesData] = await Promise.all([
          getCourseById(courseId),
          getCategoriesForSelect(),
        ]);

        setCategories(categoriesData);
        setFormData({
          title: courseData.title || "",
          category_id: courseData.category_id || "",
          description: courseData.description || "",
          price: courseData.price || 0,
          level: courseData.level || "beginner",
        });

        // Load data status dan thumbnail awal
        setCourseStatus(courseData.status || "draft");
        setThumbnailUrl(courseData.thumbnail_url || "");
      } catch (error) {
        console.error("Gagal memuat data", error);
        toast.error("Course tidak ditemukan.");
        router.push("/admin/courses");
      }
      setIsLoading(false);
    }
    loadData();
  }, [courseId, router]);

  // Handler Simpan Informasi Dasar
  const handleSaveBasicInfo = async () => {
    setIsSaving(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category_id", formData.category_id);
    data.append("description", formData.description);
    data.append("price", formData.price.toString());
    data.append("level", formData.level);

    const result = await updateCourseBasicInfo(courseId, data);
    if (result.success) {
      toast.success("Tersimpan!", {
        description: "Informasi dasar course berhasil diperbarui.",
      });
    } else {
      toast.error("Gagal menyimpan", { description: result.error });
    }
    setIsSaving(false);
  };

  // Handler Simpan Pengaturan Lanjutan (Status & Thumbnail)
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    const result = await updateCourseSettings(
      courseId,
      courseStatus,
      thumbnailUrl,
    );
    if (result.success) {
      toast.success("Pengaturan Diperbarui!", {
        description: "Status rilis dan thumbnail berhasil disimpan.",
      });
    } else {
      toast.error("Gagal memperbarui pengaturan", {
        description: result.error,
      });
    }
    setIsSavingSettings(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // Helper untuk badge status di top bar
  const getStatusLabel = (status: string) => {
    if (status === "published")
      return <span className="text-emerald-400 font-medium">Published</span>;
    if (status === "archived")
      return <span className="text-red-400 font-medium">Archived</span>;
    return <span className="text-slate-300 font-medium">Draft</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0b1226] p-4 rounded-2xl border border-slate-800/80 shadow-lg sticky top-28 z-30">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/courses")}
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full h-10 w-10"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold font-heading text-slate-50 line-clamp-1">
              {formData.title}
            </h1>
            <p className="text-slate-400 text-xs">
              ID: {courseId.substring(0, 8)}... • Status:{" "}
              {getStatusLabel(courseStatus)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button
            onClick={handleSaveBasicInfo}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shadow-[0_0_15px_rgba(37,99,235,0.3)] rounded-xl"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {/* Workspace Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-[#0b1226] border border-slate-800/80 p-1 rounded-xl w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger
            value="basic"
            className="text-slate-400 data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-500 rounded-lg px-6 py-2.5"
          >
            <LayoutTemplate size={16} className="mr-2" /> Informasi Dasar
          </TabsTrigger>
          <TabsTrigger
            value="curriculum"
            className="text-slate-400 data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-500 rounded-lg px-6 py-2.5"
          >
            <BookOpen size={16} className="mr-2" /> Kurikulum & Materi
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-slate-400 data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-500 rounded-lg px-6 py-2.5"
          >
            <Settings size={16} className="mr-2" /> Pengaturan Course
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INFORMASI DASAR */}
        <TabsContent value="basic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 sm:p-8 shadow-lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Judul Course</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus-visible:ring-blue-500 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Deskripsi Lengkap</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus-visible:ring-blue-500 min-h-[200px]"
                    placeholder="Jelaskan apa yang akan dipelajari siswa di course ini..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 shadow-lg space-y-5">
                <h3 className="font-semibold text-slate-100 border-b border-slate-800 pb-3">
                  Atribut Course
                </h3>
                <div className="space-y-2">
                  <Label className="text-slate-300">Kategori</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(val) =>
                      setFormData({ ...formData, category_id: val })
                    }
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Pilih Kategori" />
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
                          className="focus:bg-slate-800"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Level Kesulitan</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(val) =>
                      setFormData({ ...formData, level: val })
                    }
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={4}
                      className="bg-slate-900 border-slate-800 text-slate-200 z-[100] w-[var(--radix-select-trigger-width)]"
                    >
                      <SelectItem value="beginner">
                        Pemula (Beginner)
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Menengah (Intermediate)
                      </SelectItem>
                      <SelectItem value="advanced">Mahir (Advanced)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Harga (Rp)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus-visible:ring-blue-500 h-11"
                  />
                  <p className="text-xs text-slate-500">
                    Biarkan 0 jika course ini gratis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: KURIKULUM & MATERI */}
        <TabsContent value="curriculum" className="mt-6">
          <CurriculumBuilder courseId={courseId} />
        </TabsContent>

        {/* TAB 3: PENGATURAN COURSE (SELESAI 100%) */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 sm:p-8 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-100">
                Media & Sampul Gambar
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">URL Gambar Thumbnail</Label>
                  <Input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Masukkan link gambar sampul (cth: https://images.unsplash.com/...)"
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus-visible:ring-blue-500 h-11"
                  />
                </div>
                {/* Preview Thumbnail secara Real-time */}
                <div className="h-52 w-full max-w-md rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                      }}
                    />
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 text-slate-700 mb-2" />
                      <span className="text-xs text-slate-500">
                        Pratinjau gambar akan muncul di sini
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-[#0b1226] border border-slate-800/80 p-6 shadow-lg space-y-5">
                <h3 className="font-semibold text-slate-100 border-b border-slate-800 pb-3">
                  Visibilitas & Publikasi
                </h3>
                <div className="space-y-2">
                  <Label className="text-slate-300">Status Rilis</Label>
                  <Select
                    value={courseStatus}
                    onValueChange={(val: "draft" | "published" | "archived") =>
                      setCourseStatus(val)
                    }
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={4}
                      className="bg-slate-900 border-slate-800 text-slate-200 z-[100] w-[var(--radix-select-trigger-width)]"
                    >
                      <SelectItem value="draft">
                        ⚙️ Simpan Sebagai Draf
                      </SelectItem>
                      <SelectItem value="published">
                        🚀 Terbitkan (Published)
                      </SelectItem>
                      <SelectItem value="archived">
                        📦 Arsipkan (Archived)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                    * Status "Published" membuat kelas ini muncul di katalog
                    siswa. Status "Archived" menyembunyikan kelas tanpa
                    menghapus data materi.
                  </p>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="bg-blue-600 hover:bg-blue-700 w-full shadow-[0_0_15px_rgba(37,99,235,0.3)] rounded-xl mt-2"
                >
                  {isSavingSettings ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Terapkan Pengaturan"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
