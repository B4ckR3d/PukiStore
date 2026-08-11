import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { sendOTPEmail } from "@/lib/resend";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (unverified by default)
    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "CLIENT",
        emailVerified: null,
      },
    });

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP token to DB
    await db.oTPToken.create({
      data: {
        email,
        code: otpCode,
        expires,
      },
    });

    // Send OTP email via Resend
    await sendOTPEmail(email, otpCode);

    return NextResponse.json(
      {
        success: true,
        requireOTP: true,
        message: "Akun berhasil dibuat. Kode OTP telah dikirim ke email Anda.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Gagal membuat akun" },
      { status: 500 }
    );
  }
}
