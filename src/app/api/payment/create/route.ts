import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { klikqris } from "@/lib/klikqris";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID diperlukan" },
        { status: 400 }
      );
    }

    // Get order
    const order = await db.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        payment: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    if (order.payment?.status === "SUCCESS") {
      return NextResponse.json(
        { error: "Order sudah dibayar" },
        { status: 400 }
      );
    }

    // Create QRIS payment via KlikQRIS
    const qrisResult = await klikqris.createPayment({
      amount: Number(order.totalAmount),
      orderId: order.orderNumber,
      customerName: order.user.name || undefined,
      customerEmail: order.user.email,
      description: `Pembayaran order ${order.orderNumber}`,
    });

    if (!qrisResult.success || !qrisResult.data) {
      return NextResponse.json(
        { error: qrisResult.message || "Gagal membuat QRIS" },
        { status: 500 }
      );
    }

    const finalAmount = qrisResult.data.totalAmount || Number(order.totalAmount);

    // Create or update payment record
    const payment = await db.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        method: "QRIS",
        status: "PENDING",
        amount: finalAmount,
        qrisUrl: qrisResult.data.qrisUrl,
        qrisData: qrisResult.data.qrisImage || qrisResult.data.qrisUrl,
        transactionId: qrisResult.data.transactionId || order.orderNumber,
        expiredAt: new Date(qrisResult.data.expiredAt),
      },
      update: {
        qrisUrl: qrisResult.data.qrisUrl,
        qrisData: qrisResult.data.qrisImage || qrisResult.data.qrisUrl,
        transactionId: qrisResult.data.transactionId || order.orderNumber,
        expiredAt: new Date(qrisResult.data.expiredAt),
        amount: finalAmount,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        qrisUrl: payment.qrisUrl,
        transactionId: payment.transactionId,
        amount: Number(payment.amount),
        expiredAt: payment.expiredAt,
        signature: qrisResult.data.signature,
      },
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pembayaran" },
      { status: 500 }
    );
  }
}
