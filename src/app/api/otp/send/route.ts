import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { z } from "zod";

const sendOTPSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = sendOTPSchema.parse(body);

    // Rate limiting: check if OTP was sent in last 60 seconds
    const recentOTP = await db.oTPToken.findFirst({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
    });

    if (recentOTP) {
      return NextResponse.json(
        { error: "Tunggu 60 detik sebelum mengirim ulang OTP" },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous OTPs
    await db.oTPToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Save new OTP
    await db.oTPToken.create({
      data: {
        email,
        code,
        expires,
      },
    });

    // Send email via Resend
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Kode Verifikasi PUKI STORE",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 420px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 8px;">Kode Verifikasi</h1>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
            Gunakan kode berikut untuk memverifikasi akun Anda di PUKI STORE.
          </p>
          <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1e40af;">
              ${code}
            </span>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">
            Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP berhasil dikirim" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Email tidak valid" },
        { status: 400 }
      );
    }
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim OTP" },
      { status: 500 }
    );
  }
}
