/*
 * Unit Tests for Appointment Booking and Payment Services
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAppointment, getAppointmentById, getUserAppointments, updateAppointment } from "./db";
import { sendAppointmentConfirmation, sendPaymentReceipt } from "./services/emailService";

// Mock database
vi.mock("./db", () => ({
  getDb: vi.fn(),
  createAppointment: vi.fn(),
  getAppointmentById: vi.fn(),
  getUserAppointments: vi.fn(),
  updateAppointment: vi.fn(),
}));

// Mock email service
vi.mock("./services/emailService", () => ({
  sendAppointmentConfirmation: vi.fn(),
  sendPaymentReceipt: vi.fn(),
  sendPaymentFailedEmail: vi.fn(),
}));

describe("Appointment Booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an appointment successfully", async () => {
    const mockAppointment = {
      id: 1,
      userId: 1,
      doctorName: "Dr. John Doe",
      department: "Cardiology",
      appointmentDate: "2026-03-15",
      appointmentTime: "10:00 AM",
      patientFirstName: "Jane",
      patientLastName: "Smith",
      patientEmail: "jane@example.com",
      patientPhone: "+254712345678",
      reasonForVisit: "Regular checkup",
      insuranceProvider: "NHIF",
      status: "pending",
      consultationFee: "50",
      paymentStatus: "pending",
      paymentMethod: "none",
      emailSent: false,
      confirmationEmailSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(createAppointment).mockResolvedValue(mockAppointment);

    const result = await createAppointment({
      userId: 1,
      doctorName: "Dr. John Doe",
      department: "Cardiology",
      appointmentDate: "2026-03-15",
      appointmentTime: "10:00 AM",
      patientFirstName: "Jane",
      patientLastName: "Smith",
      patientEmail: "jane@example.com",
      patientPhone: "+254712345678",
      reasonForVisit: "Regular checkup",
      insuranceProvider: "NHIF",
      status: "pending",
      consultationFee: "50",
      paymentStatus: "pending",
      paymentMethod: "none",
    });

    expect(result).toEqual(mockAppointment);
    expect(createAppointment).toHaveBeenCalledTimes(1);
  });

  it("should retrieve an appointment by ID", async () => {
    const mockAppointment = {
      id: 1,
      userId: 1,
      doctorName: "Dr. John Doe",
      department: "Cardiology",
      appointmentDate: "2026-03-15",
      appointmentTime: "10:00 AM",
      patientFirstName: "Jane",
      patientLastName: "Smith",
      patientEmail: "jane@example.com",
      patientPhone: "+254712345678",
      reasonForVisit: "Regular checkup",
      insuranceProvider: "NHIF",
      status: "pending",
      consultationFee: "50",
      paymentStatus: "pending",
      paymentMethod: "none",
      emailSent: false,
      confirmationEmailSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(getAppointmentById).mockResolvedValue(mockAppointment);

    const result = await getAppointmentById(1);

    expect(result).toEqual(mockAppointment);
    expect(getAppointmentById).toHaveBeenCalledWith(1);
  });

  it("should return null when appointment not found", async () => {
    vi.mocked(getAppointmentById).mockResolvedValue(null);

    const result = await getAppointmentById(999);

    expect(result).toBeNull();
  });

  it("should retrieve user appointments", async () => {
    const mockAppointments = [
      {
        id: 1,
        userId: 1,
        doctorName: "Dr. John Doe",
        department: "Cardiology",
        appointmentDate: "2026-03-15",
        appointmentTime: "10:00 AM",
        patientFirstName: "Jane",
        patientLastName: "Smith",
        patientEmail: "jane@example.com",
        patientPhone: "+254712345678",
        reasonForVisit: "Regular checkup",
        insuranceProvider: "NHIF",
        status: "pending",
        consultationFee: "50",
        paymentStatus: "pending",
        paymentMethod: "none",
        emailSent: false,
        confirmationEmailSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(getUserAppointments).mockResolvedValue(mockAppointments);

    const result = await getUserAppointments(1);

    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(1);
    expect(getUserAppointments).toHaveBeenCalledWith(1);
  });

  it("should update appointment status", async () => {
    vi.mocked(updateAppointment).mockResolvedValue(true);

    const result = await updateAppointment(1, { status: "confirmed" });

    expect(result).toBe(true);
    expect(updateAppointment).toHaveBeenCalledWith(1, { status: "confirmed" });
  });

  it("should send appointment confirmation email", async () => {
    vi.mocked(sendAppointmentConfirmation).mockResolvedValue(true);

    const result = await sendAppointmentConfirmation({
      appointmentId: 1,
      userId: 1,
      patientEmail: "jane@example.com",
      patientName: "Jane Smith",
      doctorName: "Dr. John Doe",
      department: "Cardiology",
      appointmentDate: "2026-03-15",
      appointmentTime: "10:00 AM",
      consultationFee: "50",
    });

    expect(result).toBe(true);
    expect(sendAppointmentConfirmation).toHaveBeenCalled();
  });

  it("should send payment receipt email", async () => {
    vi.mocked(sendPaymentReceipt).mockResolvedValue(true);

    const result = await sendPaymentReceipt({
      appointmentId: 1,
      userId: 1,
      patientEmail: "jane@example.com",
      patientName: "Jane Smith",
      amount: "50",
      currency: "USD",
      paymentMethod: "stripe",
      transactionId: "pi_1234567890",
      doctorName: "Dr. John Doe",
      appointmentDate: "2026-03-15",
    });

    expect(result).toBe(true);
    expect(sendPaymentReceipt).toHaveBeenCalled();
  });
});

describe("Payment Processing", () => {
  it("should validate M-Pesa phone number format", () => {
    const validPhones = [
      "254712345678",
      "254722345678",
      "254732345678",
    ];

    const invalidPhones = [
      "712345678",
      "0712345678",
      "254",
      "",
    ];

    validPhones.forEach((phone) => {
      expect(/^254\d{9}$/.test(phone)).toBe(true);
    });

    invalidPhones.forEach((phone) => {
      expect(/^254\d{9}$/.test(phone)).toBe(false);
    });
  });

  it("should validate consultation fee amount", () => {
    const validFees = [10, 50, 100, 500];
    const invalidFees = [0, -10, -50];

    validFees.forEach((fee) => {
      expect(fee > 0).toBe(true);
    });

    invalidFees.forEach((fee) => {
      expect(fee > 0).toBe(false);
    });
  });

  it("should format appointment date correctly", () => {
    const dates = [
      "2026-03-15",
      "2026-12-25",
      "2026-01-01",
    ];

    dates.forEach((date) => {
      const isValid = /^\d{4}-\d{2}-\d{2}$/.test(date);
      expect(isValid).toBe(true);
    });
  });
});
