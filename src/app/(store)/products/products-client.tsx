"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  SlidersHorizontal,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { useState } from "react";

const productTypes = [
  { value: "", label: "Semua" },
  { value: "CODE", label: "Voucher" },
  { value: "TOPUP", label: "Top Up" },
  { value: "ESIM", label: "eSIM" },
  { value: "NUMBER", label: "Nomor" },
  { value: "SUBSCRIPTION", label: "Langganan" },
];

// Mock products for initial display
const mockProducts = [
  {
    id: "1",
    name: "Voucher Google Play Rp 50.000",
    slug: "voucher-google-play-50k",
    price: 49000,
    comparePrice: 50000,
    type: "CODE",
    image: null,
    stock: 25,
    sold: 142,
    store: { id: "s1", name: "Digital Corner", slug: "digital-corner", isVerified: true },
    avgRating: 4.8,
    _count: { reviews: 42 },
  },
  {
    id: "2",
    name: "Top Up Diamond Mobile Legends 86",
    slug: "topup-ml-86-diamond",
    price: 22000,
    comparePrice: 25000,
    type: "TOPUP",
    image: null,
    stock: 100,
    sold: 320,
    store: { id: "s2", name: "Game Store ID", slug: "game-store-id", isVerified: true },
    avgRating: 4.9,
    _count: { reviews: 89 },
  },
  {
    id: "3",
    name: "eSIM Telkomsel 10GB 30 Hari",
    slug: "esim-telkomsel-10gb",
    price: 75000,
    comparePrice: 85000,
    type: "ESIM",
    image: null,
    stock: 15,
    sold: 58,
    store: { id: "s3", name: "eSIM Hub", slug: "esim-hub", isVerified: false },
    avgRating: 4.5,
    _count: { reviews: 23 },
  },
  {
    id: "4",
    name: "Netflix Premium 1 Bulan",
    slug: "netflix-premium-1-bulan",
    price: 45000,
    comparePrice: 54000,
    type: "SUBSCRIPTION",
    image: null,
    stock: 50,
    sold: 210,
    store: { id: "s1", name: "Digital Corner", slug: "digital-corner", isVerified: true },
    avgRating: 4.7,
    _count: { reviews: 65 },
  },
  {
    id: "5",
    name: "Voucher Steam Wallet IDR 60.000",
    slug: "voucher-steam-60k",
    price: 58000,
    comparePrice: 60000,
    type: "CODE",
    image: null,
    stock: 30,
    sold: 87,
    store: { id: "s2", name: "Game Store ID", slug: "game-store-id", isVerified: true },
    avgRating: 4.6,
    _count: { reviews: 31 },
  },
  {
    id: "6",
    name: "Top Up UC PUBG Mobile 325",
    slug: "topup-pubg-325uc",
    price: 65000,
    comparePrice: 70000,
    type: "TOPUP",
    image: null,
    stock: 80,
    sold: 156,
    store: { id: "s2", name: "Game Store ID", slug: "game-store-id", isVerified: true },
    avgRating: 4.8,
    _count: { reviews: 48 },
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function ProductsClient() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") || "";
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState(typeFilter);
  const addItem = useCartStore((s) => s.addItem);

  const filteredProducts = mockProducts.filter((p) => {
    const matchesType = !activeType || p.type === activeType;
    const matchesSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddToCart = (product: (typeof mockProducts)[0]) => {
    addItem({
      id: `cart-${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || undefined,
      storeId: product.store.id,
      storeName: product.store.name,
      type: product.type,
      stock: product.stock,
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Semua Produk</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Jelajahi berbagai produk digital pilihan
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {productTypes.map((type) => (
            <Button
              key={type.value}
              variant={activeType === type.value ? "default" : "outline"}
              size="sm"
              className={
                activeType === type.value
                  ? "gradient-primary text-white shrink-0"
                  : "shrink-0"
              }
              onClick={() => setActiveType(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium mb-1">Produk tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Product Image Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                <Package className="h-10 w-10 text-muted-foreground/30" />
                {product.comparePrice && product.comparePrice > product.price && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] border-0">
                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="absolute top-2 right-2 text-[10px]"
                >
                  {product.type}
                </Badge>
              </div>

              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  {product.store.name}
                  {product.store.isVerified && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 bg-blue-500/10 text-blue-400"
                    >
                      ✓
                    </Badge>
                  )}
                </p>
                <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1.5 mb-3">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium">
                    {product.avgRating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({product._count.reviews})
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {product.sold} terjual
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2">
                  <div>
                    <div className="text-base font-bold text-primary">
                      {formatPrice(product.price)}
                    </div>
                    {product.comparePrice &&
                      product.comparePrice > product.price && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.comparePrice)}
                        </div>
                      )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 h-8"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
