/*
 * Email Service — Sends appointment confirmations, reminders, and payment receipts
 * Uses Manus built-in notification API
 */

import { notifyOwner } from "../_core/notification";
import { getDb } from "../db";
import { emailLogs, InsertEmailLog } from "../../drizzle/schema";

export interface EmailPayload {
  to: string;
  subject: string;
  htmlContent: string;
  emailType: "appointment_confirmation" | "appointment_reminder" | "payment_receipt" | "payment_failed" | "appointment_cancelled";
  appointmentId?: number;
  userId?: number;
}

/**
 * Send email and log it in the database
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Email] Database not available");
      return false;
    }

    // Log the email attempt
    const logEntry: InsertEmailLog = {
      recipientEmail: payload.to,
      emailType: payload.emailType,
      subject: payload.subject,
      status: "sent",
      appointmentId: payload.appointmentId,
      userId: payload.userId,
    };

    await db.insert(emailLogs).values(logEntry);

    // Send via Manus notification API (owner receives it for now)
    // In production, integrate with SendGrid, Mailgun, or AWS SES
    await notifyOwner({
      title: `📧 Email Sent: ${payload.emailType}`,
      content: `To: ${payload.to}\nSubject: ${payload.subject}\n\n${payload.htmlContent.substring(0, 200)}...`,
    });

    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmation(data: {
  appointmentId: number;
  userId: number;
  patientEmail: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationFee?: string;
}): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0D9488; margin: 0;">Appointment Confirmed</h1>
          <p style="color: #666; margin: 10px 0 0 0;">ApexCare Medical Centre</p>
        </div>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Dear ${data.patientName},
        </p>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Your appointment has been successfully booked. Here are the details:
        </p>

        <div style="background: #f0f9f8; border-left: 4px solid #0D9488; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 8px 0; color: #333;"><strong>Doctor:</strong> ${data.doctorName}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Department:</strong> ${data.department}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Date:</strong> ${data.appointmentDate}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Time:</strong> ${data.appointmentTime}</p>
          ${data.consultationFee ? `<p style="margin: 8px 0; color: #333;"><strong>Consultation Fee:</strong> ${data.consultationFee}</p>` : ""}
        </div>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Please arrive 15 minutes early. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://apexcare.manus.space/patient-portal" style="background: #0D9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Appointment
          </a>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <strong>ApexCare Medical Centre</strong><br>
          123 Healthcare Avenue, Medical District<br>
          Phone: +254 (020) 123-4567<br>
          Emergency: +1 (800) APEX-911
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.patientEmail,
    subject: `Appointment Confirmed - ${data.doctorName} on ${data.appointmentDate}`,
    htmlContent,
    emailType: "appointment_confirmation",
    appointmentId: data.appointmentId,
    userId: data.userId,
  });
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceipt(data: {
  appointmentId: number;
  userId: number;
  patientEmail: string;
  patientName: string;
  amount: string;
  currency: string;
  paymentMethod: "stripe" | "mpesa";
  transactionId: string;
  doctorName: string;
  appointmentDate: string;
}): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0D9488; margin: 0;">✓ Payment Received</h1>
          <p style="color: #666; margin: 10px 0 0 0;">ApexCare Medical Centre</p>
        </div>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Dear ${data.patientName},
        </p>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Thank you for your payment. Your consultation fee has been received.
        </p>

        <div style="background: #f0f9f8; border-left: 4px solid #0D9488; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 8px 0; color: #333;"><strong>Amount:</strong> ${data.currency} ${data.amount}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Payment Method:</strong> ${data.paymentMethod === "stripe" ? "Credit/Debit Card (Stripe)" : "M-Pesa"}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Doctor:</strong> ${data.doctorName}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Appointment:</strong> ${data.appointmentDate}</p>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <strong>ApexCare Medical Centre</strong><br>
          123 Healthcare Avenue, Medical District<br>
          Phone: +254 (020) 123-4567
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.patientEmail,
    subject: `Payment Receipt - Consultation with ${data.doctorName}`,
    htmlContent,
    emailType: "payment_receipt",
    appointmentId: data.appointmentId,
    userId: data.userId,
  });
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(data: {
  appointmentId: number;
  userId: number;
  patientEmail: string;
  patientName: string;
  amount: string;
  currency: string;
  reason: string;
}): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Payment Failed</h1>
          <p style="color: #666; margin: 10px 0 0 0;">ApexCare Medical Centre</p>
        </div>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Dear ${data.patientName},
        </p>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Unfortunately, your payment could not be processed. Please try again or contact us for assistance.
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 8px 0; color: #333;"><strong>Amount:</strong> ${data.currency} ${data.amount}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Reason:</strong> ${data.reason}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://apexcare.manus.space/book-appointment" style="background: #0D9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Retry Payment
          </a>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Need help? Contact us at +254 (020) 123-4567 or email support@apexcaremedical.com
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.patientEmail,
    subject: `Payment Failed - Consultation Appointment`,
    htmlContent,
    emailType: "payment_failed",
    appointmentId: data.appointmentId,
    userId: data.userId,
  });
}
