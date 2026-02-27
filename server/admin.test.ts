import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AdminUser = NonNullable<TrpcContext["user"]> & { role: "admin" };

function createAdminContext(): TrpcContext {
  const user: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@apexcare.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user = {
    id: 2,
    openId: "regular-user",
    email: "user@apexcare.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin router", () => {
  it("should allow admin to access dashboard overview", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw
    const result = await caller.admin.getDashboardOverview();
    expect(result).toBeDefined();
    expect(result.appointments).toBeDefined();
    expect(result.payments).toBeDefined();
    expect(result.emails).toBeDefined();
  });

  it("should deny non-admin access to dashboard overview", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.getDashboardOverview();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("Admin access required");
    }
  });

  it("should allow admin to get appointments with filters", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getAppointments({
      status: "pending",
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.appointments).toBeDefined();
    expect(Array.isArray(result.appointments)).toBe(true);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("should allow admin to get appointment statistics", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.admin.getAppointmentStats();

    expect(stats).toBeDefined();
    expect(typeof stats.total).toBe("number");
    expect(typeof stats.pending).toBe("number");
    expect(typeof stats.confirmed).toBe("number");
  });

  it("should allow admin to get Stripe payments", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getStripePayments({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.payments).toBeDefined();
    expect(Array.isArray(result.payments)).toBe(true);
  });

  it("should allow admin to get M-Pesa payments", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getMpesaPayments({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.payments).toBeDefined();
    expect(Array.isArray(result.payments)).toBe(true);
  });

  it("should allow admin to get payment statistics", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.admin.getPaymentStats();

    expect(stats).toBeDefined();
    expect(stats.totalRevenue).toBeDefined();
    expect(stats.stripeCount).toBeDefined();
    expect(stats.mpesaCount).toBeDefined();
  });

  it("should allow admin to get email logs", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getEmailLogs({
      page: 1,
      limit: 20,
    });

    expect(result).toBeDefined();
    expect(result.logs).toBeDefined();
    expect(Array.isArray(result.logs)).toBe(true);
  });

  it("should allow admin to get email statistics", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.admin.getEmailStats();

    expect(stats).toBeDefined();
    expect(typeof stats.total).toBe("number");
    expect(typeof stats.sent).toBe("number");
    expect(typeof stats.failed).toBe("number");
  });

  it("should deny non-admin access to update appointment status", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.updateAppointmentStatus({
        appointmentId: 1,
        status: "confirmed",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should deny non-admin access to cancel appointment", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.cancelAppointment({
        appointmentId: 1,
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
