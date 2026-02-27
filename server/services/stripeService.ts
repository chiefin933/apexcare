/*
 * Stripe Payment Service — Handles payment intents and Stripe API integration
 * Requires STRIPE_SECRET_KEY environment variable
 */

import { getDb } from "../db";
import { appointments, stripePayments, InsertStripePayment } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendPaymentReceipt, sendPaymentFailedEmail } from "./emailService";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_API_URL = "https://api.stripe.com/v1";

/**
 * Create a Stripe Payment Intent
 */
export async function createStripePaymentIntent(data: {
  appointmentId: number;
  userId: number;
  amount: number; // in cents
  currency?: string;
  description: string;
}): Promise<{ clientSecret: string; paymentIntentId: string } | null> {
  if (!STRIPE_SECRET_KEY) {
    console.error("[Stripe] STRIPE_SECRET_KEY not configured");
    return null;
  }

  try {
    const response = await fetch(`${STRIPE_API_URL}/payment_intents`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: data.amount.toString(),
        currency: data.currency || "usd",
        description: data.description,
        "metadata[appointmentId]": data.appointmentId.toString(),
        "metadata[userId]": data.userId.toString(),
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Stripe] Failed to create payment intent:", error);
      return null;
    }

    const paymentIntent = await response.json();

    // Store in database
    const db = await getDb();
    if (db) {
      await db.insert(stripePayments).values({
        appointmentId: data.appointmentId,
        userId: data.userId,
        amount: (data.amount / 100).toString(), // Convert back to dollars
        currency: data.currency || "USD",
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
      } as InsertStripePayment);
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("[Stripe] Error creating payment intent:", error);
    return null;
  }
}

/**
 * Confirm Stripe payment and update appointment
 */
export async function confirmStripePayment(paymentIntentId: string): Promise<boolean> {
  if (!STRIPE_SECRET_KEY) {
    console.error("[Stripe] STRIPE_SECRET_KEY not configured");
    return false;
  }

  try {
    const db = await getDb();
    if (!db) return false;

    // Retrieve payment intent from Stripe
    const response = await fetch(`${STRIPE_API_URL}/payment_intents/${paymentIntentId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("[Stripe] Failed to retrieve payment intent");
      return false;
    }

    const paymentIntent = await response.json();

    if (paymentIntent.status !== "succeeded") {
      console.log("[Stripe] Payment not yet succeeded, status:", paymentIntent.status);
      return false;
    }

    // Update payment record
    await db
      .update(stripePayments)
      .set({
        status: "succeeded",
        paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
        receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url,
      })
      .where(eq(stripePayments.stripePaymentIntentId, paymentIntentId));

    // Get appointment details
    const appointmentId = paymentIntent.metadata?.appointmentId;
    if (appointmentId) {
      const appts = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, parseInt(appointmentId)));

      if (appts.length > 0) {
        const appt = appts[0];

        // Update appointment payment status
        await db
          .update(appointments)
          .set({
            paymentStatus: "paid",
            paymentMethod: "stripe",
            stripePaymentIntentId: paymentIntentId,
          })
          .where(eq(appointments.id, appt.id));

        // Send receipt email
        await sendPaymentReceipt({
          appointmentId: appt.id,
          userId: appt.userId,
          patientEmail: appt.patientEmail,
          patientName: `${appt.patientFirstName} ${appt.patientLastName}`,
          amount: appt.consultationFee || "0",
          currency: "USD",
          paymentMethod: "stripe",
          transactionId: paymentIntentId,
          doctorName: appt.doctorName,
          appointmentDate: appt.appointmentDate,
        });
      }
    }

    return true;
  } catch (error) {
    console.error("[Stripe] Error confirming payment:", error);
    return false;
  }
}

/**
 * Handle Stripe webhook for payment updates
 */
export async function handleStripeWebhook(event: any): Promise<void> {
  const db = await getDb();
  if (!db) return;

  switch (event.type) {
    case "payment_intent.succeeded":
      await confirmStripePayment(event.data.object.id);
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object;
      const appointmentId = failedPaymentIntent.metadata?.appointmentId;

      if (appointmentId) {
        const appts = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, parseInt(appointmentId)));

        if (appts.length > 0) {
          const appt = appts[0];

          // Update appointment
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
            currency: "USD",
            reason: failedPaymentIntent.last_payment_error?.message || "Payment declined",
          });
        }
      }
      break;
  }
}
