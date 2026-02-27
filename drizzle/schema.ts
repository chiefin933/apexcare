import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Appointments table — stores patient appointment bookings
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  doctorName: varchar("doctorName", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  appointmentDate: varchar("appointmentDate", { length: 50 }).notNull(),
  appointmentTime: varchar("appointmentTime", { length: 20 }).notNull(),
  patientFirstName: varchar("patientFirstName", { length: 255 }).notNull(),
  patientLastName: varchar("patientLastName", { length: 255 }).notNull(),
  patientEmail: varchar("patientEmail", { length: 320 }).notNull(),
  patientPhone: varchar("patientPhone", { length: 20 }).notNull(),
  reasonForVisit: text("reasonForVisit"),
  insuranceProvider: varchar("insuranceProvider", { length: 255 }),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  consultationFee: decimal("consultationFee", { precision: 10, scale: 2 }).default("0"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["stripe", "mpesa", "none"]).default("none").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  mpesaCheckoutRequestId: varchar("mpesaCheckoutRequestId", { length: 255 }),
  emailSent: boolean("emailSent").default(false).notNull(),
  confirmationEmailSent: boolean("confirmationEmailSent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Payments table — stores Stripe payment records
 */
export const stripePayments = mysqlTable("stripePayments", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "canceled"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  receiptUrl: text("receiptUrl"),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StripePayment = typeof stripePayments.$inferSelect;
export type InsertStripePayment = typeof stripePayments.$inferInsert;

/**
 * M-Pesa Payments table — stores M-Pesa STK Push transactions
 */
export const mpesaPayments = mysqlTable("mpesaPayments", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("KES").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  checkoutRequestId: varchar("checkoutRequestId", { length: 255 }).notNull().unique(),
  requestId: varchar("requestId", { length: 255 }),
  resultCode: varchar("resultCode", { length: 10 }),
  resultDesc: text("resultDesc"),
  mpesaReceiptNumber: varchar("mpesaReceiptNumber", { length: 50 }),
  transactionDate: varchar("transactionDate", { length: 20 }),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "timeout"]).default("pending").notNull(),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MpesaPayment = typeof mpesaPayments.$inferSelect;
export type InsertMpesaPayment = typeof mpesaPayments.$inferInsert;

/**
 * Email logs table — tracks all sent emails
 */
export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId"),
  userId: int("userId"),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  emailType: mysqlEnum("emailType", ["appointment_confirmation", "appointment_reminder", "payment_receipt", "payment_failed", "appointment_cancelled"]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).default("sent").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

/**
 * Newsletter Subscribers table - tracks email subscribers for health tips
 */
export const newsletterSubscribers = mysqlTable("newsletterSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "unsubscribed", "bounced"]).default("active").notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
  lastEmailSentAt: timestamp("lastEmailSentAt"),
  emailCount: int("emailCount").default(0).notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
