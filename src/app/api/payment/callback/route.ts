import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOrderSuccessEmail } from "@/lib/resend";

/**
 * Official KlikQRIS Webhook Callback
 * Receives JSON webhook payload for status changes (PAID / EXPIRED / FAILED).
 * Always responds with HTTP 200 OK to acknowledge receipt.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("KlikQRIS Webhook received:", payload);

    const orderId = payload.order_id;
    const rawStatus = (payload.status || "").toUpperCase();

    if (!orderId) {
      return NextResponse.json({ status: false, message: "Missing order_id" }, { status: 200 });
    }

    // Find order by orderNumber or ID
    const order = await db.order.findFirst({
      where: {
        OR: [
          { orderNumber: orderId },
          { id: orderId },
        ],
      },
      include: {
        payment: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      console.warn("KlikQRIS Webhook: Order not found for order_id:", orderId);
      return NextResponse.json({ status: true, message: "Order not found in database" });
    }

    // 1. Prevent Double Processing (as required by KlikQRIS docs)
    if (order.status === "PAID" || order.status === "COMPLETED") {
      return NextResponse.json({ status: true, message: "Order already processed" });
    }

    const isPaid = rawStatus === "PAID" || rawStatus === "SUCCESS";

    if (isPaid) {
      // Update payment record
      if (order.payment) {
        await db.payment.update({
          where: { id: order.payment.id },
          data: {
            status: "SUCCESS",
            paidAt: payload.payment_date ? new Date(payload.payment_date) : new Date(),
          },
        });
      }

      // Update order status to PAID
      await db.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });

      // Auto-deliver digital codes & update stock
      for (const item of order.items) {
        const availableCodes = await db.digitalInventory.findMany({
          where: {
            productId: item.productId,
            isSold: false,
          },
          take: item.quantity,
        });

        const deliveredCodes = availableCodes.map((inv) => inv.code);

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

        await db.orderItem.update({
          where: { id: item.id },
          data: { deliveredCodes },
        });

        await db.product.update({
          where: { id: item.productId },
          data: {
            sold: { increment: item.quantity },
            stock: { decrement: availableCodes.length },
          },
        });
      }

      // Update order to COMPLETED
      await db.order.update({
        where: { id: order.id },
        data: { status: "COMPLETED" },
      });

      // Credit seller balance (90% revenue, 10% platform fee)
      const storeIds = [...new Set(order.items.map((item) => item.product.storeId))];
      for (const storeId of storeIds) {
        const storeItems = order.items.filter((item) => item.product.storeId === storeId);
        const storeRevenue = storeItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const sellerAmount = storeRevenue * 0.9;
        await db.store.update({
          where: { id: storeId },
          data: { balance: { increment: sellerAmount } },
        });
      }

      // Send order details & digital codes via Resend email to customer
      if (order.user?.email) {
        const updatedItems = await db.orderItem.findMany({
          where: { orderId: order.id },
          include: { product: true },
        });

        await sendOrderSuccessEmail({
          toEmail: order.user.email,
          customerName: order.user.name || undefined,
          orderNumber: order.orderNumber,
          totalAmount: Number(order.totalAmount),
          items: updatedItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
            codes: item.deliveredCodes,
          })),
        });
      }
    } else if (rawStatus === "EXPIRED" || rawStatus === "FAILED") {
      if (order.payment) {
        await db.payment.update({
          where: { id: order.payment.id },
          data: { status: rawStatus === "FAILED" ? "FAILED" : "EXPIRED" },
        });
      }

      await db.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ status: true, message: "Webhook acknowledged" });
  } catch (error) {
    console.error("KlikQRIS Webhook error:", error);
    return NextResponse.json({ status: true, message: "Error handled" });
  }
}
