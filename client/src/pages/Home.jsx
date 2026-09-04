import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import DoctorCard from "../components/DoctorCard";
import AppointmentModal from "../components/AppointmentModal";
import {
  HeartPulse,
  Search,
  CalendarCheck,
  ShieldCheck,
  Award,
  Users,
  Clock,
  ArrowRight,
  Activity,
  Sparkles,
  Stethoscope,
  CheckCircle2,
  HeartHandshake,
  Star,
  FileText,
  Zap,
  ChevronRight,
  SlidersHorizontal,
  Bell,
  Check,
  TrendingUp
} from "lucide-react";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [showLiveBookingToast, setShowLiveBookingToast] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
    // Simulate interactive modern live booking notification
    const timer = setTimeout(() => {
      setShowLiveBookingToast(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const fetchHomeData = async () => {
    try {
      const [docRes, specRes] = await Promise.all([
        API.get("/doctors"),
        API.get("/doctors/specialties")
      ]);
      setDoctors(docRes.data.doctors?.slice(0, 4) || []);
      setSpecialties(specRes.data.specialties || []);
    } catch (err) {
      console.error("Failed to load home data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/doctors");
    }
  };

  return (
    <div className="space-y-28 pb-28 aurora-bg">
      {/* 1. Hero Section with Aurora Ambient Glow */}
      <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-7">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/90 text-slate-800 text-xs font-bold shadow-xs backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent font-extrabold">
                CareSync 2.0
              </span>
              <span className="text-slate-400 font-normal">|</span>
              <span>Intelligent Clinic & Doctor Scheduling</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              Healthcare, engineered for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                zero waiting time.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Book guaranteed 30-minute consultation slots with Sri Lanka’s certified specialists. Access digital prescriptions and medical records in real-time.
            </p>

            {/* Ultra-Modern Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto bg-white/90 backdrop-blur-xl p-2.5 rounded-full shadow-2xl shadow-blue-500/10 border border-slate-200/90 flex flex-col sm:flex-row gap-2 items-center"
            >
              <div className="flex-1 flex items-center px-4 gap-3 w-full">
                <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search doctor name, hospital, or specialty (e.g. Cardiology)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto py-3.5 px-8 bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Explore Doctors
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick Specialty Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-semibold text-slate-500">
              <span className="text-slate-400">Popular:</span>
              {["Cardiology", "Dermatology", "Neurology", "Pediatrics"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/doctors?search=${tag}`)}
                  className="px-3 py-1 rounded-full bg-white/60 hover:bg-white border border-slate-200/80 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all shadow-2xs text-[11px]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Live Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">15,000+</span>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed Consultations</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100">
            <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              30 Min
            </span>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Guaranteed Slot Duration</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">99.8%</span>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">On-Time Doctor Punctuality</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-500 tracking-tight">4.9 ★</span>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Patient Trust Rating</p>
          </div>
        </div>
      </section>

      {/* 3. 2026 Bento Grid Feature Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Engineered For Precision
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Next-Gen Healthcare Architecture
          </h2>
          <p className="text-sm text-slate-500">
            CareSync replaces chaotic clinic queues with mathematical time-slot algorithms and role-based medical workflows.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Large Slot Engine Bento */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-8 flex flex-col justify-between bg-gradient-to-br from-white via-white to-blue-50/40">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Dynamic Slot Engine</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                Algorithmic scheduling engine calculates real-time 30-minute intervals based on doctor working hours and automatically locks confirmed slots to prevent double-booking.
              </p>
            </div>

            {/* Interactive Timeline Visual Preview */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-3">
                <span>Doctor Schedule Timeline</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Conflict Avoidance
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400 text-center text-xs font-semibold line-through">09:00 AM</div>
                <div className="p-2.5 rounded-xl bg-blue-600 text-white text-center text-xs font-bold shadow-xs">09:30 AM</div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-center text-xs font-bold">10:00 AM</div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-center text-xs font-bold">10:30 AM</div>
              </div>
            </div>
          </div>

          {/* Card 2: Digital E-Prescriptions */}
          <div className="md:col-span-1 lg:col-span-2 bento-card p-8 flex flex-col justify-between bg-gradient-to-br from-white via-white to-teal-50/40">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Digital E-Prescriptions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Consultants issue diagnosis summaries and medication instructions directly into the patient portal with digital authentication.
              </p>
            </div>

            {/* Prescription Preview Badge */}
            <div className="mt-8 p-4 bg-teal-900 text-white rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-300">Prescription #CS-9842</span>
                <span className="text-[10px] bg-teal-800 px-2 py-0.5 rounded text-teal-200">Verified MD</span>
              </div>
              <p className="text-xs font-mono text-slate-200">Rx: Amoxicillin 500mg • 1 Tab TID x 5 Days</p>
            </div>
          </div>

          {/* Card 3: Role-Based Access Control */}
          <div className="bento-card p-6 space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Multi-Tier RBAC</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dedicated portals with JWT session isolation for Patients, Doctors, and Super Administrators.
            </p>
          </div>

          {/* Card 4: Verified Doctor Onboarding */}
          <div className="bento-card p-6 space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">SLMC Certified</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every consulting doctor is vetted with verified hospital affiliations and clinical credentials.
            </p>
          </div>

          {/* Card 5: Real-time Analytics */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-6 space-y-3 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Clinic Analytics Portal</h4>
                  <p className="text-xs text-slate-400">Executive revenue and patient volume tracking</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Live Feeds
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 w-1/2 h-full"></div>
              <div className="bg-teal-500 w-1/3 h-full"></div>
              <div className="bg-indigo-500 w-1/6 h-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Medical Specialties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Clinical Disciplines
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Browse by Medical Specialty
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            All Specialties ({specialties.length})
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              to={`/doctors?specialty=${spec.id}`}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 text-center group flex flex-col items-center justify-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 group-hover:from-blue-600 group-hover:to-teal-500 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-3 shadow-xs">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {spec.name}
              </h3>
              <span className="text-xs text-slate-400 mt-1 font-medium">
                {spec._count?.doctors || 1} Doctors
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Doctors Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Verified Medical Panel
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Clinical Consultants
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-extrabold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            View All Doctors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-88 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookNow={(doc) => setSelectedDoctorForBooking(doc)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. High-Converting Modern CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="dark-aurora rounded-3xl p-10 sm:p-16 text-white text-center relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-teal-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Appointment Confirmation</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to schedule your <br />
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                specialist consultation?
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Join thousands of Sri Lankan patients enjoying frictionless, zero-queue healthcare appointments.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/doctors"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-extrabold text-sm rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
              >
                Find & Book Specialist Now
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full backdrop-blur-md border border-white/20 transition-all"
              >
                Create Patient Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Live Social Proof Toast */}
      {showLiveBookingToast && (
        <div className="fixed bottom-6 left-6 z-40 bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl border border-slate-200/90 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-500 max-w-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900 leading-tight">
              Kasun P. <span className="font-normal text-slate-500">just booked</span> Dr. Sarah
            </p>
            <span className="text-[10px] text-slate-400">Cardiology • 2 mins ago in Colombo</span>
          </div>
          <button
            onClick={() => setShowLiveBookingToast(false)}
            className="text-slate-400 hover:text-slate-600 text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
          isOpen={!!selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onSuccess={() => {
            setSelectedDoctorForBooking(null);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
}