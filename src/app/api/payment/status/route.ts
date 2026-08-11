import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { klikqris } from "@/lib/klikqris";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID diperlukan" },
        { status: 400 }
      );
    }

    // Check local payment status first
    const payment = await db.payment.findFirst({
      where: { transactionId },
      include: {
        order: {
          include: {
            items: {
              select: {
                deliveredCodes: true,
                product: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment tidak ditemukan" },
        { status: 404 }
      );
    }

    // If still pending, check with KlikQRIS
    if (payment.status === "PENDING") {
      const statusResult = await klikqris.checkStatus(transactionId);

      if (statusResult.success && statusResult.data?.status === "SUCCESS") {
        // Payment confirmed - webhook might not have arrived yet
        // The webhook handler will process the full logic
        return NextResponse.json({
          success: true,
          data: {
            status: "SUCCESS",
            amount: Number(payment.amount),
            paidAt: statusResult.data.paidAt,
            orderNumber: payment.order.orderNumber,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        status: payment.status,
        amount: Number(payment.amount),
        paidAt: payment.paidAt,
        expiredAt: payment.expiredAt,
        orderNumber: payment.order.orderNumber,
        deliveredItems:
          payment.status === "SUCCESS"
            ? payment.order.items.map((item) => ({
                productName: item.product.name,
                codes: item.deliveredCodes,
              }))
            : undefined,
      },
    });
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { error: "Gagal mengecek status pembayaran" },
      { status: 500 }
    );
  }
}
