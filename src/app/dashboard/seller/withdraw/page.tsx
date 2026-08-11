"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownToLine,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const mockWithdrawals = [
  { id: "1", amount: 500000, bank: "BCA", account: "****4321", status: "COMPLETED", date: "2026-08-05" },
  { id: "2", amount: 250000, bank: "BNI", account: "****8765", status: "PENDING", date: "2026-08-08" },
  { id: "3", amount: 750000, bank: "BCA", account: "****4321", status: "APPROVED", date: "2026-08-07" },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/30", label: "Menunggu" },
  APPROVED: { icon: CheckCircle2, color: "text-blue-400 bg-blue-500/10 border-blue-500/30", label: "Disetujui" },
  COMPLETED: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", label: "Selesai" },
  REJECTED: { icon: AlertCircle, color: "text-red-400 bg-red-500/10 border-red-500/30", label: "Ditolak" },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function SellerWithdrawPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Penarikan Saldo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tarik saldo toko Anda ke rekening bank
        </p>
      </div>

      {/* Balance */}
      <Card className="border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Tersedia</p>
              <p className="text-3xl font-bold text-primary">Rp 1.850.000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ajukan Penarikan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah Penarikan</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Minimal Rp 50.000"
              min={50000}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Nama Bank</Label>
              <Input id="bank" placeholder="BCA, BNI, Mandiri, dll" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Nomor Rekening</Label>
              <Input id="account" placeholder="1234567890" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="holder">Nama Pemilik Rekening</Label>
            <Input id="holder" placeholder="Sesuai buku tabungan" />
          </div>
          <Button className="w-full gradient-primary text-white h-11">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Ajukan Penarikan
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Penarikan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockWithdrawals.map((wd) => {
            const config = statusConfig[wd.status];
            return (
              <div key={wd.id} className="flex items-center gap-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{formatPrice(wd.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {wd.bank} {wd.account} · {new Date(wd.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <Badge variant="outline" className={`text-xs ${config.color}`}>
                  <config.icon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
