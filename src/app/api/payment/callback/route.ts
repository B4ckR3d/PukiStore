import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { klikqris } from "@/lib/klikqris";

/**
 * KlikQRIS Webhook Callback
 * This endpoint receives payment status updates from KlikQRIS.
 * It should NOT require authentication (called by KlikQRIS server).
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate webhook
    if (!klikqris.validateWebhook(payload)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const webhookData = klikqris.parseWebhook(payload);

    // Find payment by transaction ID
    const payment = await db.payment.findFirst({
      where: { transactionId: webhookData.transactionId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      console.error(
        "Payment not found for transaction:",
        webhookData.transactionId
      );
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    if (webhookData.status === "SUCCESS") {
      // Update payment status
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          paidAt: webhookData.paidAt || new Date(),
        },
      });

      // Update order status
      await db.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" },
      });

      // Auto-deliver digital codes
      for (const item of payment.order.items) {
        const availableCodes = await db.digitalInventory.findMany({
          where: {
            productId: item.productId,
            isSold: false,
          },
          take: item.quantity,
        });

        const deliveredCodes = availableCodes.map((inv) => inv.code);

        // Mark inventory as sold
        if (availableCodes.length > 0) {
          await db.digitalInventory.updateMany({
            where: {
              id: { in: availableCodes.map((inv) => inv.id) },
            },
            data: {
              isSold: true,
              soldAt: new Date(),
              orderItemId: item.id,
            },
          });
        }

        // Store delivered codes on order item
        await db.orderItem.update({
          where: { id: item.id },
          data: { deliveredCodes },
        });

        // Update product sold count and stock
        await db.product.update({
          where: { id: item.productId },
          data: {
            sold: { increment: item.quantity },
            stock: { decrement: availableCodes.length },
          },
        });
      }

      // Update order status to COMPLETED (auto-delivered)
      await db.order.update({
        where: { id: payment.orderId },
        data: { status: "COMPLETED" },
      });

      // Credit seller balance
      const storeIds = [
        ...new Set(payment.order.items.map((item) => item.product.storeId)),
      ];

      for (const storeId of storeIds) {
        const storeItems = payment.order.items.filter(
          (item) => item.product.storeId === storeId
        );
        const storeRevenue = storeItems.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0
        );

        // Credit 90% to seller (10% platform fee)
        const sellerAmount = storeRevenue * 0.9;
        await db.store.update({
          where: { id: storeId },
          data: {
            balance: { increment: sellerAmount },
          },
        });
      }
    } else if (
      webhookData.status === "FAILED" ||
      webhookData.status === "EXPIRED"
    ) {
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: webhookData.status === "FAILED" ? "FAILED" : "EXPIRED",
        },
      });

      await db.order.update({
        where: { id: payment.orderId },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
