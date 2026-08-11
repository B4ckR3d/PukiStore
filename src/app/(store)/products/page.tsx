import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsClient } from "./products-client";

export const metadata = {
  title: "Produk",
  description: "Jelajahi semua produk digital di PUKI STORE",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72 mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
