/*
 * ApexCare Footer — Warm Medical Humanity Design
 * Dark charcoal background, teal accents, Playfair headings
 */

import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663388194215/Tiaq8dCUDMxAxyhVtLmLiZ/apexcare-logo-icon-DwoZyTpPNk2yK8uEq4NZSr.webp"
                  alt="ApexCare Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-serif font-bold text-lg leading-tight text-white">ApexCare</div>
                <div className="text-[10px] text-teal-400 font-medium tracking-wider uppercase leading-tight">Medical Centre</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-gray-400">
              A modern, multi-specialty hospital delivering advanced and compassionate care. Your health is our highest priority.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Departments", href: "/departments" },
                { label: "Our Doctors", href: "/doctors" },
                { label: "Book Appointment", href: "/book-appointment" },
                { label: "Patient Portal", href: "/patient-portal" },
                { label: "Blog & News", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  123 Healthcare Avenue,<br />
                  Medical District, Nairobi<br />
                  Kenya, 00100
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">+254 (020) 123-4567</div>
                  <div className="text-xs text-red-400 font-medium">Emergency: +1 (800) APEX-911</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">info@apexcaremedical.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <div>Mon–Fri: 7:00 AM – 8:00 PM</div>
                  <div>Sat–Sun: 8:00 AM – 5:00 PM</div>
                  <div className="text-teal-400 font-medium">Emergency: 24/7</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-5">Health Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get expert health tips, medical insights, and ApexCare news delivered to your inbox.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-teal-500"
              />
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © 2026 ApexCare Medical Centre. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-teal-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
