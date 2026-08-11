"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaksi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Riwayat semua transaksi
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">
              Belum ada transaksi
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
