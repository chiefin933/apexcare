/*
 * ApexCare About Page — Warm Medical Humanity Design
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

const values = [
  { icon: "❤️", title: "Compassion", desc: "Every patient is treated with dignity, empathy, and respect. We listen before we prescribe." },
  { icon: "🔬", title: "Excellence", desc: "We pursue the highest standards in clinical practice, research, and patient outcomes." },
  { icon: "🤝", title: "Integrity", desc: "Transparent communication, ethical practice, and accountability in everything we do." },
  { icon: "🌍", title: "Inclusivity", desc: "World-class healthcare accessible to all, regardless of background or circumstance." },
];

const timeline = [
  { year: "2001", event: "ApexCare Medical Centre founded with 3 departments and 15 staff" },
  { year: "2006", event: "Expanded to 8 departments; received national accreditation" },
  { year: "2010", event: "Opened state-of-the-art Radiology and Emergency wings" },
  { year: "2015", event: "Achieved JCI International Accreditation; launched Patient Portal" },
  { year: "2019", event: "Opened Pediatric Centre of Excellence; 30,000+ annual patients" },
  { year: "2023", event: "Launched telemedicine services; expanded to 18 departments" },
  { year: "2026", event: "Serving 50,000+ patients annually with 120+ specialists" },
];

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs uppercase tracking-wide">
                Our Story
              </Badge>
              <h1 className="font-serif text-5xl font-bold text-gray-900 mb-5 leading-tight">
                25 Years of Healing,<br />
                <em className="not-italic text-teal-600">One Patient at a Time</em>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Founded in 2001, ApexCare Medical Centre began as a vision: to create a hospital where clinical excellence and genuine human compassion are inseparable. Today, we serve over 50,000 patients annually across 18 specialized departments.
              </p>
              <Link href="/book-appointment">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                  Book an Appointment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663388194215/Tiaq8dCUDMxAxyhVtLmLiZ/apexcare-about-mfvJXToyrnZFpJ3n5jJBuH.webp"
                  alt="ApexCare Medical Team"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-5 shadow-lg">
                <div className="text-3xl font-serif font-bold text-teal-600">50K+</div>
                <div className="text-sm text-gray-600">Patients Annually</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-teal-600 rounded-3xl p-8 text-white"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-serif text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-teal-100 leading-relaxed">
                To deliver world-class, compassionate healthcare that improves lives, strengthens communities, and advances medical knowledge — making excellence in care accessible to every patient who walks through our doors.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="bg-gray-50 rounded-3xl p-8 border border-gray-100"
            >
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and innovative multi-specialty hospital in Africa — a centre of medical excellence that sets the standard for patient care, clinical research, and healthcare education across the continent.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
              What We Stand For
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.2}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-lift text-center"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h4 className="font-serif font-bold text-lg text-gray-900 mb-2">{v.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Accreditations & Certifications</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              ApexCare meets the highest international standards for patient safety, clinical quality, and operational excellence.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "JCI Accreditation", desc: "Joint Commission International", icon: "🏆" },
              { name: "ISO 9001:2015", desc: "Quality Management System", icon: "✅" },
              { name: "HIPAA Compliant", desc: "Patient Data Protection", icon: "🔒" },
              { name: "WHO Standards", desc: "World Health Organization", icon: "🌍" },
            ].map((cert) => (
              <div key={cert.name} className="bg-teal-50 rounded-2xl p-5 border border-teal-100 text-center">
                <div className="text-3xl mb-3">{cert.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{cert.name}</div>
                <div className="text-xs text-gray-500 mt-1">{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
              Our Journey
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-gray-900">25 Years of Growth</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal-100" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.15}
                  className="flex gap-6 pl-16 relative"
                >
                  <div className="absolute left-0 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs flex-shrink-0">
                    {item.year.slice(2)}
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-1">
                    <div className="font-serif font-bold text-teal-600 text-sm mb-1">{item.year}</div>
                    <div className="text-sm text-gray-700">{item.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
