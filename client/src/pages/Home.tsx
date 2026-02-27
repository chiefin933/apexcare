/*
 * ApexCare Home Page — Warm Medical Humanity Design
 * Hero: Split-screen with generated image, bold serif heading, teal CTA
 * Sections: Stats, Departments, Doctors, Testimonials, Blog, CTA
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Heart, Brain, Baby, Bone, Scan, Siren,
  Users, Award, Building2, Stethoscope,
  ArrowRight, Star, ChevronRight, Calendar, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { departments, doctors, testimonials, blogPosts, stats } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Heart, Brain, Baby, Bone, Scan, Siren, Users, Award, Building2, Stethoscope
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <Layout>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50 min-h-[90vh] flex items-center">
        {/* Background blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/40 blob-shape -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-100/30 blob-shape translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
            {/* Text Content */}
            <div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
              >
                <Badge className="mb-5 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs font-medium tracking-wide uppercase">
                  Multi-Specialty Medical Centre
                </Badge>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
                className="font-serif text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Advanced Care,{" "}
                <span className="gradient-text">Human Heart</span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
                className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg"
              >
                ApexCare Medical Centre brings together world-class specialists and cutting-edge technology to deliver compassionate, patient-centered healthcare for every stage of life.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
                className="flex flex-wrap gap-4"
              >
                <Link href="/book-appointment">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200 px-8">
                    Book Appointment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/departments">
                  <Button size="lg" variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 px-8">
                    Explore Departments
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={4}
                className="mt-10 flex flex-wrap gap-6"
              >
                {[
                  { icon: "🏆", label: "JCI Accredited" },
                  { icon: "⭐", label: "4.9/5 Patient Rating" },
                  { icon: "🕐", label: "24/7 Emergency" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-base">{badge.icon}</span>
                    <span className="font-medium">{badge.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-200/50">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663388194215/Tiaq8dCUDMxAxyhVtLmLiZ/apexcare-hero-aoBekxHy27bQqbhwy3MwjD.webp"
                  alt="ApexCare Medical Centre — Expert Doctor"
                  className="w-full h-[520px] object-cover"
                />
                {/* Floating card */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-600">Accepting Patients</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Dr. Amara Osei</div>
                  <div className="text-xs text-gray-500">Chief of Cardiology</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">4.9</span>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-60 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-100 rounded-full opacity-60 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="bg-teal-600 py-14">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = iconMap[stat.icon];
              return (
                <motion.div
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="text-center text-white"
                >
                  {Icon && <Icon className="w-7 h-7 mx-auto mb-3 text-teal-200" />}
                  <div className="font-serif text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-teal-100 text-sm font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Departments Section ── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
              Our Specialties
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              World-Class Departments
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              From routine check-ups to complex surgical procedures, our specialized departments are equipped with the latest technology and staffed by leading experts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => {
              const Icon = iconMap[dept.icon];
              return (
                <motion.div
                  key={dept.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i * 0.5}
                >
                  <Link href={`/departments/${dept.id}`}>
                    <div className={`group rounded-2xl border p-6 card-lift cursor-pointer ${dept.color} bg-opacity-30`}>
                      <div className={`w-12 h-12 rounded-xl ${dept.iconBg} flex items-center justify-center mb-4`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <h3 className="font-serif font-semibold text-lg text-gray-900 mb-1">{dept.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{dept.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span>{dept.stats.specialists} specialists</span>
                          <span>·</span>
                          <span>{dept.stats.patients} patients</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/departments">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                View All Departments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── About / Mission Section ── */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663388194215/Tiaq8dCUDMxAxyhVtLmLiZ/apexcare-about-mfvJXToyrnZFpJ3n5jJBuH.webp"
                  alt="ApexCare Medical Team"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-lg">
                <div className="text-3xl font-serif font-bold text-teal-600 mb-1">25+</div>
                <div className="text-sm text-gray-600 font-medium">Years of Excellence</div>
                <div className="text-xs text-gray-400 mt-1">Serving our community</div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
                About ApexCare
              </Badge>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Compassionate Care,<br />
                <em className="not-italic text-teal-600">Exceptional Outcomes</em>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Founded in 2001, ApexCare Medical Centre has grown from a community clinic into a leading multi-specialty hospital serving over 50,000 patients annually. Our mission is simple: deliver the highest standard of medical care with genuine human compassion.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our team of 120+ specialists across 18 departments combines decades of clinical expertise with the latest medical technology, ensuring every patient receives personalized, evidence-based treatment.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "JCI Accredited Facility", icon: "🏆" },
                  { label: "ISO 9001:2015 Certified", icon: "✅" },
                  { label: "HIPAA Compliant Systems", icon: "🔒" },
                  { label: "24/7 Emergency Services", icon: "🚑" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/about">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Doctors Section ── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
              Our Specialists
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              Our physicians are leaders in their fields, bringing international training and genuine dedication to every patient encounter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {doctors.slice(0, 3).map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i * 0.5}
              >
                <Link href={`/doctors/${doctor.id}`}>
                  <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift shadow-sm hover:shadow-teal-100/50">
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="pill-tag bg-teal-500/90 text-white text-xs mb-1">
                          {doctor.departmentName}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-semibold text-lg text-gray-900 mb-0.5">{doctor.name}</h3>
                      <p className="text-sm text-teal-600 font-medium mb-3">{doctor.title}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{doctor.experience} yrs experience</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-gray-700">{doctor.rating}</span>
                          <span>({doctor.reviews})</span>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap mb-4">
                        {doctor.availability.slice(0, 4).map((day) => (
                          <span key={day} className="pill-tag bg-teal-50 text-teal-600 text-xs">
                            {day}
                          </span>
                        ))}
                      </div>
                      <Link href="/book-appointment">
                        <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/doctors">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                View All Doctors
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Appointment CTA Banner ── */}
      <section className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663388194215/Tiaq8dCUDMxAxyhVtLmLiZ/apexcare-appointment-jT4yh95JDeaakFM4FoViyT.webp)` }}
        />
        <div className="absolute inset-0 bg-teal-900/80" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="font-serif text-4xl font-bold mb-4">
              Ready to Take Charge of Your Health?
            </h2>
            <p className="text-teal-100 text-lg mb-8 leading-relaxed">
              Schedule an appointment with one of our specialists today. Same-day appointments available for urgent cases.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 px-8 shadow-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:+18009739911">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
                  Call Us Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
              Patient Stories
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              Real stories from real patients whose lives have been touched by the care they received at ApexCare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i * 0.3}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 card-lift"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-6 italic font-serif">
                  "{t.text}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role} · {t.department}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="pill-tag bg-teal-50 text-teal-600 text-xs">{t.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Section ── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 text-xs uppercase tracking-wide">
                Medical Insights
              </Badge>
              <h2 className="font-serif text-4xl font-bold text-gray-900">
                Health & Wellness Blog
              </h2>
            </div>
            <Link href="/blog" className="hidden sm:block">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i * 0.3}
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="group rounded-2xl overflow-hidden border border-gray-100 card-lift bg-white shadow-sm">
                    <div className="overflow-hidden h-44">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="pill-tag bg-teal-50 text-teal-600 text-xs mb-3">
                        {post.category}
                      </span>
                      <h3 className="font-serif font-semibold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
