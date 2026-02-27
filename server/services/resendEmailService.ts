import { ENV } from "../_core/env";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface ResendResponse {
  id: string;
  from: string;
  to: string;
  created_at: string;
}

/**
 * Send email using Resend.com API
 * Resend provides reliable transactional email delivery
 */
export async function sendEmailViaResend(
  payload: EmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!ENV.resendApiKey) {
      console.warn("[Resend] API key not configured");
      return { success: false, error: "Resend API key not configured" };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.resendApiKey}`,
      },
      body: JSON.stringify({
        from: payload.from || "noreply@apexcare.com",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Resend] Failed to send email:", error);
      return { success: false, error: `Resend API error: ${response.status}` };
    }

    const data = (await response.json()) as ResendResponse;
    console.log(`[Resend] Email sent successfully: ${data.id}`);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("[Resend] Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmation(
  patientEmail: string,
  patientName: string,
  doctorName: string,
  appointmentDate: string,
  appointmentTime: string,
  departmentName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D9488 0%, #06B6D4 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Appointment Confirmed</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">ApexCare Medical Centre</p>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${patientName}</strong>,</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #666;">Your appointment has been successfully confirmed. Here are the details:</p>
        
        <div style="background: white; border-left: 4px solid #0D9488; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 8px 0;"><strong>Doctor:</strong> ${doctorName}</p>
          <p style="margin: 8px 0;"><strong>Department:</strong> ${departmentName}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${appointmentDate}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointmentTime}</p>
        </div>

        <p style="margin: 20px 0 10px 0; font-size: 14px; color: #666;">
          <strong>Important:</strong> Please arrive 10 minutes before your appointment time. Bring your ID and any relevant medical documents.
        </p>

        <p style="margin: 20px 0 10px 0; font-size: 14px; color: #666;">
          If you need to reschedule or cancel, please contact us at least 24 hours in advance.
        </p>

        <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
            ApexCare Medical Centre | +1 (800) APEX-911 | apexcare.com
          </p>
          <p style="margin: 0; font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmailViaResend({
    to: patientEmail,
    subject: `Appointment Confirmed - ${appointmentDate} at ${appointmentTime}`,
    html,
  });
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceipt(
  patientEmail: string,
  patientName: string,
  amount: number,
  paymentMethod: string,
  transactionId: string,
  appointmentDate: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D9488 0%, #06B6D4 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Payment Receipt</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">ApexCare Medical Centre</p>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${patientName}</strong>,</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #666;">Thank you for your payment. Here is your receipt:</p>
        
        <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; margin: 10px 0; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #666;">Amount Paid:</span>
            <strong style="font-size: 18px; color: #0D9488;">KES ${amount.toFixed(2)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span style="color: #666;">Payment Method:</span>
            <strong>${paymentMethod}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span style="color: #666;">Transaction ID:</span>
            <strong style="font-family: monospace;">${transactionId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span style="color: #666;">Appointment Date:</span>
            <strong>${appointmentDate}</strong>
          </div>
        </div>

        <p style="margin: 20px 0; font-size: 14px; color: #666;">
          Your payment has been successfully processed. You will receive a confirmation email with appointment details shortly.
        </p>

        <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
            ApexCare Medical Centre | +1 (800) APEX-911 | apexcare.com
          </p>
          <p style="margin: 0; font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmailViaResend({
    to: patientEmail,
    subject: `Payment Receipt - Transaction ${transactionId}`,
    html,
  });
}

/**
 * Send appointment reminder email
 */
export async function sendAppointmentReminder(
  patientEmail: string,
  patientName: string,
  doctorName: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D9488 0%, #06B6D4 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Appointment Reminder</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">ApexCare Medical Centre</p>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${patientName}</strong>,</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #666;">This is a friendly reminder about your upcoming appointment:</p>
        
        <div style="background: white; border-left: 4px solid #0D9488; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 8px 0;"><strong>Doctor:</strong> ${doctorName}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${appointmentDate}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointmentTime}</p>
        </div>

        <p style="margin: 20px 0; font-size: 14px; color: #666;">
          Please arrive 10 minutes early and bring your ID and any relevant medical documents.
        </p>

        <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
            ApexCare Medical Centre | +1 (800) APEX-911 | apexcare.com
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmailViaResend({
    to: patientEmail,
    subject: `Reminder: Your appointment with ${doctorName} on ${appointmentDate}`,
    html,
  });
}


/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcomeEmail(
  email: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D9488 0%, #06B6D4 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to ApexCare Health Tips!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your wellness journey starts here</p>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hello,</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #666;">Thank you for subscribing to ApexCare's Health Tips newsletter! We're excited to share expert medical insights, wellness advice, and health updates with you.</p>
        
        <div style="background: white; border-left: 4px solid #0D9488; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 15px 0; color: #0D9488;">What You'll Receive:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li style="margin: 8px 0;">Weekly health tips from our expert doctors</li>
            <li style="margin: 8px 0;">Medical insights on common health conditions</li>
            <li style="margin: 8px 0;">Wellness advice and preventive care tips</li>
            <li style="margin: 8px 0;">Updates on new services and special offers</li>
            <li style="margin: 8px 0;">Exclusive health resources and guides</li>
          </ul>
        </div>

        <p style="margin: 20px 0; font-size: 14px; color: #666;">
          We're committed to helping you live a healthier, happier life. Our newsletters are carefully curated to provide valuable, actionable health information.
        </p>

        <p style="margin: 20px 0; font-size: 14px; color: #666;">
          <strong>Didn't subscribe?</strong> If you received this email by mistake, you can unsubscribe at any time by clicking the link at the bottom of our emails.
        </p>

        <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
            ApexCare Medical Centre | +1 (800) APEX-911 | apexcare.com
          </p>
          <p style="margin: 0; font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmailViaResend({
    to: email,
    subject: "Welcome to ApexCare Health Tips Newsletter",
    html,
  });
}

/**
 * Send health tips email to newsletter subscribers
 */
export async function sendHealthTipsEmail(
  email: string,
  subject: string,
  content: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D9488 0%, #06B6D4 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Health Tip</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">ApexCare Medical Centre</p>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="margin: 0 0 20px 0; color: #0D9488; font-size: 20px;">${subject}</h2>
        <div style="margin: 20px 0; font-size: 14px; color: #333; line-height: 1.6;">
          ${content}
        </div>

        <p style="margin: 20px 0; font-size: 14px; color: #666;">
          <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for personalized medical guidance.
        </p>

        <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
            ApexCare Medical Centre | +1 (800) APEX-911 | apexcare.com
          </p>
          <p style="margin: 0; font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmailViaResend({
    to: email,
    subject: `Health Tip: ${subject}`,
    html,
  });
}
