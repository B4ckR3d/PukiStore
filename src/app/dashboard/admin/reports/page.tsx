"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, ShoppingCart } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Laporan & Analitik</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Lihat performa platform secara keseluruhan
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Pendapatan Bulan Ini", value: "Rp 12.5M", change: "+12.5%", icon: TrendingUp, color: "text-emerald-400" },
          { title: "Pesanan Bulan Ini", value: "324", change: "+8.2%", icon: ShoppingCart, color: "text-blue-400" },
          { title: "User Baru", value: "156", change: "+22.1%", icon: Users, color: "text-purple-400" },
          { title: "Konversi Rate", value: "3.8%", change: "+0.5%", icon: BarChart3, color: "text-amber-400" },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pendapatan (30 Hari Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1 px-4">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = 20 + Math.random() * 80;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/60 hover:bg-primary transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`Hari ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between px-4 mt-2 text-xs text-muted-foreground">
            <span>1 Jul</span>
            <span>15 Jul</span>
            <span>30 Jul</span>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Voucher Google Play 50K", sold: 142, revenue: "Rp 6.9M" },
                { name: "Top Up ML 86 Diamond", sold: 320, revenue: "Rp 7.0M" },
                { name: "Netflix Premium 1 Bulan", sold: 210, revenue: "Rp 9.4M" },
                { name: "Steam Wallet 60K", sold: 87, revenue: "Rp 5.0M" },
              ].map((product, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sold} terjual</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{product.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seller Terbaik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Digital Corner", products: 45, revenue: "Rp 15.2M" },
                { name: "Game Store ID", products: 78, revenue: "Rp 12.8M" },
                { name: "eSIM Hub", products: 23, revenue: "Rp 4.5M" },
                { name: "Premium Keys", products: 34, revenue: "Rp 3.2M" },
              ].map((seller, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{seller.name}</p>
                    <p className="text-xs text-muted-foreground">{seller.products} produk</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{seller.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
