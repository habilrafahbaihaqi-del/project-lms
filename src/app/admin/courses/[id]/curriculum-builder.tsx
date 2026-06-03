"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  FileVideo,
  FileText,
  FolderPlus,
  Loader2,
  Trash2,
  Link2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getCourseCurriculum,
  createModule,
  createLesson,
  updateModulesOrder,
  updateLessonsOrder,
  deleteModule,
  deleteLesson,
  uploadMaterialFile,
  updateLessonContentUrl,
} from "../actions";

export default function CurriculumBuilder({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // State Form Modul
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [isCreatingModule, setIsCreatingModule] = useState(false);

  // State Form Materi (Lesson)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<"video" | "pdf">("video");
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);

  // State untuk Modal Isi Materi (Upload PDF / Input URL Video)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [contentUrlInput, setContentUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadCurriculum();
  }, []);

  async function loadCurriculum() {
    try {
      const data = await getCourseCurriculum(courseId);
      setModules(data);
    } catch (err) {
      toast.error("Gagal memuat kurikulum");
    }
    setIsLoading(false);
  }

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    setIsCreatingModule(true);
    const nextOrder = modules.length + 1;
    const res = await createModule(courseId, newModuleTitle, nextOrder);
    if (res.success) {
      toast.success("Modul berhasil ditambahkan");
      setNewModuleTitle("");
      loadCurriculum();
    } else {
      toast.error("Gagal membuat modul");
    }
    setIsCreatingModule(false);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !activeModuleId) return;
    setIsCreatingLesson(true);
    const targetModule = modules.find((m) => m.id === activeModuleId);
    const nextOrder = (targetModule?.lessons?.length || 0) + 1;
    const res = await createLesson(
      activeModuleId,
      newLessonTitle,
      lessonType,
      nextOrder,
    );
    if (res.success) {
      toast.success("Materi berhasil ditambahkan");
      setNewLessonTitle("");
      setIsLessonDialogOpen(false);
      loadCurriculum();
    } else {
      toast.error("Gagal menambahkan materi");
    }
    setIsCreatingLesson(false);
  };

  const handleDeleteMod = async (id: string) => {
    if (
      confirm(
        "Hapus bab ini beserta seluruh materi di dalamnya secara permanen?",
      )
    ) {
      const res = await deleteModule(id);
      if (res.success) {
        toast.success("Bab berhasil dihapus");
        loadCurriculum();
      } else {
        toast.error("Gagal menghapus bab");
      }
    }
  };

  const handleDeleteLes = async (id: string) => {
    if (confirm("Hapus materi ini dari kurikulum?")) {
      const res = await deleteLesson(id);
      if (res.success) {
        toast.success("Materi berhasil dihapus");
        loadCurriculum();
      } else {
        toast.error("Gagal menghapus materi");
      }
    }
  };

  // Membuka Modal Isi Materi
  const openContentDialog = (lesson: any) => {
    setActiveLesson(lesson);
    setContentUrlInput(lesson.content_url || "");
    setIsContentDialogOpen(true);
  };

  // Menyimpan URL Video secara manual
  const handleSaveVideoUrl = async () => {
    setIsUploading(true);
    const res = await updateLessonContentUrl(activeLesson.id, contentUrlInput);
    if (res.success) {
      toast.success("Tautan video berhasil disimpan");
      setIsContentDialogOpen(false);
      loadCurriculum();
    } else {
      toast.error("Gagal menyimpan tautan");
    }
    setIsUploading(false);
  };

  // Mengunggah File PDF
  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Format file harus PDF");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await uploadMaterialFile(formData);
    if (uploadRes.success && uploadRes.url) {
      // Simpan URL ke database
      const saveRes = await updateLessonContentUrl(
        activeLesson.id,
        uploadRes.url,
      );
      if (saveRes.success) {
        toast.success("File PDF berhasil diunggah & disimpan");
        setContentUrlInput(uploadRes.url);
        loadCurriculum();
      }
    } else {
      toast.error("Gagal mengunggah file", { description: uploadRes.error });
    }
    setIsUploading(false);
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "MODULE") {
      const reorderedModules = Array.from(modules);
      const [removed] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, removed);
      const updatedModules = reorderedModules.map((mod, idx) => ({
        ...mod,
        sort_order: idx + 1,
      }));
      setModules(updatedModules);
      const dbPayload = updatedModules.map((m) => ({
        id: m.id,
        sort_order: m.sort_order,
      }));
      await updateModulesOrder(dbPayload);
      toast.success("Urutan bab disimpan");
      return;
    }

    if (type === "LESSON") {
      const sourceModuleIdx = modules.findIndex(
        (m) => m.id === source.droppableId,
      );
      const destModuleIdx = modules.findIndex(
        (m) => m.id === destination.droppableId,
      );
      if (sourceModuleIdx !== destModuleIdx) {
        toast.error("Materi hanya bisa diurutkan di dalam bab yang sama.");
        return;
      }
      const targetModule = modules[sourceModuleIdx];
      const reorderedLessons = [...targetModule.lessons];
      const [removed] = reorderedLessons.splice(source.index, 1);
      reorderedLessons.splice(destination.index, 0, removed);
      const updatedLessons = reorderedLessons.map((les: any, idx) => ({
        ...les,
        sort_order: idx + 1,
      }));
      const newModulesState = [...modules];
      newModulesState[sourceModuleIdx].lessons = updatedLessons;
      setModules(newModulesState);
      const dbPayload = updatedLessons.map((l) => ({
        id: l.id,
        sort_order: l.sort_order,
      }));
      await updateLessonsOrder(dbPayload);
      toast.success("Urutan materi diperbarui");
    }
  };

  if (!isMounted) return null;
  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Form Tambah Modul */}
      <form
        onSubmit={handleAddModule}
        className="flex gap-3 bg-[#111933] p-4 rounded-xl border border-slate-800"
      >
        <Input
          placeholder="Tulis Judul Bab Utama Baru... (Contoh: Pengenalan HTML Dasar)"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          disabled={isCreatingModule}
          className="bg-slate-900/60 border-slate-700 text-slate-100 focus-visible:ring-blue-500"
        />
        <Button
          type="submit"
          disabled={isCreatingModule || !newModuleTitle.trim()}
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
        >
          {isCreatingModule ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <FolderPlus className="mr-2 h-4 w-4" /> Tambah Bab
            </>
          )}
        </Button>
      </form>

      {/* Drag & Drop Area */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-modules" type="MODULE">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-5"
            >
              {modules.length === 0 ? (
                <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  Belum ada kurikulum. Buat Bab pertama Anda di atas.
                </div>
              ) : (
                modules.map((module, index) => (
                  <Draggable
                    key={module.id}
                    draggableId={module.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-[#0b1226] border border-slate-800 rounded-2xl shadow-md overflow-hidden"
                      >
                        <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div
                              {...provided.dragHandleProps}
                              className="text-slate-500 hover:text-slate-300 cursor-grab p-1"
                            >
                              <GripVertical size={18} />
                            </div>
                            <h3 className="font-semibold text-slate-200">
                              <span className="text-blue-500 mr-1.5">
                                Bab {index + 1}:
                              </span>{" "}
                              {module.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveModuleId(module.id);
                                setIsLessonDialogOpen(true);
                              }}
                              className="bg-[#121b33] border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                              <Plus size={14} className="mr-1.5" /> Tambah
                              Materi
                            </Button>
                            {/* Tombol Hapus Bab */}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteMod(module.id)}
                              className="text-slate-500 hover:text-red-400 h-8 w-8 rounded-lg hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>

                        <Droppable droppableId={module.id} type="LESSON">
                          {(innerProvided) => (
                            <div
                              ref={innerProvided.innerRef}
                              {...innerProvided.droppableProps}
                              className="p-3 bg-slate-950/20 min-h-[10px] space-y-2"
                            >
                              {module.lessons?.length === 0 ? (
                                <p className="text-xs text-slate-600 italic px-4 py-2">
                                  Belum ada materi di bab ini.
                                </p>
                              ) : (
                                module.lessons?.map(
                                  (lesson: any, lIdx: number) => (
                                    <Draggable
                                      key={lesson.id}
                                      draggableId={lesson.id}
                                      index={lIdx}
                                    >
                                      {(innerDraggableProvided) => (
                                        <div
                                          ref={innerDraggableProvided.innerRef}
                                          {...innerDraggableProvided.draggableProps}
                                          className="flex items-center justify-between p-3 bg-[#111933]/50 border border-slate-800/60 rounded-xl hover:border-slate-700/80 transition-colors"
                                        >
                                          <div className="flex items-center space-x-3 flex-1">
                                            <div
                                              {...innerDraggableProvided.dragHandleProps}
                                              className="text-slate-600 hover:text-slate-400 cursor-grab p-1"
                                            >
                                              <GripVertical size={14} />
                                            </div>
                                            <div className="text-slate-400 shrink-0">
                                              {lesson.content_type ===
                                              "video" ? (
                                                <FileVideo
                                                  size={16}
                                                  className="text-indigo-400"
                                                />
                                              ) : (
                                                <FileText
                                                  size={16}
                                                  className="text-emerald-400"
                                                />
                                              )}
                                            </div>
                                            <div className="flex flex-col">
                                              <p className="text-sm text-slate-300 font-medium">
                                                {lesson.title}
                                              </p>
                                              {/* Indikator Status Konten */}
                                              {lesson.content_url ? (
                                                <span className="text-[10px] text-emerald-500 font-medium flex items-center mt-0.5">
                                                  Berisi Konten ✓
                                                </span>
                                              ) : (
                                                <span className="text-[10px] text-amber-500 font-medium flex items-center mt-0.5">
                                                  Konten Kosong ⚠️
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center space-x-2">
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 mr-2">
                                              {lesson.content_type}
                                            </span>

                                            {/* TOMBOL ISI MATERI */}
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() =>
                                                openContentDialog(lesson)
                                              }
                                              className={`h-7 px-2 text-xs border-slate-700 ${lesson.content_url ? "text-blue-400 hover:text-blue-300 bg-blue-900/20" : "text-slate-400 hover:text-white bg-slate-800"}`}
                                            >
                                              <Link2
                                                size={12}
                                                className="mr-1.5"
                                              />{" "}
                                              {lesson.content_url
                                                ? "Edit"
                                                : "Isi"}
                                            </Button>

                                            {/* Tombol Hapus Materi */}
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              onClick={() =>
                                                handleDeleteLes(lesson.id)
                                              }
                                              className="text-slate-600 hover:text-red-400 h-7 w-7 rounded-md hover:bg-red-500/10"
                                            >
                                              <Trash2 size={14} />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ),
                                )
                              )}
                              {innerProvided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modal Tambah Materi (Judul & Tipe) */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="bg-[#0b1226] border-slate-800 text-slate-200 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading">
              Tambah Materi Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLesson} className="space-y-4 mt-3">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">
                Judul Materi
              </label>
              <Input
                placeholder="Cth: Menginstal Node.js dan VS Code"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                required
                disabled={isCreatingLesson}
                className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">
                Tipe Konten
              </label>
              <Select
                value={lessonType}
                onValueChange={(val: "video" | "pdf") => setLessonType(val)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-slate-900 border-slate-800 text-slate-200"
                >
                  <SelectItem value="video">🎥 Video Pembelajaran</SelectItem>
                  <SelectItem value="pdf">📄 Modul Ringkasan PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isCreatingLesson || !newLessonTitle.trim()}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                {isCreatingLesson ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Masukkan ke Kurikulum"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL BARU: ISI KONTEN (URL VIDEO / UPLOAD PDF) */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="bg-[#0b1226] border-slate-800 text-slate-200 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading flex items-center">
              {activeLesson?.content_type === "video" ? (
                <FileVideo className="mr-2 text-indigo-400" size={20} />
              ) : (
                <FileText className="mr-2 text-emerald-400" size={20} />
              )}
              Isi Materi: {activeLesson?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {activeLesson?.content_type === "video" ? (
              <div className="space-y-3">
                <label className="text-sm text-slate-300 font-medium">
                  Tautan Video (YouTube/Vimeo/Drive)
                </label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={contentUrlInput}
                  onChange={(e) => setContentUrlInput(e.target.value)}
                  disabled={isUploading}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-blue-500"
                />
                <Button
                  onClick={handleSaveVideoUrl}
                  disabled={isUploading || !contentUrlInput.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Simpan Tautan Video"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-sm text-slate-300 font-medium">
                  Unggah Berkas PDF
                </label>

                {contentUrlInput && (
                  <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                    <span className="truncate pr-4">
                      File sudah terunggah: {contentUrlInput.substring(0, 40)}
                      ...
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-800/80 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                      ) : (
                        <UploadCloud className="w-10 h-10 text-slate-500 mb-3" />
                      )}
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold text-blue-400">
                          Klik untuk unggah
                        </span>{" "}
                        file PDF
                      </p>
                      <p className="text-xs text-slate-500">
                        Maks. ukuran disarankan 10MB
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleUploadPdf}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
