import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Harga harus lebih dari 0"),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  type: z.enum(["CODE", "ESIM", "NUMBER", "TOPUP", "SUBSCRIPTION"]),
  categoryId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  image: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
});

export const digitalInventorySchema = z.object({
  codes: z
    .string()
    .min(1, "Masukkan minimal 1 kode")
    .transform((val) =>
      val
        .split("\n")
        .map((code) => code.trim())
        .filter(Boolean)
    ),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  icon: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export type ProductInput = z.infer<typeof productSchema>;
export type DigitalInventoryInput = z.infer<typeof digitalInventorySchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
