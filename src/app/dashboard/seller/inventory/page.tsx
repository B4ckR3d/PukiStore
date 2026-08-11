"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Warehouse, Plus, Package } from "lucide-react";
import { useState } from "react";

const mockInventory = [
  { id: "1", product: "Voucher Google Play 50K", total: 30, available: 25, sold: 5 },
  { id: "2", product: "Netflix Premium 1 Bulan", total: 60, available: 50, sold: 10 },
  { id: "3", product: "Steam Wallet 60K", total: 40, available: 30, sold: 10 },
];

export default function SellerInventoryPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventori Digital</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola stok kode digital untuk produk Anda
          </p>
        </div>
        <Button className="gradient-primary text-white" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kode
        </Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">Tambah Kode Digital</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pilih Produk</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih produk..." />
                </SelectTrigger>
                <SelectContent>
                  {mockInventory.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kode Digital (1 per baris)</Label>
              <Textarea
                placeholder={"XXXX-XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY-YYYY\nZZZZ-ZZZZ-ZZZZ-ZZZZ"}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Masukkan setiap kode di baris terpisah. Kode akan ditambahkan ke stok produk.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="gradient-primary text-white">Simpan</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Batal</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <div className="grid gap-4">
        {mockInventory.map((inv) => (
          <Card key={inv.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{inv.product}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Total: <strong>{inv.total}</strong>
                    </span>
                    <span className="text-xs text-emerald-400">
                      Tersedia: <strong>{inv.available}</strong>
                    </span>
                    <span className="text-xs text-amber-400">
                      Terjual: <strong>{inv.sold}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Stock Bar */}
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(inv.available / inv.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {Math.round((inv.available / inv.total) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
