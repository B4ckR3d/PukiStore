import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { otpSchema } from "@/lib/validations/auth";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = otpSchema.parse(body);

    // Find valid OTP
    const otpToken = await db.oTPToken.findFirst({
      where: {
        email,
        code,
        used: false,
        expires: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpToken) {
      return NextResponse.json(
        { error: "Kode OTP tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db.oTPToken.update({
      where: { id: otpToken.id },
      data: { used: true },
    });

    // Verify user email
    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Email berhasil diverifikasi",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid" },
        { status: 400 }
      );
    }
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi OTP" },
      { status: 500 }
    );
  }
}
