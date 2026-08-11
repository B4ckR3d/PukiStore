"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola produk digital Anda
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gradient-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Belum ada produk. Tambahkan produk pertamamu!
            </p>
            <Link href="/dashboard/products/new">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
