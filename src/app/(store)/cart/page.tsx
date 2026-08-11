"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Package,
} from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } =
    useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingCart className="h-20 w-20 text-muted-foreground/20 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-8">
            Belum ada produk di keranjang. Yuk mulai belanja!
          </p>
          <Link href="/products">
            <Button className="gradient-primary text-white">
              Mulai Belanja <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Keranjang</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} produk di keranjang
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={clearCart}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Hapus Semua
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {item.storeName}
                    </p>
                    <h3 className="font-medium text-sm leading-snug mb-2 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-primary">
                        {formatPrice(item.price)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive ml-1"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Lanjut Belanja
            </Button>
          </Link>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Ringkasan Belanja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate mr-2">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span className="text-primary text-lg">
                  {formatPrice(total)}
                </span>
              </div>
              <Link href="/checkout">
                <Button className="w-full gradient-primary text-white h-11">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
