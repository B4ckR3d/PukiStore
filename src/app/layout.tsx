import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PUKI STORE — Marketplace Produk Digital",
    template: "%s | PUKI STORE",
  },
  description:
    "Marketplace produk digital terpercaya. Jual beli voucher, kode game, eSIM, top-up, dan produk digital lainnya dengan pembayaran QRIS.",
  keywords: [
    "marketplace",
    "produk digital",
    "voucher",
    "kode game",
    "eSIM",
    "top-up",
    "QRIS",
  ],
  authors: [{ name: "PUKI STORE" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "PUKI STORE",
    title: "PUKI STORE — Marketplace Produk Digital",
    description:
      "Marketplace produk digital terpercaya. Jual beli voucher, kode game, eSIM, top-up, dan produk digital lainnya.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
