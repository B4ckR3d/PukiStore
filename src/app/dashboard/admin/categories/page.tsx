"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tags, Plus, Pencil, Trash2, GripVertical } from "lucide-react";

const mockCategories = [
  { id: "1", name: "Voucher & Kode", slug: "voucher-kode", icon: "🎟️", productsCount: 45, isActive: true },
  { id: "2", name: "Top Up Game", slug: "topup-game", icon: "🎮", productsCount: 78, isActive: true },
  { id: "3", name: "eSIM Data", slug: "esim-data", icon: "🌐", productsCount: 23, isActive: true },
  { id: "4", name: "Nomor Premium", slug: "nomor-premium", icon: "📱", productsCount: 12, isActive: true },
  { id: "5", name: "Langganan", slug: "langganan", icon: "🔑", productsCount: 34, isActive: false },
];

export default function AdminCategoriesPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategori</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola kategori produk
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 px-4 py-2 gradient-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Nama Kategori</Label>
                <Input id="cat-name" placeholder="Contoh: Voucher & Kode" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-icon">Icon (Emoji)</Label>
                <Input id="cat-icon" placeholder="🎟️" />
              </div>
              <Button className="w-full gradient-primary text-white" onClick={() => setIsOpen(false)}>
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">
                    /{cat.slug} · {cat.productsCount} produk
                  </p>
                </div>
                <Badge variant={cat.isActive ? "default" : "secondary"} className="text-xs">
                  {cat.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
