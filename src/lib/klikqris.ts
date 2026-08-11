/**
 * KlikQRIS Payment Gateway Client
 * Updated to match Official KlikQRIS API Documentation (https://klikqris.com/api)
 */

interface CreateQRISPayload {
  amount: number;
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
}

interface QRISResponse {
  success: boolean;
  data?: {
    orderId: string;
    transactionId: string;
    qrisUrl: string;
    qrisImage?: string;
    amount: number;
    totalAmount: number;
    expiredAt: string;
    signature?: string;
  };
  message?: string;
}

interface PaymentStatusResponse {
  success: boolean;
  data?: {
    orderId: string;
    status: "PENDING" | "PAID" | "SUCCESS" | "FAILED" | "EXPIRED";
    amount: number;
    totalAmount: number;
    paidAt?: string;
    signature?: string;
  };
  message?: string;
}

class KlikQRISClient {
  private apiKey: string;
  private merchantId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KLIKQRIS_API_KEY || "";
    this.merchantId = process.env.KLIKQRIS_MERCHANT_ID || "";
    this.baseUrl = process.env.KLIKQRIS_BASE_URL || "https://klikqris.com/api";
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
      "id_merchant": this.merchantId,
    };
  }

  /**
   * Create a new QRIS payment (POST /qris/create)
   */
  async createPayment(payload: CreateQRISPayload): Promise<QRISResponse> {
    try {
      if (!this.apiKey || this.apiKey.startsWith("your_")) {
        return this.mockCreatePayment(payload);
      }

      const response = await fetch(`${this.baseUrl}/qris/create`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          order_id: payload.orderId,
          id_merchant: this.merchantId,
          amount: payload.amount,
          keterangan: payload.description || `Pembayaran Order #${payload.orderId}`,
          callback_url:
            process.env.KLIKQRIS_CALLBACK_URL ||
            `${process.env.NEXT_PUBLIC_APP_URL || "http://puki.web.id"}/api/payment/callback`,
        }),
      });

      const responseText = await response.text();
      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("KlikQRIS non-JSON response:", response.status, responseText);
        return this.mockCreatePayment(payload);
      }

      if (data && (data.status === true || data.success === true) && data.data) {
        return {
          success: true,
          data: {
            orderId: data.data.order_id || payload.orderId,
            transactionId: data.data.order_id || payload.orderId,
            qrisUrl:
              data.data.qris_url ||
              data.data.qris_image ||
              `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MOCK-QRIS-${payload.orderId}`,
            qrisImage: data.data.qris_image,
            amount: Number(data.data.amount) || payload.amount,
            totalAmount: Number(data.data.total_amount) || payload.amount,
            expiredAt: data.data.expired_at || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            signature: data.data.signature,
          },
          message: data.message,
        };
      }

      console.warn("KlikQRIS API returned non-success response, falling back to mock:", data);
      return this.mockCreatePayment(payload);
    } catch (error) {
      console.error("KlikQRIS createPayment error:", error);
      return this.mockCreatePayment(payload);
    }
  }

  /**
   * Check status manual (GET /qris/status/{order_id})
   */
  async checkStatus(orderId: string): Promise<PaymentStatusResponse> {
    try {
      if (!this.apiKey || this.apiKey.startsWith("your_")) {
        return this.mockCheckStatus(orderId);
      }

      const response = await fetch(`${this.baseUrl}/qris/status/${orderId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      const responseText = await response.text();
      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch {
        return this.mockCheckStatus(orderId);
      }

      if (data && (data.status === true || data.success === true) && data.data) {
        const rawStatus = (data.data.status || "PENDING").toUpperCase();
        let normalizedStatus: "PENDING" | "PAID" | "SUCCESS" | "FAILED" | "EXPIRED" = "PENDING";
        if (rawStatus === "PAID" || rawStatus === "SUCCESS") normalizedStatus = "SUCCESS";
        else if (rawStatus === "EXPIRED") normalizedStatus = "EXPIRED";
        else if (rawStatus === "FAILED") normalizedStatus = "FAILED";

        return {
          success: true,
          data: {
            orderId: data.data.order_id,
            status: normalizedStatus,
            amount: Number(data.data.amount || 0),
            totalAmount: Number(data.data.total_amount || 0),
            paidAt: data.data.paid_at,
            signature: data.data.signature,
          },
          message: data.message,
        };
      }

      return this.mockCheckStatus(orderId);
    } catch (error) {
      console.error("KlikQRIS checkStatus error:", error);
      return this.mockCheckStatus(orderId);
    }
  }

  private mockCreatePayment(payload: CreateQRISPayload): QRISResponse {
    const expiredAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    return {
      success: true,
      data: {
        orderId: payload.orderId,
        transactionId: payload.orderId,
        qrisUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MOCK-QRIS-${payload.orderId}-${payload.amount}`,
        amount: payload.amount,
        totalAmount: payload.amount,
        expiredAt,
        signature: `MOCK_SIG_${payload.orderId}`,
      },
    };
  }

  private mockCheckStatus(orderId: string): PaymentStatusResponse {
    return {
      success: true,
      data: {
        orderId,
        status: "PENDING",
        amount: 0,
        totalAmount: 0,
      },
    };
  }
}

export const klikqris = new KlikQRISClient();
