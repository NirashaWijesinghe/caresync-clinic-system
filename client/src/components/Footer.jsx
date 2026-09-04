import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, ShieldCheck, PhoneCall, Clock, MapPin, Mail, Award, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-12 border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-5 md:col-span-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Care<span className="text-teal-400">Sync</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sri Lanka's advanced digital healthcare platform connecting patients with certified medical specialists, intelligent consultation scheduling, and real-time electronic prescriptions.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-teal-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> ISO 27001 Certified Security
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-blue-400">
                <Award className="w-3.5 h-3.5" /> Verified Specialists
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-slate-200">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/doctors" className="text-slate-400 hover:text-white transition-colors">Find Doctors</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Patient Portal</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Clinical Disciplines */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-slate-200">Specialties</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/doctors?specialty=Cardiology" className="text-slate-400 hover:text-teal-400 transition-colors">Cardiology & Heart</Link></li>
              <li><Link to="/doctors?specialty=Dermatology" className="text-slate-400 hover:text-teal-400 transition-colors">Clinical Dermatology</Link></li>
              <li><Link to="/doctors?specialty=Neurology" className="text-slate-400 hover:text-teal-400 transition-colors">Neurology & Diagnostics</Link></li>
              <li><Link to="/doctors?specialty=Pediatrics" className="text-slate-400 hover:text-teal-400 transition-colors">Pediatrics & Child Care</Link></li>
            </ul>
          </div>

          {/* 24/7 Clinical Hotline */}
          <div className="md:col-span-3">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">24/7 Emergency & Inquiries</span>
                  <span className="text-base font-bold text-white tracking-wide">+94 (011) 234-5678</span>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>CareSync Central Wing, Colombo 03</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span>support@caresync.lk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareSync Healthcare Management System. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">HIPAA Compliance</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}