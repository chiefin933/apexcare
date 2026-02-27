/*
 * ApexCare Navbar — Warm Medical Humanity Design
 * Glass-effect top bar, teal primary, emergency banner
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Departments",
    href: "/departments",
    children: [
      { label: "Cardiology", href: "/departments/cardiology" },
      { label: "Neurology", href: "/departments/neurology" },
      { label: "Pediatrics", href: "/departments/pediatrics" },
      { label: "Orthopedics", href: "/departments/orthopedics" },
      { label: "Radiology", href: "/departments/radiology" },
      { label: "Emergency", href: "/departments/emergency" },
    ]
  },
  { label: "Doctors", href: "/doctors" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-medium emergency-pulse">
        <span className="inline-flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" />
          <strong>Emergency Hotline:</strong> +1 (800) APEX-911 — Available 24/7
          <span className="hidden sm:inline mx-2">|</span>
          <span className="hidden sm:inline">Walk-in Emergency: Open Around the Clock</span>
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-teal-100"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663388194215/Tiaq8dCUDMxAxyhVtLmLiZ/apexcare-logo-icon-DwoZyTpPNk2yK8uEq4NZSr.webp"
                    alt="ApexCare Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg leading-tight text-gray-900 group-hover:text-teal-600 transition-colors">
                    ApexCare
                  </div>
                  <div className="text-[10px] text-teal-600 font-medium tracking-wider uppercase leading-tight">
                    Medical Centre
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.startsWith(link.href)
                          ? "text-teal-600 bg-teal-50"
                          : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.label ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-teal-100 py-1.5 overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <Link key={child.href} href={child.href}>
                              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                                {child.label}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location === link.href
                          ? "text-teal-600 bg-teal-50"
                          : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                      }`}
                    >
                      {link.label}
                    </div>
                  </Link>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/patient-portal">
                <Button variant="outline" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                  Patient Portal
                </Button>
              </Link>
              <Link href="/book-appointment">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                  Book Appointment
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-teal-50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-teal-100 bg-white overflow-hidden"
            >
              <div className="container py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link href={link.href}>
                      <div className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        location === link.href
                          ? "text-teal-600 bg-teal-50"
                          : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                      }`}>
                        {link.label}
                      </div>
                    </Link>
                    {link.children && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href}>
                            <div className="px-4 py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                              {child.label}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-3 flex flex-col gap-2">
                  <Link href="/patient-portal">
                    <Button variant="outline" className="w-full border-teal-200 text-teal-700">
                      Patient Portal
                    </Button>
                  </Link>
                  <Link href="/book-appointment">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
