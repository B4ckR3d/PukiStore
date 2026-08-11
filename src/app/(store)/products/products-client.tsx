"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Package,
  ShoppingCart,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const productTypes = [
  { value: "", label: "Semua" },
  { value: "CODE", label: "Voucher" },
  { value: "TOPUP", label: "Top Up" },
  { value: "ESIM", label: "eSIM" },
  { value: "NUMBER", label: "Nomor" },
  { value: "SUBSCRIPTION", label: "Langganan" },
];

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  type: string;
  image?: string | null;
  stock: number;
  sold: number;
  store: {
    id: string;
    name: string;
    slug: string;
    isVerified?: boolean;
  };
  avgRating?: number;
  _count?: {
    reviews: number;
  };
}

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
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (activeType) query.append("type", activeType);
        if (search) query.append("search", search);

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();

        if (res.ok && data.data) {
          const formatted = data.data.map((p: any) => ({
            ...p,
            price: Number(p.price),
            comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
            avgRating: 4.8,
            _count: p._count || { reviews: 0 },
          }));
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [activeType, search]);

  const handleAddToCart = (product: ProductItem) => {
    if (product.stock <= 0) {
      toast.error("Stok produk habis");
      return;
    }

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
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Memuat produk...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium mb-1">Produk tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const isOutOfStock = product.stock <= 0;

            return (
              <Card
                key={product.id}
                className={`group overflow-hidden transition-all duration-300 ${
                  isOutOfStock
                    ? "opacity-75 border-destructive/20 bg-muted/20"
                    : "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                }`}
              >
                {/* Product Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                  <Package className="h-10 w-10 text-muted-foreground/30" />

                  {/* Discount Badge */}
                  {product.comparePrice && product.comparePrice > product.price && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] border-0">
                      -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                    </Badge>
                  )}

                  {/* Stock Status Badge */}
                  {isOutOfStock ? (
                    <Badge className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] border-0 font-semibold px-2 py-0.5 shadow">
                      Stok Habis
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 text-[10px]"
                    >
                      {product.type}
                    </Badge>
                  )}
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
                      ({product._count?.reviews || 0})
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
                      variant={isOutOfStock ? "secondary" : "outline"}
                      className={`shrink-0 h-8 gap-1.5 ${
                        isOutOfStock ? "cursor-not-allowed bg-muted text-muted-foreground" : ""
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? (
                        <span className="text-xs font-semibold text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Habis
                        </span>
                      ) : (
                        <ShoppingCart className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
