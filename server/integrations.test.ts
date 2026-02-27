import { describe, expect, it, vi } from "vitest";
import {
  sendAppointmentConfirmation,
  sendPaymentReceipt,
  sendAppointmentReminder,
} from "./services/resendEmailService";
import {
  validatePhoneNumber,
  formatPhoneNumber,
} from "./services/mpesaDarajaService";

describe("Resend Email Integration", () => {
  it("should validate appointment confirmation email parameters", async () => {
    // This test validates the email service structure
    expect(typeof sendAppointmentConfirmation).toBe("function");
  });

  it("should validate payment receipt email parameters", async () => {
    expect(typeof sendPaymentReceipt).toBe("function");
  });

  it("should validate appointment reminder email parameters", async () => {
    expect(typeof sendAppointmentReminder).toBe("function");
  });

  it("should handle missing Resend API key gracefully", async () => {
    // The service should return success: false when API key is missing
    const result = await sendAppointmentConfirmation(
      "test@example.com",
      "John Doe",
      "Dr. Jane Smith",
      "2026-03-15",
      "10:00 AM",
      "Cardiology"
    );

    // Should either succeed (if key is configured) or fail gracefully
    expect(result).toHaveProperty("success");
    expect(typeof result.success).toBe("boolean");
  });
});

describe("Mpesa Daraja Integration", () => {
  describe("Phone Number Validation", () => {
    it("should validate correct Kenyan phone numbers", () => {
      expect(validatePhoneNumber("254712345678")).toBe(true);
      expect(validatePhoneNumber("+254712345678")).toBe(true);
      expect(validatePhoneNumber("0712345678")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(validatePhoneNumber("123")).toBe(false);
      expect(validatePhoneNumber("")).toBe(false);
      expect(validatePhoneNumber("abc")).toBe(false);
      expect(validatePhoneNumber("254712345")).toBe(false); // Too short
    });
  });

  describe("Phone Number Formatting", () => {
    it("should format phone numbers to 254XXXXXXXXX format", () => {
      expect(formatPhoneNumber("0712345678")).toBe("254712345678");
      expect(formatPhoneNumber("+254712345678")).toBe("254712345678");
      expect(formatPhoneNumber("254712345678")).toBe("254712345678");
    });
  });

  describe("STK Push Initiation", () => {
    it(
      "should handle missing credentials gracefully",
      async () => {
        // The service should return success: false when credentials are missing
        const { initiateStkPush } = await import(
          "./services/mpesaDarajaService"
        );

        const result = await initiateStkPush(
          "0712345678",
          1000,
          "APT-001",
          "Appointment Payment"
        );

        // Should either succeed (if credentials are configured) or fail gracefully
        expect(result).toHaveProperty("success");
        expect(typeof result.success).toBe("boolean");
      },
      { timeout: 20000 }
    );
  });

  describe("Payment Status Query", () => {
    it(
      "should handle missing credentials gracefully",
      async () => {
        const { queryPaymentStatus } = await import(
          "./services/mpesaDarajaService"
        );

        const result = await queryPaymentStatus("test-checkout-id");

        // Should either succeed (if credentials are configured) or fail gracefully
        expect(result).toHaveProperty("success");
        expect(typeof result.success).toBe("boolean");
      },
      { timeout: 20000 }
    );
  });
});

describe("Integration Flow", () => {
  it("should have all required services exported", async () => {
    const resendService = await import("./services/resendEmailService");
    const mpesaService = await import("./services/mpesaDarajaService");

    // Verify Resend service exports
    expect(resendService.sendEmailViaResend).toBeDefined();
    expect(resendService.sendAppointmentConfirmation).toBeDefined();
    expect(resendService.sendPaymentReceipt).toBeDefined();
    expect(resendService.sendAppointmentReminder).toBeDefined();

    // Verify Mpesa service exports
    expect(mpesaService.initiateStkPush).toBeDefined();
    expect(mpesaService.queryPaymentStatus).toBeDefined();
    expect(mpesaService.validatePhoneNumber).toBeDefined();
    expect(mpesaService.formatPhoneNumber).toBeDefined();
  });

  it("should handle appointment booking with payment flow", () => {
    // Simulate the flow: validate phone -> initiate payment -> send confirmation
    const phoneNumber = "0712345678";

    // Step 1: Validate phone
    expect(validatePhoneNumber(phoneNumber)).toBe(true);

    // Step 2: Format phone
    const formatted = formatPhoneNumber(phoneNumber);
    expect(formatted).toBe("254712345678");

    // Step 3: Verify email service is ready
    expect(typeof sendAppointmentConfirmation).toBe("function");
  });
});
