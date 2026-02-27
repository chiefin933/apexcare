/*
 * Enhanced Book Appointment Page with Stripe & M-Pesa Payment Integration
 * Multi-step form: Department → Doctor → Date/Time → Patient Info → Payment → Confirmation
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ChevronRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { departments, doctors } from "@/lib/data";

type PaymentMethod = "stripe" | "mpesa" | "none";

export default function BookAppointmentEnhanced() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientEmail, setPatientEmail] = useState(user?.email || "");
  const [patientPhone, setPatientPhone] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("none");
  const [consultationFee, setConsultationFee] = useState("50");
  const [isProcessing, setIsProcessing] = useState(false);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  const bookMutation = trpc.appointments.book.useMutation();
  const stripePaymentMutation = trpc.appointments.initiateStripePayment.useMutation();
  const mpesaPaymentMutation = trpc.appointments.initiateMpesaPayment.useMutation();

  const filteredDoctors = selectedDepartment
    ? doctors.filter((doc) => doc.department === selectedDepartment)
    : [];

  const selectedDoctorData = doctors.find((doc) => doc.id === selectedDoctor);

  const handleBookAppointment = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book an appointment");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await bookMutation.mutateAsync({
        doctorName: selectedDoctorData?.name || "",
        department: selectedDepartment,
        appointmentDate,
        appointmentTime,
        patientFirstName,
        patientLastName,
        patientEmail,
        patientPhone,
        reasonForVisit,
        insuranceProvider,
        consultationFee,
      });

      if (result.success && result.appointmentId) {
        setAppointmentId(result.appointmentId);
        toast.success("Appointment booked successfully!");

        // If payment is required, move to payment step
        if (paymentMethod !== "none") {
          setStep(6); // Payment step
        } else {
          setStep(7); // Confirmation
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to book appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    if (!appointmentId) return;

    setIsProcessing(true);
    try {
      const result = await stripePaymentMutation.mutateAsync({
        appointmentId,
        amount: parseFloat(consultationFee),
      });

      // In a real app, redirect to Stripe checkout or use Stripe.js
      toast.success("Stripe payment initiated! Client secret: " + result.clientSecret);
      setStep(7);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMpesaPayment = async () => {
    if (!appointmentId || !patientPhone) return;

    setIsProcessing(true);
    try {
      // Format phone number to Kenya format if needed
      let phoneNumber = patientPhone;
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "254" + phoneNumber.slice(1);
      } else if (!phoneNumber.startsWith("254")) {
        phoneNumber = "254" + phoneNumber;
      }

      const result = await mpesaPaymentMutation.mutateAsync({
        appointmentId,
        phoneNumber,
        amount: parseFloat(consultationFee),
      });

      toast.success("M-Pesa STK Push sent! Check your phone to enter PIN.");
      setStep(7);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "M-Pesa payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 1: Select Department
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
            <p className="text-gray-600">Step 1 of 7: Select a Department</p>
          </div>

          <div className="grid gap-4">
            {departments.map((dept) => (
              <Card
                key={dept.id}
                className="p-6 cursor-pointer hover:shadow-lg hover:border-teal-300 transition-all"
                onClick={() => {
                  setSelectedDepartment(dept.id);
                  setStep(2);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-teal-600" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select Doctor
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Select a Doctor</h1>
            <p className="text-gray-600">Step 2 of 7: Choose from available specialists</p>
          </div>

          <div className="grid gap-4 mb-6">
            {filteredDoctors.map((doc) => (
              <Card
                key={doc.id}
                className="p-6 cursor-pointer hover:shadow-lg hover:border-teal-300 transition-all"
                onClick={() => {
                  setSelectedDoctor(doc.id);
                  setStep(3);
                }}
              >
                <div className="flex items-start gap-4">
                  <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-teal-600 font-medium">{doc.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{doc.experience} years experience</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-teal-600" />
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="w-full"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Select Date & Time
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Select Date & Time</h1>
            <p className="text-gray-600">Step 3 of 7: Choose your preferred appointment time</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="date">Appointment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="time">Appointment Time</Label>
                <select
                  id="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!appointmentDate || !appointmentTime}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Step 4: Patient Information
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Patient Information</h1>
            <p className="text-gray-600">Step 4 of 7: Tell us about yourself</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={patientFirstName}
                    onChange={(e) => setPatientFirstName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={patientLastName}
                    onChange={(e) => setPatientLastName(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+254712345678"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="reason">Reason for Visit</Label>
                <textarea
                  id="reason"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  placeholder="Describe your symptoms or reason for visit"
                />
              </div>

              <div>
                <Label htmlFor="insurance">Insurance Provider (Optional)</Label>
                <Input
                  id="insurance"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(5)}
                  disabled={!patientFirstName || !patientLastName || !patientEmail || !patientPhone}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Step 5: Payment Method Selection
  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Payment Method</h1>
            <p className="text-gray-600">Step 5 of 7: Choose how to pay for your consultation</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label>Consultation Fee</Label>
                <div className="mt-2 text-3xl font-bold text-teal-600">
                  ${consultationFee}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition-colors"
                  onClick={() => setPaymentMethod("none")}
                >
                  <input type="radio" name="payment" checked={paymentMethod === "none"} readOnly className="mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">Pay at Clinic</div>
                    <div className="text-sm text-gray-500">Pay during your visit</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition-colors"
                  onClick={() => setPaymentMethod("stripe")}
                >
                  <input type="radio" name="payment" checked={paymentMethod === "stripe"} readOnly className="mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">Credit/Debit Card (Stripe)</div>
                    <div className="text-sm text-gray-500">Secure payment via Stripe</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition-colors"
                  onClick={() => setPaymentMethod("mpesa")}
                >
                  <input type="radio" name="payment" checked={paymentMethod === "mpesa"} readOnly className="mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">M-Pesa</div>
                    <div className="text-sm text-gray-500">Pay via M-Pesa STK Push</div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(4)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(6)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Step 6: Process Payment
  if (step === 6 && paymentMethod !== "none") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
              {paymentMethod === "stripe" ? "Card Payment" : "M-Pesa Payment"}
            </h1>
            <p className="text-gray-600">Step 6 of 7: Complete your payment</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {paymentMethod === "stripe" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <strong>Note:</strong> Stripe integration requires additional setup with your Stripe account. You'll be redirected to Stripe checkout.
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "mpesa" && (
                <div>
                  <Label>M-Pesa Phone Number</Label>
                  <Input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+254712345678"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    You'll receive an STK Push prompt on this number to enter your M-Pesa PIN.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-semibold">${consultationFee}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg text-teal-600">${consultationFee}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(5)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button
                  onClick={async () => {
                    await handleBookAppointment();
                    if (paymentMethod === "stripe") {
                      await handleStripePayment();
                    } else if (paymentMethod === "mpesa") {
                      await handleMpesaPayment();
                    }
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${consultationFee}`
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Step 6: Book without payment
  if (step === 6 && paymentMethod === "none") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Review & Confirm</h1>
            <p className="text-gray-600">Step 6 of 7: Review your appointment details</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Appointment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-semibold">{selectedDoctorData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-semibold">{selectedDepartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-semibold">{appointmentDate} at {appointmentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patient:</span>
                    <span className="font-semibold">{patientFirstName} {patientLastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <Badge className="bg-green-100 text-green-700">Pay at Clinic</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(5)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button
                  onClick={handleBookAppointment}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Step 7: Confirmation
  if (step === 7) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container max-w-2xl">
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
              Appointment Booked!
            </h1>
            <p className="text-gray-600 mb-8">
              Your appointment has been successfully booked. A confirmation email has been sent to {patientEmail}.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment ID:</span>
                  <span className="font-mono font-semibold">#{appointmentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-semibold">{selectedDoctorData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold">{appointmentDate} at {appointmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <Badge className={paymentMethod === "none" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}>
                    {paymentMethod === "none" ? "Pay at Clinic" : "Paid"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/patient-portal" className="flex-1">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  View in Patient Portal
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
