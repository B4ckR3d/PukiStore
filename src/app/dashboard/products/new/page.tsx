"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { useState } from "react";

const productTypes = [
  { value: "CODE", label: "Voucher & Kode" },
  { value: "TOPUP", label: "Top Up" },
  { value: "ESIM", label: "eSIM" },
  { value: "NUMBER", label: "Nomor Premium" },
  { value: "SUBSCRIPTION", label: "Langganan" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined as unknown as number,
      type: "CODE" as const,
      isActive: true,
      isFeatured: false,
      images: [],
    },
  });

  const onSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      console.log("Product data:", data);
      toast.success("Produk berhasil ditambahkan!");
      router.push("/dashboard/products");
    } catch {
      toast.error("Gagal menambahkan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Isi informasi produk digital yang akan dijual
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                placeholder="Contoh: Voucher Google Play Rp 50.000"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan produk Anda secara detail..."
                rows={4}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipe Produk *</Label>
              <Select
                defaultValue="CODE"
                onValueChange={(value) =>
                  setValue("type", value as ProductInput["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Harga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga Jual (Rp) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="50000"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Harga Coret (Rp)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  placeholder="60000"
                  {...register("comparePrice")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kode Digital</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Tambah Kode (1 per baris)</Label>
              <Textarea
                placeholder={"XXXX-XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY-YYYY"}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Kode ini akan dikirim otomatis ke pembeli setelah pembayaran berhasil.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/products">
            <Button variant="outline" type="button">
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            className="gradient-primary text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Package className="mr-2 h-4 w-4" />
            )}
            Tambah Produk
          </Button>
        </div>
      </form>
    </div>
  );
}
