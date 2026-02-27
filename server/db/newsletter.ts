import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { newsletterSubscribers, InsertNewsletterSubscriber } from "../../drizzle/schema";

/**
 * Subscribe a new email to the newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(newsletterSubscribers).values({
      email: email.toLowerCase(),
      subscriptionStatus: "active",
    }).onDuplicateKeyUpdate({
      set: {
        subscriptionStatus: "active",
      },
    });
  } catch (error) {
    console.error("[Newsletter] Failed to subscribe:", error);
    throw error;
  }
}

/**
 * Unsubscribe an email from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .update(newsletterSubscribers)
      .set({
        subscriptionStatus: "unsubscribed",
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.email, email.toLowerCase()));
  } catch (error) {
    console.error("[Newsletter] Failed to unsubscribe:", error);
    throw error;
  }
}

/**
 * Get all active newsletter subscribers
 */
export async function getActiveSubscribers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    return await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.subscriptionStatus, "active"));
  } catch (error) {
    console.error("[Newsletter] Failed to get subscribers:", error);
    throw error;
  }
}

/**
 * Check if an email is subscribed
 */
export async function isSubscribed(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email.toLowerCase()))
      .limit(1);

    return result.length > 0 && result[0].subscriptionStatus === "active";
  } catch (error) {
    console.error("[Newsletter] Failed to check subscription:", error);
    return false;
  }
}

/**
 * Update last email sent timestamp
 */
export async function updateLastEmailSent(email: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .update(newsletterSubscribers)
      .set({
        lastEmailSentAt: new Date(),
        emailCount: (await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email.toLowerCase())).limit(1))[0]?.emailCount || 0 + 1,
      })
      .where(eq(newsletterSubscribers.email, email.toLowerCase()));
  } catch (error) {
    console.error("[Newsletter] Failed to update last email sent:", error);
    throw error;
  }
}
