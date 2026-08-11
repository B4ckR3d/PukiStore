import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email sending will not work.");
}

export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_dummy_key_for_build"
);

export const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

interface OrderEmailPayload {
  toEmail: string;
  customerName?: string;
  orderNumber: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    codes?: string[];
  }>;
}

export async function sendOrderSuccessEmail(payload: OrderEmailPayload) {
  try {
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(payload.totalAmount);

    const itemsHtml = payload.items
      .map(
        (item) => `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <strong style="color: #0f172a; font-size: 14px;">${item.name} (x${item.quantity})</strong>
            <span style="color: #2563eb; font-weight: 600;">Rp ${item.price.toLocaleString("id-ID")}</span>
          </div>
          ${
            item.codes && item.codes.length > 0
              ? `
            <div style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 8px 12px; margin-top: 8px; border-radius: 4px;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Kode Produk Digital:</div>
              ${item.codes
                .map(
                  (c) => `<code style="display: block; font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a;">${c}</code>`
                )
                .join("")}
            </div>
            `
              : `<div style="font-size: 12px; color: #64748b; margin-top: 4px;">* Produk dikirim via dashboard / proses manual</div>`
          }
        </div>
      `
      )
      .join("");

    await resend.emails.send({
      from: EMAIL_FROM,
      to: payload.toEmail,
      subject: `[PUKI STORE] Pembayaran Berhasil & Detail Pesanan #${payload.orderNumber}`,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border-radius: 16px; border: 1px solid #f1f5f9;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #2563eb; font-size: 22px; font-weight: 800; margin: 0;">PUKI STORE</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Marketplace Produk Digital #1</p>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 28px; margin-bottom: 4px;">🎉</div>
            <h3 style="color: #166534; margin: 0; font-size: 16px; font-weight: 700;">Pembayaran Berhasil!</h3>
            <p style="color: #15803d; font-size: 13px; margin-top: 4px; margin-bottom: 0;">
              Terima kasih ${payload.customerName || "Pelanggan"}, pembayaran pesanan Anda telah kami terima.
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 8px;">Detail Pesanan</div>
            <div style="font-size: 13px; color: #334155; margin-bottom: 4px;">No. Pesanan: <strong>${payload.orderNumber}</strong></div>
            <div style="font-size: 13px; color: #334155; margin-bottom: 12px;">Total Pembayaran: <strong>${formattedAmount}</strong></div>
            
            ${itemsHtml}
          </div>

          <div style="text-align: center; border-top: 1px solid #f1f5f9; pt: 16px; margin-top: 24px;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami di support@puki.web.id.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send order email via Resend:", error);
  }
}

export async function sendOTPEmail(toEmail: string, code: string) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: toEmail,
      subject: `[PUKI STORE] Kode Verifikasi OTP: ${code}`,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 440px; margin: 0 auto; padding: 28px; color: #1e293b; background-color: #ffffff; border-radius: 16px; border: 1px solid #f1f5f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 800; margin: 0;">PUKI STORE</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Verifikasi Akun Pengguna</p>
          </div>

          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Gunakan 6 digit kode OTP di bawah ini untuk menyelesaikan pendaftaran akun PUKI STORE Anda:
          </p>

          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px; border: 1px dashed #cbd5e1;">
            <span style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1e40af;">
              ${code}
            </span>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
            * Kode OTP ini berlaku selama 10 menit. Demi keamanan, jangan pernah membagikan kode ini kepada siapa pun.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send OTP email via Resend:", error);
  }
}
