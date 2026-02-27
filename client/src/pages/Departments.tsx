/*
 * ApexCare Departments Page — Warm Medical Humanity Design
 * Grid of department cards with stats and services
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { Heart, Brain, Baby, Bone, Scan, Siren, ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { departments } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Heart, Brain, Baby, Bone, Scan, Siren
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

export default function Departments() {
  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-16">
        <div className="container">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs uppercase tracking-wide">
              Our Specialties
            </Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">
              Medical Departments
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              ApexCare houses 18 specialized departments, each staffed by leading experts and equipped with the latest medical technology to deliver comprehensive, patient-centered care.
            </p>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {departments.map((dept, i) => {
              const Icon = iconMap[dept.icon];
              return (
                <motion.div
                  key={dept.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i * 0.3}
                >
                  <Link href={`/departments/${dept.id}`}>
                    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift shadow-sm hover:shadow-teal-100/60 h-full flex flex-col">
                      {/* Dept Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={dept.image}
                          alt={dept.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                        <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl ${dept.iconBg} flex items-center justify-center`}>
                          {Icon && <Icon className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">{dept.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{dept.description}</p>

                        {/* Stats */}
                        <div className={`grid grid-cols-3 gap-2 p-3 rounded-xl mb-4 ${dept.color} bg-opacity-20`}>
                          <div className="text-center">
                            <div className="font-bold text-sm text-gray-900">{dept.stats.patients}</div>
                            <div className="text-xs text-gray-500">Patients</div>
                          </div>
                          <div className="text-center border-x border-gray-200">
                            <div className="font-bold text-sm text-gray-900">{dept.stats.specialists}</div>
                            <div className="text-xs text-gray-500">Specialists</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-sm text-gray-900">{dept.stats.procedures}</div>
                            <div className="text-xs text-gray-500">Procedures</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-teal-600 font-medium group-hover:underline">
                            View Department
                          </span>
                          <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-50">
        <div className="container text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
            Not Sure Which Department You Need?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our patient coordinators are here to help you find the right specialist. Call us or book a general consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book-appointment">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                Book Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
