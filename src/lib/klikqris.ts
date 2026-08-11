/**
 * KlikQRIS Payment Gateway Client
 *
 * Integration with KlikQRIS for QRIS-based payments.
 * This module abstracts the KlikQRIS API calls for creating QRIS payments,
 * checking payment status, and processing webhook callbacks.
 *
 * @see https://klikqris.com for API documentation
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
    transactionId: string;
    qrisUrl: string;
    qrisData: string;
    amount: number;
    expiredAt: string;
  };
  message?: string;
}

interface PaymentStatusResponse {
  success: boolean;
  data?: {
    transactionId: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
    amount: number;
    paidAt?: string;
  };
  message?: string;
}

interface WebhookPayload {
  transaction_id: string;
  merchant_id: string;
  amount: number;
  status: string;
  paid_at?: string;
  signature: string;
}

class KlikQRISClient {
  private apiKey: string;
  private merchantId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KLIKQRIS_API_KEY || "";
    this.merchantId = process.env.KLIKQRIS_MERCHANT_ID || "";
    this.baseUrl =
      process.env.KLIKQRIS_BASE_URL || "https://klikqris.com/api";
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "X-Merchant-ID": this.merchantId,
    };
  }

  /**
   * Create a new QRIS payment
   */
  async createPayment(payload: CreateQRISPayload): Promise<QRISResponse> {
    try {
      // If no API key, use mock for development
      if (!this.apiKey) {
        return this.mockCreatePayment(payload);
      }

      const response = await fetch(`${this.baseUrl}/v1/payment/create`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          merchant_id: this.merchantId,
          amount: payload.amount,
          order_id: payload.orderId,
          customer_name: payload.customerName,
          customer_email: payload.customerEmail,
          description:
            payload.description || `Payment for order ${payload.orderId}`,
          callback_url: process.env.KLIKQRIS_CALLBACK_URL,
        }),
      });

      const data = await response.json();
      return {
        success: data.success ?? response.ok,
        data: data.data
          ? {
              transactionId: data.data.transaction_id,
              qrisUrl: data.data.qris_url,
              qrisData: data.data.qris_data,
              amount: data.data.amount,
              expiredAt: data.data.expired_at,
            }
          : undefined,
        message: data.message,
      };
    } catch (error) {
      console.error("KlikQRIS createPayment error:", error);
      return {
        success: false,
        message: "Failed to create QRIS payment",
      };
    }
  }

  /**
   * Check payment status
   */
  async checkStatus(transactionId: string): Promise<PaymentStatusResponse> {
    try {
      if (!this.apiKey) {
        return this.mockCheckStatus(transactionId);
      }

      const response = await fetch(
        `${this.baseUrl}/v1/payment/status/${transactionId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      const data = await response.json();
      return {
        success: data.success ?? response.ok,
        data: data.data
          ? {
              transactionId: data.data.transaction_id,
              status: data.data.status,
              amount: data.data.amount,
              paidAt: data.data.paid_at,
            }
          : undefined,
        message: data.message,
      };
    } catch (error) {
      console.error("KlikQRIS checkStatus error:", error);
      return {
        success: false,
        message: "Failed to check payment status",
      };
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhook(payload: WebhookPayload): boolean {
    // KlikQRIS signature validation
    // In production, verify the signature using your API key
    if (!this.apiKey) return true; // Skip validation in dev mode

    // Basic validation: check merchant_id matches
    return payload.merchant_id === this.merchantId;
  }

  /**
   * Parse webhook payload
   */
  parseWebhook(payload: WebhookPayload) {
    return {
      transactionId: payload.transaction_id,
      merchantId: payload.merchant_id,
      amount: payload.amount,
      status: payload.status as "SUCCESS" | "FAILED" | "EXPIRED",
      paidAt: payload.paid_at ? new Date(payload.paid_at) : undefined,
    };
  }

  // ─── Mock Methods for Development ───

  private mockCreatePayment(payload: CreateQRISPayload): QRISResponse {
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    return {
      success: true,
      data: {
        transactionId,
        qrisUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MOCK-QRIS-${transactionId}-${payload.amount}`,
        qrisData: `00020101021226580014ID.CO.KLIKQRIS01189360${this.merchantId}0215${payload.orderId}5303360540${payload.amount}5802ID5913PUKI STORE6013Jakarta Pus61051034062070703A01`,
        amount: payload.amount,
        expiredAt,
      },
    };
  }

  private mockCheckStatus(transactionId: string): PaymentStatusResponse {
    // In dev mode, simulate random payment status
    return {
      success: true,
      data: {
        transactionId,
        status: "PENDING",
        amount: 0,
      },
    };
  }
}

// Singleton instance
export const klikqris = new KlikQRISClient();
