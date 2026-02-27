/*
 * Admin Router — tRPC procedures for admin dashboard
 * Requires admin role for all operations
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllAppointments,
  getAppointmentStats,
  getAllStripePayments,
  getAllMpesaPayments,
  getPaymentStats,
  getAllEmailLogs,
  getEmailStats,
  searchAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from "../db";

/**
 * Admin-only procedure that checks user role
 */
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /**
   * Get all appointments with filtering
   */
  getAppointments: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        paymentStatus: z.string().optional(),
        department: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const offset = (input.page - 1) * input.limit;
        const appointments = await getAllAppointments({
          status: input.status,
          paymentStatus: input.paymentStatus,
          department: input.department,
          limit: input.limit,
          offset,
        });

        return {
          appointments,
          page: input.page,
          limit: input.limit,
          total: appointments.length,
        };
      } catch (error) {
        console.error("[Admin] Get appointments error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch appointments",
        });
      }
    }),

  /**
   * Get appointment statistics
   */
  getAppointmentStats: adminProcedure.query(async () => {
    try {
      return await getAppointmentStats();
    } catch (error) {
      console.error("[Admin] Get appointment stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch appointment statistics",
      });
    }
  }),

  /**
   * Search appointments
   */
  searchAppointments: adminProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        return await searchAppointments(input.query);
      } catch (error) {
        console.error("[Admin] Search appointments error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search appointments",
        });
      }
    }),

  /**
   * Update appointment status
   */
  updateAppointmentStatus: adminProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const success = await updateAppointmentStatus(input.appointmentId, input.status);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update appointment status",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("[Admin] Update appointment status error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to update appointment",
            });
      }
    }),

  /**
   * Cancel appointment
   */
  cancelAppointment: adminProcedure
    .input(z.object({ appointmentId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const success = await cancelAppointment(input.appointmentId);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to cancel appointment",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("[Admin] Cancel appointment error:", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to cancel appointment",
            });
      }
    }),

  /**
   * Get all Stripe payments
   */
  getStripePayments: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const offset = (input.page - 1) * input.limit;
        const payments = await getAllStripePayments({
          status: input.status,
          limit: input.limit,
          offset,
        });

        return {
          payments,
          page: input.page,
          limit: input.limit,
          total: payments.length,
        };
      } catch (error) {
        console.error("[Admin] Get Stripe payments error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Stripe payments",
        });
      }
    }),

  /**
   * Get all M-Pesa payments
   */
  getMpesaPayments: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const offset = (input.page - 1) * input.limit;
        const payments = await getAllMpesaPayments({
          status: input.status,
          limit: input.limit,
          offset,
        });

        return {
          payments,
          page: input.page,
          limit: input.limit,
          total: payments.length,
        };
      } catch (error) {
        console.error("[Admin] Get M-Pesa payments error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch M-Pesa payments",
        });
      }
    }),

  /**
   * Get payment statistics
   */
  getPaymentStats: adminProcedure.query(async () => {
    try {
      return await getPaymentStats();
    } catch (error) {
      console.error("[Admin] Get payment stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch payment statistics",
      });
    }
  }),

  /**
   * Get all email logs
   */
  getEmailLogs: adminProcedure
    .input(
      z.object({
        emailType: z.string().optional(),
        status: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      try {
        const offset = (input.page - 1) * input.limit;
        const logs = await getAllEmailLogs({
          emailType: input.emailType,
          status: input.status,
          limit: input.limit,
          offset,
        });

        return {
          logs,
          page: input.page,
          limit: input.limit,
          total: logs.length,
        };
      } catch (error) {
        console.error("[Admin] Get email logs error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch email logs",
        });
      }
    }),

  /**
   * Get email statistics
   */
  getEmailStats: adminProcedure.query(async () => {
    try {
      return await getEmailStats();
    } catch (error) {
      console.error("[Admin] Get email stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch email statistics",
      });
    }
  }),

  /**
   * Get dashboard overview
   */
  getDashboardOverview: adminProcedure.query(async () => {
    try {
      const appointmentStats = await getAppointmentStats();
      const paymentStats = await getPaymentStats();
      const emailStats = await getEmailStats();

      return {
        appointments: appointmentStats,
        payments: paymentStats,
        emails: emailStats,
      };
    } catch (error) {
      console.error("[Admin] Get dashboard overview error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch dashboard overview",
      });
    }
  }),
});
