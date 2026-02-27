import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { subscribeToNewsletter, unsubscribeFromNewsletter, isSubscribed } from "../db/newsletter";
import { sendNewsletterWelcomeEmail } from "../services/resendEmailService";
import { TRPCError } from "@trpc/server";

export const newsletterRouter = router({
  /**
   * Subscribe to newsletter
   */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validate email format
        if (!input.email || input.email.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email is required",
          });
        }

        // Check if already subscribed
        const alreadySubscribed = await isSubscribed(input.email);
        if (alreadySubscribed) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email is already subscribed to the newsletter",
          });
        }

        // Subscribe to newsletter
        await subscribeToNewsletter(input.email);

        // Send welcome email
        try {
          await sendNewsletterWelcomeEmail(input.email);
        } catch (emailError) {
          console.error("[Newsletter] Failed to send welcome email:", emailError);
          // Don't fail the subscription if email fails
        }

        return {
          success: true,
          message: "Successfully subscribed to the newsletter! Check your email for confirmation.",
          email: input.email,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("[Newsletter] Subscription error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to newsletter",
        });
      }
    }),

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if subscribed
        const subscribed = await isSubscribed(input.email);
        if (!subscribed) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email is not subscribed to the newsletter",
          });
        }

        // Unsubscribe
        await unsubscribeFromNewsletter(input.email);

        return {
          success: true,
          message: "Successfully unsubscribed from the newsletter",
          email: input.email,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("[Newsletter] Unsubscribe error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unsubscribe from newsletter",
        });
      }
    }),

  /**
   * Check subscription status
   */
  checkStatus: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .query(async ({ input }) => {
      try {
        const subscribed = await isSubscribed(input.email);
        return {
          email: input.email,
          isSubscribed: subscribed,
        };
      } catch (error) {
        console.error("[Newsletter] Check status error:", error);
        return {
          email: input.email,
          isSubscribed: false,
        };
      }
    }),
});
