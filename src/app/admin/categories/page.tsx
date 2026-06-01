"use client";

import { useState, useEffect } from "react";
import { Layers, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { getCategories, saveCategory, deleteCategory } from "./actions";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State untuk Dialog (Modal)
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Load data awal
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Buka modal untuk Create
  const handleCreateNew = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setIsOpen(true);
  };

  // Buka modal untuk Edit
  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
    setIsOpen(true);
  };

  // Proses Simpan (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    const result = await saveCategory(formData, editingId || undefined);

    if (result.success) {
      setIsOpen(false);
      fetchData(); // Refresh tabel
    } else {
      alert("Gagal menyimpan: " + result.error);
    }
    setIsSaving(false);
  };

  // Proses Hapus
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      const result = await deleteCategory(id);
      if (result.success) {
        fetchData(); // Refresh tabel
      } else {
        alert("Gagal menghapus: " + result.error);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-50 tracking-tight">
            Manajemen Kategori
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Kelola kategori untuk mengelompokkan course Anda.
          </p>
        </div>

        {/* Tombol & Dialog Tambah */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0b1226] border-slate-800 text-slate-200 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading">
                {editingId ? "Edit Kategori" : "Kategori Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Nama Kategori
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSaving}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-blue-500"
                  placeholder="Cth: Digital Marketing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-slate-300">
                  Deskripsi Singkat
                </Label>
                <Input
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSaving}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-blue-500"
                  placeholder="Cth: Kumpulan materi pemasaran..."
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Simpan Kategori"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Area Tabel */}
      <div className="rounded-2xl bg-[#0b1226] border border-slate-800/80 p-1 overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-medium">
                Nama Kategori
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Slug URL
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Deskripsi
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
                  colSpan={4}
                  className="text-center py-8 text-slate-500"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow className="border-slate-800">
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-slate-500"
                >
                  Belum ada kategori yang dibuat.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="border-slate-800/50 hover:bg-slate-800/30"
                >
                  <TableCell className="font-medium text-slate-200">
                    <div className="flex items-center space-x-2">
                      <Layers size={16} className="text-blue-500" />
                      <span>{cat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    /{cat.slug}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm truncate max-w-[200px]">
                    {cat.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        onClick={() => handleEdit(cat)}
                        size="icon"
                        variant="ghost"
                        className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(cat.id)}
                        size="icon"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
