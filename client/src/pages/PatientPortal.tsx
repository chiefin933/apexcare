/*
 * ApexCare Patient Portal — Warm Medical Humanity Design
 * Login form + mock dashboard with appointments, profile, reports
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, FileText, User, LogOut, Bell, Download,
  CheckCircle, Clock, ChevronRight, Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const mockAppointments = [
  {
    id: 1,
    doctor: "Dr. Amara Osei",
    department: "Cardiology",
    date: "March 5, 2026",
    time: "10:00 AM",
    status: "upcoming",
    type: "Follow-up Consultation"
  },
  {
    id: 2,
    doctor: "Dr. Priya Sharma",
    department: "Pediatrics",
    date: "February 18, 2026",
    time: "2:30 PM",
    status: "completed",
    type: "Annual Check-up"
  },
  {
    id: 3,
    doctor: "Dr. James Mwangi",
    department: "Neurology",
    date: "January 22, 2026",
    time: "9:00 AM",
    status: "completed",
    type: "Initial Consultation"
  },
];

const mockReports = [
  { id: 1, name: "Blood Panel Results", date: "Feb 18, 2026", type: "Lab Report", size: "245 KB" },
  { id: 2, name: "ECG Report", date: "Jan 22, 2026", type: "Cardiology", size: "1.2 MB" },
  { id: 3, name: "MRI Scan Report", date: "Dec 10, 2025", type: "Radiology", size: "8.4 MB" },
];

export default function PatientPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setIsLoggedIn(true);
    toast.success("Welcome back!", { description: "You have successfully logged in to your patient portal." });
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <section className="min-h-[80vh] bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center py-16">
          <div className="container max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Patient Portal</h1>
                <p className="text-gray-500 text-sm">
                  Access your appointments, medical records, and health reports securely.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</Label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="border-gray-200 focus:border-teal-400"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <Label className="text-sm font-medium text-gray-700">Password</Label>
                    <button type="button" className="text-xs text-teal-600 hover:text-teal-800">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="border-gray-200 focus:border-teal-400"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
                  Sign In to Portal
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500 mb-3">Don't have an account?</p>
                <Button
                  variant="outline"
                  className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => toast.info("Registration", { description: "Please contact reception or call +254 (020) 123-4567 to register as a patient." })}
                >
                  Register as a Patient
                </Button>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <Shield className="w-3.5 h-3.5" />
                <span>Your data is encrypted and HIPAA compliant</span>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">Welcome back, John</h1>
              <p className="text-gray-500 text-sm mt-1">Patient ID: APC-2024-00847 · Last login: Feb 26, 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg bg-white border border-gray-100 text-gray-600 hover:bg-teal-50 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">2</span>
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setIsLoggedIn(false); toast.info("Logged out successfully."); }}
                className="border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Upcoming Appointments", value: "1", icon: Calendar, color: "bg-teal-50 text-teal-600" },
              { label: "Past Appointments", value: "12", icon: CheckCircle, color: "bg-green-50 text-green-600" },
              { label: "Medical Reports", value: "8", icon: FileText, color: "bg-blue-50 text-blue-600" },
              { label: "Active Prescriptions", value: "3", icon: Clock, color: "bg-amber-50 text-amber-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="font-serif text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="appointments">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="appointments" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-600">
                <Calendar className="w-4 h-4 mr-1.5" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="reports" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-600">
                <FileText className="w-4 h-4 mr-1.5" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-600">
                <User className="w-4 h-4 mr-1.5" />
                My Profile
              </TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <div className="space-y-4">
                {mockAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-teal-50 transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      appt.status === "upcoming" ? "bg-teal-100" : "bg-gray-100"
                    }`}>
                      <Calendar className={`w-5 h-5 ${appt.status === "upcoming" ? "text-teal-600" : "text-gray-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900">{appt.doctor}</span>
                        <Badge className={`text-xs px-2 py-0.5 ${
                          appt.status === "upcoming"
                            ? "bg-teal-50 text-teal-600 border-teal-100"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          {appt.status === "upcoming" ? "Upcoming" : "Completed"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">{appt.department} · {appt.type}</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {appt.date} at {appt.time}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => toast.info("Redirecting to booking...")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.type} · {report.date}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{report.size}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-teal-200 text-teal-700 hover:bg-teal-50 flex-shrink-0"
                      onClick={() => toast.success(`Downloading ${report.name}...`)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-xl">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "First Name", value: "John" },
                    { label: "Last Name", value: "Doe" },
                    { label: "Date of Birth", value: "March 15, 1985" },
                    { label: "Blood Type", value: "O+" },
                    { label: "Email", value: "john.doe@example.com" },
                    { label: "Phone", value: "+254 700 123 456" },
                  ].map((field) => (
                    <div key={field.label}>
                      <Label className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1 block">{field.label}</Label>
                      <div className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => toast.info("Profile editing coming soon.")}
                >
                  Edit Profile
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
