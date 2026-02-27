import { eq, or, like, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, appointments, InsertAppointment, Appointment } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new appointment
 */
export async function createAppointment(data: InsertAppointment): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) {
    console.error("[Database] Cannot create appointment: database not available");
    return null;
  }

  try {
    const result = await db.insert(appointments).values(data);
    const appointmentId = (result as any)[0]?.insertId;

    if (appointmentId) {
      const created = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, appointmentId))
        .limit(1);

      return created.length > 0 ? created[0] : null;
    }

    return null;
  } catch (error) {
    console.error("[Database] Failed to create appointment:", error);
    return null;
  }
}

/**
 * Get appointment by ID
 */
export async function getAppointmentById(appointmentId: number): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get user's appointments
 */
export async function getUserAppointments(userId: number): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId));
}

/**
 * Update appointment
 */
export async function updateAppointment(
  appointmentId: number,
  updates: Partial<Appointment>
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(appointments)
      .set(updates)
      .where(eq(appointments.id, appointmentId));

    return true;
  } catch (error) {
    console.error("[Database] Failed to update appointment:", error);
    return false;
  }
}


/**
 * Admin Queries — Retrieve data for admin dashboard
 */

import { stripePayments, mpesaPayments, emailLogs } from "../drizzle/schema";

/**
 * Get all appointments with optional filtering
 */
export async function getAllAppointments(filters?: {
  status?: string;
  paymentStatus?: string;
  department?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];

  if (filters?.status) {
    conditions.push(eq(appointments.status, filters.status as any));
  }
  if (filters?.paymentStatus) {
    conditions.push(eq(appointments.paymentStatus, filters.paymentStatus as any));
  }
  if (filters?.department) {
    conditions.push(like(appointments.department, `%${filters.department}%`));
  }

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  let query = db.select().from(appointments) as any;
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await (query as any).orderBy(desc(appointments.createdAt)).limit(limit).offset(offset);
}

/**
 * Get appointment count by status
 */
export async function getAppointmentStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

  const allAppts = await db.select().from(appointments);

  return {
    total: allAppts.length,
    pending: allAppts.filter((a) => a.status === "pending").length,
    confirmed: allAppts.filter((a) => a.status === "confirmed").length,
    completed: allAppts.filter((a) => a.status === "completed").length,
    cancelled: allAppts.filter((a) => a.status === "cancelled").length,
  };
}

/**
 * Get all Stripe payments with optional filtering
 */
export async function getAllStripePayments(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  let query = db.select().from(stripePayments) as any;
  if (filters?.status) {
    query = query.where(eq(stripePayments.status, filters.status as any));
  }

  return await (query as any).orderBy(desc(stripePayments.createdAt)).limit(limit).offset(offset);
}

/**
 * Get all M-Pesa payments with optional filtering
 */
export async function getAllMpesaPayments(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  let query = db.select().from(mpesaPayments) as any;
  if (filters?.status) {
    query = query.where(eq(mpesaPayments.status, filters.status as any));
  }

  return await (query as any).orderBy(desc(mpesaPayments.createdAt)).limit(limit).offset(offset);
}

/**
 * Get payment statistics
 */
export async function getPaymentStats() {
  const db = await getDb();
  if (!db) return { totalRevenue: 0, stripeCount: 0, mpesaCount: 0, pendingPayments: 0 };

  const stripePaymentsList = await db.select().from(stripePayments);
  const mpesaPaymentsList = await db.select().from(mpesaPayments);

  const totalRevenue =
    stripePaymentsList
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0) +
    mpesaPaymentsList
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const pendingPayments =
    stripePaymentsList.filter((p) => p.status === "pending").length +
    mpesaPaymentsList.filter((p) => p.status === "pending").length;

  return {
    totalRevenue: totalRevenue.toFixed(2),
    stripeCount: stripePaymentsList.filter((p) => p.status === "succeeded").length,
    mpesaCount: mpesaPaymentsList.filter((p) => p.status === "succeeded").length,
    pendingPayments,
  };
}

/**
 * Get all email logs with optional filtering
 */
export async function getAllEmailLogs(filters?: {
  emailType?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const limit = filters?.limit || 100;
  const offset = filters?.offset || 0;

  const conditions: any[] = [];
  if (filters?.emailType) {
    conditions.push(eq(emailLogs.emailType, filters.emailType as any));
  }
  if (filters?.status) {
    conditions.push(eq(emailLogs.status, filters.status as any));
  }

  let query = db.select().from(emailLogs) as any;
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await (query as any).orderBy(desc(emailLogs.sentAt)).limit(limit).offset(offset);
}

/**
 * Get email statistics
 */
export async function getEmailStats() {
  const db = await getDb();
  if (!db) return { total: 0, sent: 0, failed: 0, bounced: 0 };

  const allEmails = await db.select().from(emailLogs);

  return {
    total: allEmails.length,
    sent: allEmails.filter((e) => e.status === "sent").length,
    failed: allEmails.filter((e) => e.status === "failed").length,
    bounced: allEmails.filter((e) => e.status === "bounced").length,
  };
}

/**
 * Search appointments by patient name or email
 */
export async function searchAppointments(searchQuery: string) {
  const db = await getDb();
  if (!db) return [];

  const lowerQuery = `%${searchQuery.toLowerCase()}%`;

  return await db
    .select()
    .from(appointments)
    .where(
      or(
        like(appointments.patientFirstName, lowerQuery),
        like(appointments.patientLastName, lowerQuery),
        like(appointments.patientEmail, lowerQuery),
        like(appointments.patientPhone, lowerQuery)
      )
    )
    .orderBy(desc(appointments.createdAt))
    .limit(20);
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  appointmentId: number,
  status: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, appointmentId));

    return true;
  } catch (error) {
    console.error("[Database] Failed to update appointment status:", error);
    return false;
  }
}

/**
 * Delete appointment (soft delete by cancelling)
 */
export async function cancelAppointment(appointmentId: number): Promise<boolean> {
  return updateAppointmentStatus(appointmentId, "cancelled");
}
