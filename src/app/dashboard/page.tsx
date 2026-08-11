"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Users,
  Activity,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  index,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  index: number;
}) {
  const isPositive = change >= 0;

  return (
    <motion.div custom={index} initial="hidden" animate="visible" variants={fadeIn}>
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <Badge
              variant="secondary"
              className={`text-xs ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="mr-0.5 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-0.5 h-3 w-3" />
              )}
              {Math.abs(change)}%
            </Badge>
          </div>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AdminDashboard() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Pendapatan" value="Rp 12.500.000" change={12.5} icon={CreditCard} index={0} />
        <StatCard title="Total Pesanan" value="1,284" change={8.2} icon={ShoppingCart} index={1} />
        <StatCard title="Total Produk" value="356" change={-2.1} icon={Package} index={2} />
        <StatCard title="Total Pengguna" value="4,521" change={15.3} icon={Users} index={3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Pesanan Terbaru</CardTitle>
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm">
                  Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "ORD-001", user: "John Doe", amount: "Rp 150.000", status: "COMPLETED" },
                  { id: "ORD-002", user: "Jane Smith", amount: "Rp 75.000", status: "PAID" },
                  { id: "ORD-003", user: "Bob Wilson", amount: "Rp 250.000", status: "PENDING" },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{order.amount}</p>
                      <Badge variant="outline" className={`text-[10px] ${order.status === "COMPLETED" ? "border-emerald-500/30 text-emerald-400" : order.status === "PAID" ? "border-blue-500/30 text-blue-400" : "border-amber-500/30 text-amber-400"}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Aktivitas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: "Pengguna baru mendaftar", time: "2 menit lalu", icon: Users },
                  { text: "Pesanan #ORD-001 selesai", time: "15 menit lalu", icon: ShoppingCart },
                  { text: "Produk baru ditambahkan", time: "1 jam lalu", icon: Package },
                  { text: "Pembayaran berhasil", time: "2 jam lalu", icon: CreditCard },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                      <activity.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

function SellerDashboard() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pendapatan" value="Rp 3.250.000" change={18.2} icon={CreditCard} index={0} />
        <StatCard title="Pesanan Masuk" value="84" change={5.7} icon={ShoppingCart} index={1} />
        <StatCard title="Produk Aktif" value="42" change={3.1} icon={Package} index={2} />
        <StatCard title="Saldo Tersedia" value="Rp 1.850.000" change={22.4} icon={TrendingUp} index={3} />
      </div>

      <div className="mt-6">
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                <Link href="/dashboard/products/new">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium">Tambah Produk</span>
                  </Button>
                </Link>
                <Link href="/dashboard/seller/inventory">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                    <Store className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium">Kelola Inventori</span>
                  </Button>
                </Link>
                <Link href="/dashboard/seller/withdraw">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium">Tarik Saldo</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

function ClientDashboard() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Pesanan" value="12" change={0} icon={ShoppingCart} index={0} />
        <StatCard title="Total Belanja" value="Rp 450.000" change={0} icon={CreditCard} index={1} />
        <StatCard title="Menunggu Bayar" value="1" change={0} icon={Activity} index={2} />
      </div>

      <div className="mt-6">
        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Pesanan Terbaru</CardTitle>
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm">
                  Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Belum ada pesanan. Mulai belanja sekarang!
                </p>
                <Link href="/products">
                  <Button className="gradient-primary text-white">
                    Mulai Belanja <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || "CLIENT";

  const greetings: Record<string, string> = {
    ADMIN: "Admin Dashboard",
    SELLER: "Seller Dashboard",
    CLIENT: "Dashboard Saya",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{greetings[role] || "Dashboard"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selamat datang, {session?.user?.name || "User"}!
        </p>
      </div>

      {role === "ADMIN" && <AdminDashboard />}
      {role === "SELLER" && <SellerDashboard />}
      {role === "CLIENT" && <ClientDashboard />}
    </div>
  );
}
