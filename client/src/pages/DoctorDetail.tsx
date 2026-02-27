/*
 * ApexCare Doctor Detail Page — Warm Medical Humanity Design
 */

import { Link, useParams } from "wouter";
import { Star, Calendar, Clock, Globe, GraduationCap, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { doctors } from "@/lib/data";

const dayFull: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
  Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday"
};

export default function DoctorDetail() {
  const params = useParams<{ id: string }>();
  const doctor = doctors.find((d) => d.id === params.id);

  if (!doctor) {
    return (
      <Layout>
        <div className="container py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
          <Link href="/doctors">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Back to Doctors</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-12">
        <div className="container">
          <Link href="/doctors">
            <span className="text-teal-600 text-sm hover:text-teal-800 transition-colors mb-6 inline-flex items-center gap-1">
              ← Back to Doctors
            </span>
          </Link>
          <div className="grid lg:grid-cols-3 gap-10 mt-4">
            {/* Photo & Quick Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <div className="h-72 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{doctor.rating}</span>
                    <span className="text-sm text-gray-400">({doctor.reviews} reviews)</span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4 text-teal-500" />
                      <span>{doctor.experience} years of experience</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <GraduationCap className="w-4 h-4 text-teal-500 mt-0.5" />
                      <span>{doctor.education}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <Globe className="w-4 h-4 text-teal-500 mt-0.5" />
                      <span>{doctor.languages.join(", ")}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Availability</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(typeof doctor.availability[0] === "string" && doctor.availability[0].includes("24/7"))
                        ? <span className="pill-tag bg-red-50 text-red-600 text-xs">24/7 On Rotation</span>
                        : doctor.availability.map((day) => (
                          <span key={day} className="pill-tag bg-teal-50 text-teal-600 text-xs">
                            {dayFull[day] || day}
                          </span>
                        ))
                      }
                    </div>
                  </div>

                  <Link href="/book-appointment" className="block mt-5">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Badge className="mb-3 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs uppercase tracking-wide">
                  {doctor.departmentName}
                </Badge>
                <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                <p className="text-teal-600 font-medium text-lg mb-5">{doctor.title}</p>
                <p className="text-gray-600 leading-relaxed text-base">{doctor.bio}</p>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="font-serif font-semibold text-xl text-gray-900 mb-4">Areas of Specialization</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-sm font-medium border border-teal-100"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weekly Schedule */}
              <div>
                <h3 className="font-serif font-semibold text-xl text-gray-900 mb-4">Weekly Schedule</h3>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const isAvailable = typeof doctor.availability[0] === "string" && doctor.availability[0].includes("24/7")
                      ? true
                      : doctor.availability.includes(day);
                    return (
                      <div
                        key={day}
                        className={`text-center py-3 px-2 rounded-xl text-xs font-medium ${
                          isAvailable
                            ? "bg-teal-100 text-teal-700 border border-teal-200"
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                        }`}
                      >
                        <div className="font-semibold">{day}</div>
                        <div className="mt-1">{isAvailable ? "✓" : "–"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Hours */}
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h4 className="font-semibold text-gray-900">Consultation Hours</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Morning:</span> 8:00 AM – 12:00 PM
                  </div>
                  <div>
                    <span className="font-medium">Afternoon:</span> 2:00 PM – 5:00 PM
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  * Appointment required. Walk-ins subject to availability.
                </p>
              </div>

              <Link href="/book-appointment">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                  Schedule an Appointment with {doctor.name.split(" ")[0]}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
