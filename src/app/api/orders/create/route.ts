import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
  notes: z.string().optional(),
});

function generateOrderNumber(): string {
  const date = new Date();
  const prefix = "ORD";
  const timestamp = date.getFullYear().toString().slice(-2) +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, notes } = createOrderSchema.parse(body);

    // Fetch products and validate
    const productIds = items.map((item) => item.productId);
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Beberapa produk tidak ditemukan atau tidak aktif" },
        { status: 400 }
      );
    }

    // Check stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stok ${product.name} tidak mencukupi (tersisa ${product.stock})` },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + Number(product!.price) * item.quantity;
    }, 0);

    // Create order with items
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        totalAmount,
        notes,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: Number(order.totalAmount),
          items: order.items.map((item) => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
          })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data pesanan tidak valid" },
        { status: 400 }
      );
    }
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 }
    );
  }
}
