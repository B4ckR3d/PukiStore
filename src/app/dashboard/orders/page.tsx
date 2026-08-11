"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pesanan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola semua pesanan Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">
              Belum ada pesanan
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
