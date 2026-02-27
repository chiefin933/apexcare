/*
 * ApexCare Doctors Page — Warm Medical Humanity Design
 * Grid of doctor cards with department filter
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { doctors, departments } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 }
  })
};

export default function Doctors() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const filtered = doctors.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchDept = selectedDept === "all" || doc.department === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-16">
        <div className="container">
          <div className="max-w-2xl mb-10">
            <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs uppercase tracking-wide">
              Our Medical Team
            </Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">
              Meet Our Doctors
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our 120+ specialists bring world-class expertise and genuine compassion to every patient encounter. Find the right doctor for your needs.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-teal-200 focus:border-teal-400"
              />
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={() => setSelectedDept("all")}
              className={`pill-tag transition-all ${
                selectedDept === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              All Departments
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`pill-tag transition-all ${
                  selectedDept === dept.id
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i * 0.3}
                >
                  <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift shadow-sm hover:shadow-teal-100/60 h-full flex flex-col">
                    {/* Photo */}
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="pill-tag bg-teal-500/90 text-white text-xs">
                          {doctor.departmentName}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-serif font-bold text-xl text-gray-900 mb-0.5">{doctor.name}</h3>
                      <p className="text-sm text-teal-600 font-medium mb-3">{doctor.title}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{doctor.experience} yrs experience</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-gray-700">{doctor.rating}</span>
                          <span>({doctor.reviews} reviews)</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {doctor.specializations.slice(0, 2).map((spec) => (
                          <span key={spec} className="pill-tag bg-gray-100 text-gray-600 text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Availability */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Available</p>
                        <div className="flex gap-1 flex-wrap">
                          {(typeof doctor.availability[0] === "string" && doctor.availability[0].includes("24/7"))
                            ? <span className="pill-tag bg-red-50 text-red-600 text-xs">24/7 On Rotation</span>
                            : doctor.availability.map((day) => (
                              <span key={day} className="pill-tag bg-teal-50 text-teal-600 text-xs">{day}</span>
                            ))
                          }
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="mb-5">
                        <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Languages</p>
                        <p className="text-xs text-gray-600">{doctor.languages.join(", ")}</p>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Link href={`/doctors/${doctor.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">
                            View Profile
                          </Button>
                        </Link>
                        <Link href="/book-appointment" className="flex-1">
                          <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                            Book
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
