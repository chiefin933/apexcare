/*
 * ApexCare Book Appointment Page — Warm Medical Humanity Design
 * Multi-step wizard: Department → Doctor → Date/Time → Patient Info → Confirmation
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Calendar, Clock, User, ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { departments, doctors } from "@/lib/data";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Department", icon: "🏥" },
  { id: 2, label: "Doctor", icon: "👨‍⚕️" },
  { id: 3, label: "Date & Time", icon: "📅" },
  { id: 4, label: "Your Info", icon: "👤" },
  { id: 5, label: "Confirm", icon: "✅" },
];

const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM"
];

const today = new Date();
const getNext14Days = () => {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });
};

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    department: "",
    doctorId: "",
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    insurance: "",
  });

  const availableDoctors = form.department
    ? doctors.filter((d) => d.department === form.department)
    : doctors;

  const selectedDoctor = doctors.find((d) => d.id === form.doctorId);
  const selectedDept = departments.find((d) => d.id === form.department);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canProceed = () => {
    if (step === 1) return !!form.department;
    if (step === 2) return !!form.doctorId;
    if (step === 3) return !!form.date && !!form.time;
    if (step === 4) return !!form.firstName && !!form.lastName && !!form.email && !!form.phone;
    return true;
  };

  const handleSubmit = () => {
    toast.success("Appointment Booked!", {
      description: `Your appointment with ${selectedDoctor?.name} on ${form.date} at ${form.time} has been confirmed. A confirmation email will be sent to ${form.email}.`,
      duration: 6000,
    });
    setStep(5);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-12">
        <div className="container">
          <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs uppercase tracking-wide">
            Appointment Booking
          </Badge>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-600 max-w-xl">
            Schedule a consultation with one of our specialists in just a few steps. Same-day appointments available for urgent cases.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container max-w-3xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-teal-500 transition-all duration-500 -z-0"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    s.id < step
                      ? "bg-teal-600 text-white"
                      : s.id === step
                      ? "bg-teal-600 text-white ring-4 ring-teal-100"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {s.id < step ? <CheckCircle className="w-5 h-5" /> : s.icon}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${s.id === step ? "text-teal-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[380px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Department */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Select Department</h2>
                  <p className="text-gray-500 mb-6">Choose the medical specialty you need.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => setForm({ ...form, department: dept.id, doctorId: "" })}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          form.department === dept.id
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-100 hover:border-teal-200 hover:bg-teal-50/50"
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {dept.id === "cardiology" ? "❤️" :
                           dept.id === "neurology" ? "🧠" :
                           dept.id === "pediatrics" ? "👶" :
                           dept.id === "orthopedics" ? "🦴" :
                           dept.id === "radiology" ? "🔬" : "🚑"}
                        </div>
                        <div className="font-semibold text-sm text-gray-900">{dept.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{dept.shortDesc}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Doctor */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Choose Your Doctor</h2>
                  <p className="text-gray-500 mb-6">
                    {selectedDept ? `${selectedDept.name} specialists` : "All available doctors"}
                  </p>
                  <div className="space-y-3">
                    {availableDoctors.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setForm({ ...form, doctorId: doc.id })}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                          form.doctorId === doc.id
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-100 hover:border-teal-200"
                        }`}
                      >
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{doc.name}</div>
                          <div className="text-sm text-teal-600">{doc.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{doc.experience} yrs experience</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold text-gray-700">⭐ {doc.rating}</div>
                          <div className="text-xs text-gray-400">{doc.reviews} reviews</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Date & Time */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
                  <p className="text-gray-500 mb-6">Choose your preferred appointment slot.</p>

                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      <Calendar className="w-4 h-4 inline mr-1.5" />
                      Available Dates
                    </Label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {getNext14Days().map((d) => {
                        const dateStr = formatDate(d);
                        return (
                          <button
                            key={dateStr}
                            onClick={() => setForm({ ...form, date: dateStr })}
                            className={`py-2 px-1 rounded-xl text-center text-xs font-medium transition-all ${
                              form.date === dateStr
                                ? "bg-teal-600 text-white"
                                : "bg-gray-50 text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-100"
                            }`}
                          >
                            <div>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                            <div className="font-bold">{d.getDate()}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      <Clock className="w-4 h-4 inline mr-1.5" />
                      Available Times
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setForm({ ...form, time })}
                          className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                            form.time === time
                              ? "bg-teal-600 text-white"
                              : "bg-gray-50 text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-100"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Patient Info */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Your Information</h2>
                  <p className="text-gray-500 mb-6">Please provide your details for the appointment.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">First Name *</Label>
                      <Input
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        placeholder="John"
                        className="border-gray-200 focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Last Name *</Label>
                      <Input
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        placeholder="Doe"
                        className="border-gray-200 focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="border-gray-200 focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number *</Label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+254 700 000 000"
                        className="border-gray-200 focus:border-teal-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Reason for Visit</Label>
                      <Input
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                        placeholder="Brief description of your symptoms or concern"
                        className="border-gray-200 focus:border-teal-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Insurance Provider (optional)</Label>
                      <Select onValueChange={(v) => setForm({ ...form, insurance: v })}>
                        <SelectTrigger className="border-gray-200 focus:border-teal-400">
                          <SelectValue placeholder="Select insurance provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nhif">NHIF</SelectItem>
                          <SelectItem value="jubilee">Jubilee Health</SelectItem>
                          <SelectItem value="aon">AON Minet</SelectItem>
                          <SelectItem value="britam">Britam</SelectItem>
                          <SelectItem value="aar">AAR Insurance</SelectItem>
                          <SelectItem value="self-pay">Self Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Confirmation */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-teal-600" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">
                    Appointment Confirmed!
                  </h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Your appointment has been successfully booked. A confirmation has been sent to <strong>{form.email}</strong>.
                  </p>
                  <div className="bg-teal-50 rounded-2xl p-6 text-left max-w-sm mx-auto border border-teal-100 mb-8">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Doctor</span>
                        <span className="font-semibold text-gray-900">{selectedDoctor?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Department</span>
                        <span className="font-semibold text-gray-900">{selectedDept?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-semibold text-gray-900">{form.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="font-semibold text-gray-900">{form.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Patient</span>
                        <span className="font-semibold text-gray-900">{form.firstName} {form.lastName}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => { setStep(1); setForm({ department: "", doctorId: "", date: "", time: "", firstName: "", lastName: "", email: "", phone: "", reason: "", insurance: "" }); }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                  >
                    Book Another Appointment
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prev}
                disabled={step === 1}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              {step < 4 ? (
                <Button
                  onClick={next}
                  disabled={!canProceed()}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                >
                  Confirm Appointment
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
