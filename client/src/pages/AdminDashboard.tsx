/*
 * Admin Dashboard — Dynamic management of appointments, payments, and email logs
 * Real-time filtering, sorting, and CRUD operations
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BarChart3,
  Users,
  CreditCard,
  Mail,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "payments" | "emails">(
    "overview"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Check admin access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have permission to access the admin dashboard.</p>
          <Button onClick={() => setLocation("/")} className="w-full bg-teal-600 hover:bg-teal-700">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  // Fetch dashboard data
  const overviewQuery = trpc.admin.getDashboardOverview.useQuery();
  const appointmentsQuery = trpc.admin.getAppointments.useQuery({
    status: filterStatus || undefined,
    page: currentPage,
    limit: 10,
  });
  const paymentsQuery = trpc.admin.getStripePayments.useQuery({
    status: filterStatus || undefined,
    page: currentPage,
    limit: 10,
  });
  const emailsQuery = trpc.admin.getEmailLogs.useQuery({
    status: filterStatus || undefined,
    page: currentPage,
    limit: 20,
  });
  const updateStatusMutation = trpc.admin.updateAppointmentStatus.useMutation();
  const cancelMutation = trpc.admin.cancelAppointment.useMutation();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    toast.success("Search functionality coming soon");
  };

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        appointmentId,
        status: newStatus as any,
      });
      toast.success("Appointment updated");
      appointmentsQuery.refetch();
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelMutation.mutateAsync({ appointmentId });
      toast.success("Appointment cancelled");
      appointmentsQuery.refetch();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage appointments, payments, and communications</p>
            </div>
            <Button
              onClick={() => {
                overviewQuery.refetch();
                appointmentsQuery.refetch();
                paymentsQuery.refetch();
                emailsQuery.refetch();
              }}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { id: "overview" as const, label: "Overview", icon: BarChart3 },
            { id: "appointments" as const, label: "Appointments", icon: Users },
            { id: "payments" as const, label: "Payments", icon: CreditCard },
            { id: "emails" as const, label: "Email Logs", icon: Mail },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === id
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Appointments Stats */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Appointments</h3>
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              {overviewQuery.isLoading ? (
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-2xl text-gray-900">
                      {overviewQuery.data?.appointments.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Pending:</span>
                      <div className="font-semibold text-yellow-600">
                        {overviewQuery.data?.appointments.pending}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Confirmed:</span>
                      <div className="font-semibold text-green-600">
                        {overviewQuery.data?.appointments.confirmed}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Payments Stats */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Revenue</h3>
                <CreditCard className="w-5 h-5 text-teal-600" />
              </div>
              {overviewQuery.isLoading ? (
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-2xl text-gray-900">
                      ${overviewQuery.data?.payments.totalRevenue}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Stripe:</span>
                      <div className="font-semibold">{overviewQuery.data?.payments.stripeCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">M-Pesa:</span>
                      <div className="font-semibold">{overviewQuery.data?.payments.mpesaCount}</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Email Stats */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Emails</h3>
                <Mail className="w-5 h-5 text-teal-600" />
              </div>
              {overviewQuery.isLoading ? (
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-2xl text-gray-900">
                      {overviewQuery.data?.emails.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Sent:</span>
                      <div className="font-semibold text-green-600">{overviewQuery.data?.emails.sent}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Failed:</span>
                      <div className="font-semibold text-red-600">{overviewQuery.data?.emails.failed}</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by patient name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
                <Button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="bg-teal-600 hover:bg-teal-700 gap-2 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Appointments Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Patient</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Doctor</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointmentsQuery.isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Loading appointments...
                        </td>
                      </tr>
                    ) : appointmentsQuery.data?.appointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      appointmentsQuery.data?.appointments.map((apt: any) => (
                        <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {apt.patientFirstName} {apt.patientLastName}
                            </div>
                            <div className="text-xs text-gray-500">{apt.patientEmail}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{apt.doctorName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {apt.appointmentDate} {apt.appointmentTime}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={apt.status}
                              onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                apt.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {apt.paymentStatus}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Cancel appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {currentPage}</span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!appointmentsQuery.data?.appointments.length}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentsQuery.isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          Loading payments...
                        </td>
                      </tr>
                    ) : paymentsQuery.data?.payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No payments found
                        </td>
                      </tr>
                    ) : (
                      paymentsQuery.data?.payments.map((payment: any) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-gray-900">{payment.transactionId}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ${payment.amount} {payment.currency}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">Stripe</td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                payment.status === "succeeded"
                                  ? "bg-green-100 text-green-700"
                                  : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Email Logs Tab */}
        {activeTab === "emails" && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Recipient</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {emailsQuery.isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          Loading email logs...
                        </td>
                      </tr>
                    ) : emailsQuery.data?.logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No email logs found
                        </td>
                      </tr>
                    ) : (
                      emailsQuery.data?.logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{log.recipientEmail}</td>
                          <td className="px-6 py-4 text-sm">
                            <Badge className="bg-teal-100 text-teal-700">{log.emailType}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {log.subject}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                log.status === "sent"
                                  ? "bg-green-100 text-green-700"
                                  : log.status === "failed"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                              }
                            >
                              {log.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(log.sentAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
