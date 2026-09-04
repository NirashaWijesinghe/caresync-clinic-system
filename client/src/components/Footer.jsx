import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, ShieldCheck, Award, Clock, Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Care<span className="text-blue-500">Sync</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sri Lanka's premier healthcare and specialist consultation platform. Connecting patients with leading medical professionals with zero wait-time slot reservations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home Page</Link></li>
              <li><Link to="/doctors" className="hover:text-blue-400 transition-colors">Find Specialists</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Patient Portal</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Doctor Clinical Hub</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Clinical Wings</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/doctors" className="hover:text-blue-400 transition-colors">Cardiology & Heart Center</Link></li>
              <li><Link to="/doctors" className="hover:text-blue-400 transition-colors">Dermatology & Skin Care</Link></li>
              <li><Link to="/doctors" className="hover:text-blue-400 transition-colors">Neurology & Brain Health</Link></li>
              <li><Link to="/doctors" className="hover:text-blue-400 transition-colors">Pediatric Child Wellness</Link></li>
            </ul>
          </div>

          {/* Clinic Contact & Emergency */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>24/7 Clinic Support</span>
            </div>
            <p className="text-sm font-extrabold text-white">
              +94 11 750 2000
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>CareSync Central Complex, Colombo 07, Sri Lanka</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Clinical Wings Active & Open
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareSync Healthcare Management Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Consultation</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Patient Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}