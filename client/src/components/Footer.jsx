import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, ShieldCheck, Award, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">CareSync</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sri Lanka's trusted smart healthcare platform connecting patients with top certified doctors and clinic management tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Specialist Directory</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Patient Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Doctor Schedule</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Top Specialties</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors" className="hover:text-white transition-colors">Cardiology & Heart Care</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Clinical Dermatology</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Neurology & Diagnostics</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Pediatrics & Child Care</Link></li>
            </ul>
          </div>

          {/* Standards / Portfolio Note */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Full-Stack Showcase</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Built with React, Node.js, Express, Tailwind CSS, and Prisma ORM. Designed for high availability & scalable healthcare appointments.
            </p>
            <div className="text-[11px] text-teal-400 font-mono">
              Status: REST API v1.0 Live
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareSync Healthcare Management System. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}