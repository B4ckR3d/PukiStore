import { z } from "zod";

export const checkoutSchema = z.object({
  notes: z.string().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
