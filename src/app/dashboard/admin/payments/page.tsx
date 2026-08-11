"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard } from "lucide-react";

const mockPayments = [
  { id: "1", orderNumber: "ORD-260801-A1B2C3", amount: 150000, method: "QRIS", status: "SUCCESS", paidAt: "2026-08-09T10:30:00" },
  { id: "2", orderNumber: "ORD-260801-D4E5F6", amount: 75000, method: "QRIS", status: "PENDING", paidAt: null },
  { id: "3", orderNumber: "ORD-260801-G7H8I9", amount: 250000, method: "QRIS", status: "SUCCESS", paidAt: "2026-08-09T09:15:00" },
  { id: "4", orderNumber: "ORD-260802-J1K2L3", amount: 45000, method: "QRIS", status: "EXPIRED", paidAt: null },
  { id: "5", orderNumber: "ORD-260802-M4N5O6", amount: 120000, method: "QRIS", status: "SUCCESS", paidAt: "2026-08-08T14:22:00" },
];

const statusColors: Record<string, string> = {
  SUCCESS: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  FAILED: "bg-red-500/15 text-red-400 border-red-500/30",
  EXPIRED: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pembayaran</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor semua transaksi pembayaran</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sukses</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">Rp 520.000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Menunggu Bayar</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">Rp 75.000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Gagal/Expired</p>
            <p className="text-2xl font-bold text-red-400 mt-1">Rp 45.000</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">{payment.orderNumber}</TableCell>
                  <TableCell className="font-medium">{formatPrice(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      <CreditCard className="mr-1 h-3 w-3" />
                      {payment.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColors[payment.status]}`}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
