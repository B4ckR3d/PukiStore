"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  User,
  LayoutDashboard,
  LogOut,
  Store,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass dark:glass border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              PUKI <span className="text-primary">STORE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              Produk
            </Link>
            <Link
              href="/products?type=CODE"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              Voucher
            </Link>
            <Link
              href="/products?type=TOPUP"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              Top Up
            </Link>
            <Link
              href="/products?type=ESIM"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              eSIM
            </Link>
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            <Link href="/products">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] gradient-primary text-white border-0">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </Link>

            {/* User Menu */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-full focus:outline-none"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard/orders"}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pesanan Saya
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard/settings"}>
                    <User className="mr-2 h-4 w-4" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="gradient-primary text-white">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              <Link
                href="/products"
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Semua Produk
              </Link>
              <Link
                href="/products?type=CODE"
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Voucher & Kode
              </Link>
              <Link
                href="/products?type=TOPUP"
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Top Up
              </Link>
              <Link
                href="/products?type=ESIM"
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                eSIM
              </Link>
              {!session?.user && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-border/40">
                  <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gradient-primary text-white">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
