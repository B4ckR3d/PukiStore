import Link from "next/link";
import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold">
                PUKI <span className="text-primary">STORE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Marketplace produk digital terpercaya. Transaksi cepat dan aman
              dengan pembayaran QRIS.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Produk</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?type=CODE"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Voucher & Kode
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=TOPUP"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Top Up
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=ESIM"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  eSIM
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=SUBSCRIPTION"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Langganan
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Perusahaan</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Bantuan</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cara Belanja
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Jadi Seller
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pusat Bantuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PUKI STORE. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Pembayaran via
            </span>
            <span className="text-xs font-semibold text-primary">
              KlikQRIS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
