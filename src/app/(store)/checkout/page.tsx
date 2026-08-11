"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Loader2,
  ShieldCheck,
  Package,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    qrisUrl: string;
    transactionId: string;
    expiredAt: string;
    amount: number;
  } | null>(null);

  const total = getTotal();

  const handleCheckout = async () => {
    if (!session?.user) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    setIsProcessing(true);
    try {
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          notes,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.error || "Gagal membuat pesanan");
        return;
      }

      const paymentRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.data.id }),
      });

      const paymentResult = await paymentRes.json();

      if (!paymentRes.ok) {
        toast.error(paymentResult.error || "Gagal membuat pembayaran");
        return;
      }

      setPaymentData({
        qrisUrl: paymentResult.data.qrisUrl,
        transactionId: paymentResult.data.transactionId,
        expiredAt: paymentResult.data.expiredAt,
        amount: paymentResult.data.amount || total,
      });

      clearCart();
      toast.success("Pesanan berhasil dibuat!");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentData) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-2">
              <QrCode className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>Scan QRIS untuk Membayar</CardTitle>
            <p className="text-sm text-muted-foreground">
              Scan kode QR di bawah menggunakan e-wallet atau mobile banking
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="mx-auto w-64 h-64 rounded-xl bg-white p-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={paymentData.qrisUrl}
                alt="QRIS Payment Code"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-2xl font-bold text-primary">
              {formatPrice(paymentData.amount)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Transaksi aman & terenkripsi
              </div>
              <p className="text-xs text-muted-foreground">
                Kode QR berlaku hingga{" "}
                {new Date(paymentData.expiredAt).toLocaleString("id-ID")}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button
                className="w-full gradient-primary text-white"
                onClick={() => router.push("/dashboard/orders")}
              >
                Cek Status Pembayaran
              </Button>
              <Link href="/products">
                <Button variant="ghost" className="w-full">
                  Lanjut Belanja
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Keranjang Kosong</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Tambahkan produk ke keranjang untuk melanjutkan checkout
        </p>
        <Link href="/products">
          <Button className="gradient-primary text-white">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Kembali ke Keranjang
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Produk Dipesan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.storeName} · {item.quantity}x
                    </p>
                  </div>
                  <div className="text-sm font-medium shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Catatan (Opsional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes" className="sr-only">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan untuk pesanan ini..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <QrCode className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-semibold">QRIS (KlikQRIS)</p>
                  <p className="text-xs text-muted-foreground">
                    Bayar via e-wallet, mobile banking, atau scan QR
                  </p>
                </div>
                <Badge className="ml-auto gradient-primary text-white border-0">
                  Aktif
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Layanan</span>
                  <span className="text-emerald-400">Gratis</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <Button
                className="w-full h-12 gradient-primary text-white text-base"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="mr-2 h-4 w-4" />
                )}
                Bayar Sekarang
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Transaksi dijamin aman
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
