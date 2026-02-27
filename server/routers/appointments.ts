/*
 * Appointments Router — tRPC procedures for booking, payment, and management
 * Integrates Resend emails and Mpesa Daraja payments
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createAppointment,
  getAppointmentById,
  getUserAppointments,
  updateAppointment,
} from "../db";
import {
  sendAppointmentConfirmation,
  sendPaymentReceipt,
} from "../services/resendEmailService";
import {
  initiateStkPush,
  formatPhoneNumber,
  validatePhoneNumber,
} from "../services/mpesaDarajaService";
import { TRPCError } from "@trpc/server";

export const appointmentsRouter = router({
  /**
   * Book an appointment without payment
   */
  book: protectedProcedure
    .input(
      z.object({
        doctorId: z.number(),
        doctorName: z.string().min(1),
        department: z.string().min(1),
        appointmentDate: z.string().min(1),
        appointmentTime: z.string().min(1),
        patientFirstName: z.string().min(1),
        patientLastName: z.string().min(1),
        patientEmail: z.string().email(),
        patientPhone: z.string().min(1),
        reasonForVisit: z.string().optional(),
        insuranceProvider: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create appointment
        const appointment = await createAppointment({
          userId: ctx.user.id,
          doctorName: input.doctorName,
          department: input.department,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          patientFirstName: input.patientFirstName,
          patientLastName: input.patientLastName,
          patientEmail: input.patientEmail,
          patientPhone: input.patientPhone,
          reasonForVisit: input.reasonForVisit,
          insuranceProvider: input.insuranceProvider,
          status: "confirmed",
          paymentStatus: "paid",
          paymentMethod: "none",
        });

        if (!appointment) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create appointment",
          });
        }

        // Send confirmation email
        await sendAppointmentConfirmation(
          input.patientEmail,
          `${input.patientFirstName} ${input.patientLastName}`,
          input.doctorName,
          input.appointmentDate,
          input.appointmentTime,
          input.department
        );

        return {
          success: true,
          appointmentId: appointment.id,
          appointment,
        };
      } catch (error) {
        console.error("[Appointments] Book error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to book appointment",
        });
      }
    }),

  /**
   * Book appointment with M-Pesa payment
   */
  bookWithMpesa: protectedProcedure
    .input(
      z.object({
        doctorId: z.number(),
        doctorName: z.string().min(1),
        department: z.string().min(1),
        appointmentDate: z.string().min(1),
        appointmentTime: z.string().min(1),
        patientFirstName: z.string().min(1),
        patientLastName: z.string().min(1),
        patientEmail: z.string().email(),
        patientPhone: z.string().min(1),
        reasonForVisit: z.string().optional(),
        insuranceProvider: z.string().optional(),
        consultationFee: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate phone number
        if (!validatePhoneNumber(input.patientPhone)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid phone number format. Use format: 0712345678, +254712345678, or 254712345678",
          });
        }

        // Format phone number to 254XXXXXXXXX
        const formattedPhone = formatPhoneNumber(input.patientPhone);

        // Create appointment with pending payment
        const appointment = await createAppointment({
          userId: ctx.user.id,
          doctorName: input.doctorName,
          department: input.department,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          patientFirstName: input.patientFirstName,
          patientLastName: input.patientLastName,
          patientEmail: input.patientEmail,
          patientPhone: input.patientPhone,
          reasonForVisit: input.reasonForVisit,
          insuranceProvider: input.insuranceProvider,
          consultationFee: input.consultationFee.toString(),
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: "mpesa",
          mpesaCheckoutRequestId: "",
        });

        if (!appointment) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create appointment",
          });
        }

        // Initiate M-Pesa STK Push
        const stkResult = await initiateStkPush(
          formattedPhone,
          input.consultationFee,
          `APT-${appointment.id}`,
          `Appointment with ${input.doctorName} - ${input.department}`
        );

        if (!stkResult.success) {
          // Delete appointment if STK push fails
          await updateAppointment(appointment.id, { status: "cancelled" });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: stkResult.error || "Failed to initiate M-Pesa payment",
          });
        }

        // Update appointment with checkout request ID
        await updateAppointment(appointment.id, {
          mpesaCheckoutRequestId: stkResult.checkoutRequestId,
        });

        return {
          success: true,
          appointmentId: appointment.id,
          checkoutRequestId: stkResult.checkoutRequestId,
          message: "M-Pesa prompt sent to your phone. Enter your PIN to complete payment.",
          appointment,
        };
      } catch (error) {
        console.error("[Appointments] Book with M-Pesa error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error instanceof Error ? error.message : "Failed to book appointment with M-Pesa",
            });
      }
    }),

  /**
   * Confirm M-Pesa payment and activate appointment
   */
  confirmMpesaPayment: protectedProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        checkoutRequestId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const appointment = await getAppointmentById(input.appointmentId);
        if (!appointment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Appointment not found",
          });
        }

        if (appointment.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unauthorized",
          });
        }

        // Update appointment status to confirmed
        const updated = await updateAppointment(input.appointmentId, {
          status: "confirmed",
          paymentStatus: "paid",
        });

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to confirm appointment",
          });
        }

        // Send payment receipt email
        await sendPaymentReceipt(
          appointment.patientEmail,
          `${appointment.patientFirstName} ${appointment.patientLastName}`,
          parseFloat(appointment.consultationFee || "0"),
          "M-Pesa",
          input.checkoutRequestId,
          appointment.appointmentDate
        );

        return {
          success: true,
          message: "Payment confirmed. Your appointment is now active.",
          appointment,
        };
      } catch (error) {
        console.error("[Appointments] Confirm M-Pesa payment error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to confirm payment",
            });
      }
    }),

  /**
   * Get user's appointments
   */
  getUserAppointments: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getUserAppointments(ctx.user.id);
    } catch (error) {
      console.error("[Appointments] Get user appointments error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch appointments",
      });
    }
  }),

  /**
   * Get appointment details
   */
  getById: publicProcedure
    .input(z.object({ appointmentId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await getAppointmentById(input.appointmentId);
      } catch (error) {
        console.error("[Appointments] Get by ID error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch appointment",
        });
      }
    }),

  /**
   * Cancel appointment
   */
  cancel: protectedProcedure
    .input(z.object({ appointmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const appointment = await getAppointmentById(input.appointmentId);
        if (!appointment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Appointment not found",
          });
        }

        if (appointment.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unauthorized",
          });
        }

        const success = await updateAppointment(input.appointmentId, {
          status: "cancelled",
        });

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to cancel appointment",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("[Appointments] Cancel error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to cancel appointment",
            });
      }
    }),

  /**
   * Reschedule appointment
   */
  reschedule: protectedProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        newDate: z.string().min(1),
        newTime: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const appointment = await getAppointmentById(input.appointmentId);
        if (!appointment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Appointment not found",
          });
        }

        if (appointment.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Unauthorized",
          });
        }

        const success = await updateAppointment(input.appointmentId, {
          appointmentDate: input.newDate,
          appointmentTime: input.newTime,
        });

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to reschedule appointment",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("[Appointments] Reschedule error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to reschedule appointment",
            });
      }
    }),
});
