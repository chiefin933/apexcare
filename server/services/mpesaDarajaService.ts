import { ENV } from "../_core/env";

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface PaymentStatusResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth access token from Safaricom Mpesa Daraja API
 */
async function getAccessToken(): Promise<string> {
  try {
    // Check if cached token is still valid
    if (
      cachedAccessToken &&
      cachedAccessToken.expiresAt > Date.now() + 60000
    ) {
      return cachedAccessToken.token;
    }

    const auth = Buffer.from(
      `${ENV.mpesaConsumerKey}:${ENV.mpesaConsumerSecret}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.status}`);
    }

    const data = (await response.json()) as AccessTokenResponse;
    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error("[Mpesa Daraja] Failed to get access token:", error);
    throw error;
  }
}

/**
 * Initiate STK Push for M-Pesa payment
 * This prompts the user's phone to enter their M-Pesa PIN
 */
export async function initiateStkPush(
  phoneNumber: string,
  amount: number,
  accountReference: string,
  transactionDesc: string
): Promise<{
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  error?: string;
}> {
  try {
    if (!ENV.mpesaConsumerKey || !ENV.mpesaConsumerSecret) {
      return {
        success: false,
        error: "Mpesa Daraja credentials not configured",
      };
    }

    const accessToken = await getAccessToken();

    // Format phone number to 254XXXXXXXXX format
    const formattedPhone = phoneNumber.replace(/^0/, "254");

    // Get timestamp in YYYYMMDDHHmmss format
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    // Create password: base64(shortcode + passkey + timestamp)
    const password = Buffer.from(
      `${ENV.mpesaBusinessShortcode}${ENV.mpesaPasskey}${timestamp}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          BusinessShortCode: ENV.mpesaBusinessShortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.ceil(amount),
          PartyA: formattedPhone,
          PartyB: ENV.mpesaBusinessShortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: "https://apexcare.com/api/mpesa/callback",
          AccountReference: accountReference,
          TransactionDesc: transactionDesc,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[Mpesa Daraja] STK Push failed:", error);
      return { success: false, error: `STK Push failed: ${response.status}` };
    }

    const data = (await response.json()) as STKPushResponse;

    if (data.ResponseCode !== "0") {
      console.error(
        "[Mpesa Daraja] STK Push error:",
        data.ResponseDescription
      );
      return {
        success: false,
        error: data.ResponseDescription || "STK Push failed",
      };
    }

    console.log(
      `[Mpesa Daraja] STK Push initiated: ${data.CheckoutRequestID}`
    );
    return {
      success: true,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
    };
  } catch (error) {
    console.error("[Mpesa Daraja] Error initiating STK Push:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Query payment status using CheckoutRequestID
 */
export async function queryPaymentStatus(
  checkoutRequestId: string
): Promise<{
  success: boolean;
  resultCode?: string;
  resultDesc?: string;
  error?: string;
}> {
  try {
    if (!ENV.mpesaConsumerKey || !ENV.mpesaConsumerSecret) {
      return {
        success: false,
        error: "Mpesa Daraja credentials not configured",
      };
    }

    const accessToken = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${ENV.mpesaBusinessShortcode}${ENV.mpesaPasskey}${timestamp}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          BusinessShortCode: ENV.mpesaBusinessShortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[Mpesa Daraja] Query failed:", error);
      return { success: false, error: `Query failed: ${response.status}` };
    }

    const data = (await response.json()) as PaymentStatusResponse;

    // ResultCode 0 means successful payment
    const isSuccess = data.ResultCode === "0";

    console.log(
      `[Mpesa Daraja] Payment status: ${data.ResultDesc} (${data.ResultCode})`
    );
    return {
      success: isSuccess,
      resultCode: data.ResultCode,
      resultDesc: data.ResultDesc,
    };
  } catch (error) {
    console.error("[Mpesa Daraja] Error querying payment status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Validate M-Pesa phone number format
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Accept formats: 254XXXXXXXXX, +254XXXXXXXXX, 0XXXXXXXXX
  const phoneRegex = /^(?:254|\+254|0)([0-9]{9})$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Format phone number to 254XXXXXXXXX format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove leading + if present
  let cleaned = phoneNumber.replace(/^\+/, "");
  // If it already starts with 254, return as is
  if (cleaned.startsWith("254")) {
    return cleaned;
  }
  // Replace leading 0 with 254
  return cleaned.replace(/^0/, "254");
}
