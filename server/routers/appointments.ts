/*
 * Appointments Router — tRPC procedures for booking, payment, and management
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { createAppointment, getAppointmentById, getUserAppointments, updateAppointment } from "../db";
import { sendAppointmentConfirmation } from "../services/emailService";
import { createStripePaymentIntent } from "../services/stripeService";
import { initiateMpesaSTKPush } from "../services/mpesaService";
import { TRPCError } from "@trpc/server";

export const appointmentsRouter = router({
  /**
   * Book an appointment
   */
  book: protectedProcedure
    .input(
      z.object({
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
        consultationFee: z.string().optional().default("0"),
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
          consultationFee: input.consultationFee,
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: "none",
        });

        if (!appointment) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create appointment",
          });
        }

        // Send confirmation email
        await sendAppointmentConfirmation({
          appointmentId: appointment.id,
          userId: ctx.user.id,
          patientEmail: input.patientEmail,
          patientName: `${input.patientFirstName} ${input.patientLastName}`,
          doctorName: input.doctorName,
          department: input.department,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          consultationFee: input.consultationFee,
        });

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
   * Initiate Stripe payment for appointment
   */
  initiateStripePayment: protectedProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        amount: z.number().positive(),
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

        const paymentResult = await createStripePaymentIntent({
          appointmentId: input.appointmentId,
          userId: ctx.user.id,
          amount: Math.round(input.amount * 100), // Convert to cents
          currency: "usd",
          description: `Consultation with ${appointment.doctorName} - ${appointment.department}`,
        });

        if (!paymentResult) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create payment intent",
          });
        }

        return paymentResult;
      } catch (error) {
        console.error("[Appointments] Stripe payment error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to initiate payment",
            });
      }
    }),

  /**
   * Initiate M-Pesa payment for appointment
   */
  initiateMpesaPayment: protectedProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        phoneNumber: z.string().regex(/^254\d{9}$/), // Kenya format
        amount: z.number().positive(),
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

        const paymentResult = await initiateMpesaSTKPush({
          appointmentId: input.appointmentId,
          userId: ctx.user.id,
          phoneNumber: input.phoneNumber,
          amount: Math.round(input.amount),
          description: `Consultation with ${appointment.doctorName} - ${appointment.department}`,
        });

        if (!paymentResult) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to initiate M-Pesa payment",
          });
        }

        return paymentResult;
      } catch (error) {
        console.error("[Appointments] M-Pesa payment error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to initiate M-Pesa payment",
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
});
