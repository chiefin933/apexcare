/*
 * ApexCare Contact Page — Warm Medical Humanity Design
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-16">
        <div className="container">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs uppercase tracking-wide">
              Get in Touch
            </Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Have a question, need to find a specialist, or want to learn more about our services? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-600 py-4">
        <div className="container text-center text-white">
          <p className="font-semibold">
            🚨 <strong>Medical Emergency?</strong> Call our 24/7 Emergency Hotline:{" "}
            <a href="tel:+18009739911" className="underline font-bold text-lg">+1 (800) APEX-911</a>
            {" "}or go directly to our Emergency Department.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              </motion.div>

              {[
                {
                  icon: MapPin,
                  title: "Our Location",
                  content: "123 Healthcare Avenue\nMedical District, Nairobi\nKenya, 00100",
                  color: "bg-teal-100 text-teal-600"
                },
                {
                  icon: Phone,
                  title: "Phone Numbers",
                  content: "Main: +254 (020) 123-4567\nEmergency: +1 (800) APEX-911\nAppointments: +254 (020) 123-4568",
                  color: "bg-teal-100 text-teal-600"
                },
                {
                  icon: Mail,
                  title: "Email Addresses",
                  content: "General: info@apexcaremedical.com\nAppointments: appointments@apexcaremedical.com\nAdmin: admin@apexcaremedical.com",
                  color: "bg-teal-100 text-teal-600"
                },
                {
                  icon: Clock,
                  title: "Working Hours",
                  content: "Mon–Fri: 7:00 AM – 8:00 PM\nSat–Sun: 8:00 AM – 5:00 PM\nEmergency: 24/7 Always Open",
                  color: "bg-teal-100 text-teal-600"
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.2}
                  className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 mb-6">Thank you for reaching out. Our team will respond within 24 hours.</p>
                    <Button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                      variant="outline"
                      className="border-teal-200 text-teal-700 hover:bg-teal-50"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</Label>
                        <Input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="John Doe"
                          className="border-gray-200 focus:border-teal-400"
                          required
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
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number</Label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+254 700 000 000"
                          className="border-gray-200 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Subject</Label>
                        <Input
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          placeholder="Appointment inquiry, feedback..."
                          className="border-gray-200 focus:border-teal-400"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Message *</Label>
                      <Textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="How can we help you?"
                        rows={5}
                        className="border-gray-200 focus:border-teal-400 resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-72 bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-teal-400 mx-auto mb-3" />
              <h3 className="font-serif font-semibold text-gray-700 mb-1">ApexCare Medical Centre</h3>
              <p className="text-gray-500 text-sm">123 Healthcare Avenue, Medical District, Nairobi, Kenya</p>
              <a
                href="https://maps.google.com/?q=Nairobi+Kenya+Hospital"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-teal-600 hover:text-teal-800 underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
