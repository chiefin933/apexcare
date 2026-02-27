/*
 * ApexCare Department Detail Page — Warm Medical Humanity Design
 * Dynamic routing by department id
 */

import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Heart, Brain, Baby, Bone, Scan, Siren, ArrowRight, CheckCircle, Users, Award, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { departments, doctors } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Heart, Brain, Baby, Bone, Scan, Siren
};

export default function DepartmentDetail() {
  const params = useParams<{ id: string }>();
  const dept = departments.find((d) => d.id === params.id);
  const deptDoctors = doctors.filter((doc) => doc.department === params.id);

  if (!dept) {
    return (
      <Layout>
        <div className="container py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">Department Not Found</h1>
          <Link href="/departments">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Back to Departments</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = iconMap[dept.icon];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${dept.image})` }}
        />
        <div className="absolute inset-0 bg-teal-900/75" />
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl text-white">
            <Link href="/departments">
              <span className="text-teal-300 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">
                ← All Departments
              </span>
            </Link>
            <div className={`w-14 h-14 rounded-2xl ${dept.iconBg} flex items-center justify-center mb-5`}>
              {Icon && <Icon className="w-7 h-7" />}
            </div>
            <h1 className="font-serif text-5xl font-bold mb-4">{dept.name}</h1>
            <p className="text-teal-100 text-lg leading-relaxed mb-6">{dept.description}</p>
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <div className="font-serif text-3xl font-bold">{dept.stats.patients}</div>
                <div className="text-teal-200 text-sm">Patients Served</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-3xl font-bold">{dept.stats.specialists}</div>
                <div className="text-teal-200 text-sm">Specialists</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-3xl font-bold">{dept.stats.procedures}</div>
                <div className="text-teal-200 text-sm">Annual Procedures</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
                Services Offered
              </Badge>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
                Comprehensive {dept.name} Care
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dept.services.map((service) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
                Why Choose Us
              </Badge>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
                Excellence in Every Aspect
              </h2>
              {[
                { icon: Users, title: "Expert Team", desc: `${dept.stats.specialists} board-certified specialists with international training and decades of combined experience.` },
                { icon: Award, title: "Accredited Facility", desc: "JCI-accredited department with ISO-certified processes ensuring the highest standards of patient safety." },
                { icon: Calendar, title: "Flexible Scheduling", desc: "Same-day and next-day appointments available. Online booking with instant confirmation." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Department Doctors */}
      {deptDoctors.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">
                Our {dept.name} Specialists
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Meet the dedicated physicians leading our {dept.name.toLowerCase()} department.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptDoctors.map((doctor) => (
                <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift shadow-sm group">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-teal-600 mb-3">{doctor.title}</p>
                      <Link href="/book-appointment">
                        <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 bg-teal-600">
        <div className="container text-center text-white">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Ready to Schedule Your {dept.name} Appointment?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Our patient coordinators will match you with the right specialist and find a time that works for you.
          </p>
          <Link href="/book-appointment">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 px-8">
              Book Appointment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
