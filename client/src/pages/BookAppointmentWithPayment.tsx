import { useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, AlertCircle, Phone, CreditCard } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { departments, doctors } from "@/lib/data";

type PaymentMethod = "none" | "mpesa" | "stripe";
type BookingStep = "details" | "payment" | "confirmation";

export default function BookAppointmentWithPayment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<BookingStep>("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("none");

  // Form state
  const [formData, setFormData] = useState({
    doctorId: "1",
    doctorName: "",
    department: "",
    appointmentDate: "",
    appointmentTime: "",
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    patientPhone: "",
    reasonForVisit: "",
    insuranceProvider: "",
    consultationFee: 0,
  });

  const [confirmationData, setConfirmationData] = useState<{
    appointmentId: number;
    checkoutRequestId?: string;
  } | null>(null);

  // tRPC mutations
  const bookAppointment = trpc.appointments.book.useMutation();
  const bookWithMpesa = trpc.appointments.bookWithMpesa.useMutation();
  const confirmMpesaPayment = trpc.appointments.confirmMpesaPayment.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-populate doctor info
    if (name === "doctorId") {
      const doctor = doctors.find((d) => d.id === value);
      if (doctor) {
        setFormData((prev) => ({
          ...prev,
          doctorId: value,
          doctorName: doctor.name,
          department: doctor.departmentName,
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.patientFirstName || !formData.patientLastName) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.patientEmail) {
      toast.error("Please enter your email");
      return false;
    }
    if (!formData.patientPhone) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast.error("Please select appointment date and time");
      return false;
    }
    if (!formData.doctorName) {
      toast.error("Please select a doctor");
      return false;
    }
    return true;
  };

  const handleBookFree = async () => {
    if (!validateForm()) return;

    try {
      const result = await bookAppointment.mutateAsync({
        doctorId: 1,
        doctorName: formData.doctorName,
        department: formData.department,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        patientFirstName: formData.patientFirstName,
        patientLastName: formData.patientLastName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        reasonForVisit: formData.reasonForVisit,
        insuranceProvider: formData.insuranceProvider,
      });

      setConfirmationData({
        appointmentId: result.appointmentId,
      });
      setStep("confirmation");
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to book appointment");
    }
  };

  const handleBookWithMpesa = async () => {
    if (!validateForm()) return;

    if (formData.consultationFee <= 0) {
      toast.error("Please enter a valid consultation fee");
      return;
    }

    try {
      setStep("payment");
      const result = await bookWithMpesa.mutateAsync({
        doctorId: 1,
        doctorName: formData.doctorName,
        department: formData.department,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        patientFirstName: formData.patientFirstName,
        patientLastName: formData.patientLastName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        reasonForVisit: formData.reasonForVisit,
        insuranceProvider: formData.insuranceProvider,
        consultationFee: formData.consultationFee,
      });

      setConfirmationData({
        appointmentId: result.appointmentId,
        checkoutRequestId: result.checkoutRequestId,
      });

      toast.success(result.message);

      // Wait for payment confirmation
      setTimeout(() => {
        setStep("confirmation");
      }, 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate M-Pesa payment");
      setStep("details");
    }
  };

  const handleConfirmPayment = async () => {
    if (!confirmationData?.checkoutRequestId) return;

    try {
      await confirmMpesaPayment.mutateAsync({
        appointmentId: confirmationData.appointmentId,
        checkoutRequestId: confirmationData.checkoutRequestId,
      });

      toast.success("Payment confirmed!");
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to confirm payment");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
        <div className="container max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
            <p className="text-gray-600">Schedule a consultation with our specialists</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            {(["details", "payment", "confirmation"] as const).map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === s
                      ? "bg-teal-500 text-white"
                      : ["details", "payment"].includes(step) && ["details", "payment"].includes(s)
                        ? "bg-teal-200 text-teal-700"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      ["details", "payment"].includes(step) && ["details", "payment"].includes(s)
                        ? "bg-teal-200"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Details Step */}
          {step === "details" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-8 shadow-lg">
                <div className="space-y-6">
                  {/* Doctor Selection */}
                  <div>
                    <Label htmlFor="doctorId" className="text-base font-semibold">
                      Select Doctor
                    </Label>
                      <Select value={formData.doctorId} onValueChange={(v) => handleSelectChange("doctorId", v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id.toString()}>
                            {doc.name} - {doc.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointmentDate" className="text-base font-semibold">
                        Appointment Date
                      </Label>
                      <Input
                        id="appointmentDate"
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="appointmentTime" className="text-base font-semibold">
                        Appointment Time
                      </Label>
                      <Input
                        id="appointmentTime"
                        type="time"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patientFirstName" className="text-base font-semibold">
                        First Name
                      </Label>
                      <Input
                        id="patientFirstName"
                        name="patientFirstName"
                        value={formData.patientFirstName}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patientLastName" className="text-base font-semibold">
                        Last Name
                      </Label>
                      <Input
                        id="patientLastName"
                        name="patientLastName"
                        value={formData.patientLastName}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="patientEmail" className="text-base font-semibold">
                      Email
                    </Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      name="patientEmail"
                      value={formData.patientEmail}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patientPhone" className="text-base font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="patientPhone"
                      name="patientPhone"
                      placeholder="0712345678 or +254712345678"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reasonForVisit" className="text-base font-semibold">
                      Reason for Visit
                    </Label>
                    <Textarea
                      id="reasonForVisit"
                      name="reasonForVisit"
                      value={formData.reasonForVisit}
                      onChange={handleInputChange}
                      placeholder="Describe your symptoms or reason for visit"
                      className="mt-2"
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="border-t pt-6">
                    <Label className="text-base font-semibold mb-4 block">Payment Method</Label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{borderColor: paymentMethod === "none" ? "#0D9488" : "#e5e7eb"}}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="none"
                          checked={paymentMethod === "none"}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-semibold">Free Consultation</p>
                          <p className="text-sm text-gray-600">No payment required</p>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{borderColor: paymentMethod === "mpesa" ? "#0D9488" : "#e5e7eb"}}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mpesa"
                          checked={paymentMethod === "mpesa"}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4" /> M-Pesa Payment
                          </p>
                          <p className="text-sm text-gray-600">Pay via M-Pesa STK Push</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Consultation Fee (if M-Pesa selected) */}
                  {paymentMethod === "mpesa" && (
                    <div>
                      <Label htmlFor="consultationFee" className="text-base font-semibold">
                        Consultation Fee (KES)
                      </Label>
                      <Input
                        id="consultationFee"
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            consultationFee: e.target.value ? parseFloat(e.target.value) : 0,
                          }))
                        }
                        placeholder="e.g., 500"
                        className="mt-2"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setLocation("/")}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    {paymentMethod === "none" ? (
                      <Button
                        onClick={handleBookFree}
                        disabled={bookAppointment.isPending}
                        className="flex-1 bg-teal-600 hover:bg-teal-700"
                      >
                        {bookAppointment.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          "Book Appointment"
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleBookWithMpesa}
                        disabled={bookWithMpesa.isPending}
                        className="flex-1 bg-teal-600 hover:bg-teal-700"
                      >
                        {bookWithMpesa.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4 mr-2" />
                            Proceed to M-Pesa
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-8 shadow-lg text-center">
                <Loader2 className="w-16 h-16 animate-spin text-teal-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
                <p className="text-gray-600 mb-6">
                  Check your phone for the M-Pesa prompt. Enter your PIN to complete the payment.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Do not close this page. We're waiting for payment confirmation.
                  </p>
                </div>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirmMpesaPayment.isPending}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {confirmMpesaPayment.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Confirmation Step */}
          {step === "confirmation" && confirmationData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-8 shadow-lg text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Appointment Booked!</h2>
                <p className="text-gray-600 mb-6">
                  Your appointment has been confirmed. A confirmation email has been sent to {formData.patientEmail}.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-semibold mb-4">Appointment Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Doctor:</strong> {formData.doctorName}
                    </p>
                    <p>
                      <strong>Department:</strong> {formData.department}
                    </p>
                    <p>
                      <strong>Date:</strong> {formData.appointmentDate}
                    </p>
                    <p>
                      <strong>Time:</strong> {formData.appointmentTime}
                    </p>
                    <p>
                      <strong>Appointment ID:</strong> APT-{confirmationData.appointmentId}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setLocation("/")}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  Return to Home
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Import useLocation from wouter
import { useLocation } from "wouter";
