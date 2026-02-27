/*
 * M-Pesa Payment Service — Handles M-Pesa STK Push and payment callbacks
 * Requires MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_BUSINESS_SHORT_CODE, MPESA_PASSKEY
 */

import { getDb } from "../db";
import { appointments, mpesaPayments, InsertMpesaPayment } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendPaymentReceipt, sendPaymentFailedEmail } from "./emailService";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE || "174379";
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "https://apexcare.manus.space/api/mpesa/callback";
const MPESA_TIMEOUT_URL = process.env.MPESA_TIMEOUT_URL || "https://apexcare.manus.space/api/mpesa/timeout";

// M-Pesa API endpoints
const MPESA_AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const MPESA_STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
const MPESA_QUERY_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * Get M-Pesa access token
 */
async function getMpesaAccessToken(): Promise<string | null> {
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    console.error("[M-Pesa] Missing consumer credentials");
    return null;
  }

  // Return cached token if still valid
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
    const response = await fetch(MPESA_AUTH_URL, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      console.error("[M-Pesa] Failed to get access token");
      return null;
    }

    const data = await response.json();
    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };

    return data.access_token;
  } catch (error) {
    console.error("[M-Pesa] Error getting access token:", error);
    return null;
  }
}

/**
 * Initiate M-Pesa STK Push
 */
export async function initiateMpesaSTKPush(data: {
  appointmentId: number;
  userId: number;
  phoneNumber: string; // Format: 254712345678
  amount: number;
  description: string;
}): Promise<{ checkoutRequestId: string; requestId: string } | null> {
  if (!MPESA_PASSKEY) {
    console.error("[M-Pesa] MPESA_PASSKEY not configured");
    return null;
  }

  try {
    const accessToken = await getMpesaAccessToken();
    if (!accessToken) return null;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${MPESA_BUSINESS_SHORT_CODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const response = await fetch(MPESA_STK_PUSH_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(data.amount),
        PartyA: data.phoneNumber,
        PartyB: MPESA_BUSINESS_SHORT_CODE,
        PhoneNumber: data.phoneNumber,
        CallBackURL: MPESA_CALLBACK_URL,
        AccountReference: `APX-${data.appointmentId}`,
        TransactionDesc: data.description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[M-Pesa] Failed to initiate STK Push:", error);
      return null;
    }

    const result = await response.json();

    // Store in database
    const db = await getDb();
    if (db) {
      await db.insert(mpesaPayments).values({
        appointmentId: data.appointmentId,
        userId: data.userId,
        amount: data.amount.toString(),
        currency: "KES",
        phoneNumber: data.phoneNumber,
        checkoutRequestId: result.CheckoutRequestID,
        requestId: result.RequestId,
        status: "pending",
      } as InsertMpesaPayment);
    }

    return {
      checkoutRequestId: result.CheckoutRequestID,
      requestId: result.RequestId,
    };
  } catch (error) {
    console.error("[M-Pesa] Error initiating STK Push:", error);
    return null;
  }
}

/**
 * Handle M-Pesa callback (payment confirmation)
 */
export async function handleMpesaCallback(callbackData: any): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const body = callbackData.Body?.stkCallback;
    if (!body) {
      console.error("[M-Pesa] Invalid callback structure");
      return;
    }

    const checkoutRequestId = body.CheckoutRequestID;
    const resultCode = body.ResultCode;
    const resultDesc = body.ResultDesc;

    // Find M-Pesa payment record
    const payments = await db
      .select()
      .from(mpesaPayments)
      .where(eq(mpesaPayments.checkoutRequestId, checkoutRequestId));

    if (payments.length === 0) {
      console.error("[M-Pesa] Payment record not found for:", checkoutRequestId);
      return;
    }

    const payment = payments[0];

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = body.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = callbackMetadata.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      )?.Value;
      const transactionDate = callbackMetadata.find(
        (item: any) => item.Name === "TransactionDate"
      )?.Value;

      // Update M-Pesa payment record
      await db
        .update(mpesaPayments)
        .set({
          status: "succeeded",
          resultCode: resultCode.toString(),
          resultDesc,
          mpesaReceiptNumber,
          transactionDate,
        })
        .where(eq(mpesaPayments.id, payment.id));

      // Update appointment
      const appts = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, payment.appointmentId));

      if (appts.length > 0) {
        const appt = appts[0];

        await db
          .update(appointments)
          .set({
            paymentStatus: "paid",
            paymentMethod: "mpesa",
            mpesaCheckoutRequestId: checkoutRequestId,
          })
          .where(eq(appointments.id, appt.id));

        // Send receipt email
        await sendPaymentReceipt({
          appointmentId: appt.id,
          userId: appt.userId,
          patientEmail: appt.patientEmail,
          patientName: `${appt.patientFirstName} ${appt.patientLastName}`,
          amount: appt.consultationFee || "0",
          currency: "KES",
          paymentMethod: "mpesa",
          transactionId: mpesaReceiptNumber || checkoutRequestId,
          doctorName: appt.doctorName,
          appointmentDate: appt.appointmentDate,
        });
      }
    } else {
      // Payment failed
      await db
        .update(mpesaPayments)
        .set({
          status: "failed",
          resultCode: resultCode.toString(),
          resultDesc,
        })
        .where(eq(mpesaPayments.id, payment.id));

      // Update appointment
      const appts = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, payment.appointmentId));

      if (appts.length > 0) {
        const appt = appts[0];

        await db
          .update(appointments)
          .set({ paymentStatus: "failed" })
          .where(eq(appointments.id, appt.id));

        // Send failure email
        await sendPaymentFailedEmail({
          appointmentId: appt.id,
          userId: appt.userId,
          patientEmail: appt.patientEmail,
          patientName: `${appt.patientFirstName} ${appt.patientLastName}`,
          amount: appt.consultationFee || "0",
          currency: "KES",
          reason: resultDesc || "Payment failed",
        });
      }
    }
  } catch (error) {
    console.error("[M-Pesa] Error handling callback:", error);
  }
}

/**
 * Query M-Pesa payment status
 */
export async function queryMpesaPaymentStatus(checkoutRequestId: string): Promise<any | null> {
  try {
    const accessToken = await getMpesaAccessToken();
    if (!accessToken) return null;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${MPESA_BUSINESS_SHORT_CODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const response = await fetch(MPESA_QUERY_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    if (!response.ok) {
      console.error("[M-Pesa] Failed to query payment status");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[M-Pesa] Error querying payment status:", error);
    return null;
  }
}
