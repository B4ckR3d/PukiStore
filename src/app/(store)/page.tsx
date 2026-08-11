import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  QrCode,
  Smartphone,
  Gamepad2,
  CreditCard,
  Globe,
  Star,
  TrendingUp,
} from "lucide-react";

const categories = [
  {
    name: "Voucher & Kode",
    icon: CreditCard,
    href: "/products?type=CODE",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
  },
  {
    name: "Top Up Game",
    icon: Gamepad2,
    href: "/products?type=TOPUP",
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-400",
  },
  {
    name: "eSIM Data",
    icon: Globe,
    href: "/products?type=ESIM",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
  },
  {
    name: "Nomor Premium",
    icon: Smartphone,
    href: "/products?type=NUMBER",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
  },
];

const features = [
  {
    icon: Zap,
    title: "Instan Delivery",
    desc: "Kode dikirim otomatis setelah pembayaran berhasil",
  },
  {
    icon: ShieldCheck,
    title: "100% Aman",
    desc: "Transaksi dijamin aman dengan pembayaran QRIS",
  },
  {
    icon: QrCode,
    title: "Bayar via QRIS",
    desc: "Scan & bayar dari semua e-wallet dan mobile banking",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-xs font-semibold"
            >
              <Star className="mr-1.5 h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              Marketplace Produk Digital #1
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Beli Produk Digital{" "}
              <span className="gradient-text">Cepat & Aman</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Voucher game, top-up saldo, eSIM, dan berbagai produk digital
              lainnya. Pembayaran mudah via QRIS, pengiriman kode otomatis.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="gradient-primary text-white px-8 h-12 text-base"
                >
                  Mulai Belanja
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-12 text-base"
                >
                  Jadi Seller
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-2">
                  <f.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Kategori Produk</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Temukan produk digital sesuai kebutuhanmu
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" size="sm">
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <cat.icon className={`h-8 w-8 ${cat.iconColor} mb-4`} />
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lihat produk →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Cara Belanja</h2>
            <p className="text-sm text-muted-foreground">
              3 langkah mudah untuk mendapatkan produk digital
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Pilih Produk",
                desc: "Browse dan pilih produk digital yang kamu butuhkan dari berbagai seller terpercaya.",
                icon: "🛒",
              },
              {
                step: "02",
                title: "Bayar via QRIS",
                desc: "Scan kode QRIS menggunakan e-wallet atau mobile banking favoritmu.",
                icon: "📱",
              },
              {
                step: "03",
                title: "Terima Kode",
                desc: "Kode digital langsung dikirim otomatis ke akunmu setelah pembayaran berhasil.",
                icon: "✅",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-border/50 bg-card p-8 text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex h-7 items-center rounded-full gradient-primary px-3 text-xs font-bold text-white">
                    {item.step}
                  </span>
                </div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl gradient-primary p-8 sm:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
              {[
                { value: "10K+", label: "Produk Digital" },
                { value: "5K+", label: "Seller Aktif" },
                { value: "50K+", label: "Transaksi Sukses" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl sm:text-4xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Mulai Jual Produk Digitalmu
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Daftar sebagai seller dan mulai jual produk digital ke ribuan
            pembeli. Gratis pendaftaran, pembayaran otomatis.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="gradient-primary text-white px-8 h-12"
            >
              Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
