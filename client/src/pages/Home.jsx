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
  FileText,
  Lock,
  Zap,
  PhoneCall,
  Star
} from "lucide-react";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
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
      console.error(err);
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

  const specialtyIcons = {
    Cardiology: "❤️",
    Dermatology: "✨",
    Neurology: "🧠",
    Pediatrics: "🧸",
    Orthopedics: "🦴",
    "General Medicine": "🩺"
  };

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/20 to-teal-400/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-700 text-xs font-extrabold tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Next-Gen Smart Healthcare Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Seamless Doctor Booking &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600">
                  Digital Healthcare.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CareSync empowers patients to connect with board-certified medical specialists, reserve conflict-free dynamic 30-minute consultation slots, and receive instant digital prescriptions.
              </p>

              {/* Hero Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 glass-panel p-2.5 rounded-3xl shadow-xl border border-slate-200/90 flex flex-col sm:flex-row gap-2.5">
                <div className="flex-1 flex items-center px-4 gap-3">
                  <Search className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search specialist name, department, or hospital..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3.5 px-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  SLMC Verified Specialists
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Instant Dynamic Slot Engine
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  HIPAA-Grade Security
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3.5xl p-6 shadow-2xl border border-slate-200/80 group">
                <div className="relative rounded-3xl overflow-hidden mb-6 h-72 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                    alt="CareSync Clinic Hub"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-teal-500/90 text-white backdrop-blur-md">
                      <HeartPulse className="w-3.5 h-3.5" /> CareSync Prime Care
                    </span>
                    <h3 className="font-extrabold text-xl leading-tight text-white">Central Medical Campus</h3>
                    <p className="text-xs text-slate-200 font-medium">Colombo 03 • 24/7 Outpatient Wing</p>
                  </div>
                </div>

                {/* Floating Metrics */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2.5xl border border-blue-100/90 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Live Slots</span>
                      <span className="text-base font-black text-slate-900">Available</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50/60 rounded-2.5xl border border-teal-100/90 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
                      <Star className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Rating</span>
                      <span className="text-base font-black text-slate-900">4.9 / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Medical Specialties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Specialized Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Consult Top Medical Disciplines
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-normal">
            Choose from comprehensive clinical departments managed by Sri Lanka's leading certified consultants.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              to={`/doctors?specialty=${spec.id}`}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 text-center group flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-3.5 shadow-xs group-hover:shadow-lg group-hover:shadow-blue-500/30 text-2xl">
                <span>{specialtyIcons[spec.name] || "🩺"}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {spec.name}
              </h3>
              <span className="text-[11px] font-bold text-slate-400 mt-1">
                {spec._count?.doctors || 1} Consultants
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Doctors Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-teal-600 tracking-widest uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Verified Doctors
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Top Rated Specialists
            </h2>
            <p className="text-xs text-slate-500">Book your 30-minute consultation slot in real time</p>
          </div>
          <Link
            to="/doctors"
            className="text-sm font-extrabold text-white bg-slate-900 hover:bg-blue-600 px-5 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-2 group"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
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

      {/* 4. Why CareSync Feature Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3.5xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-extrabold text-teal-400 tracking-widest uppercase bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Clinical Quality
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Patients & Doctors Choose CareSync
            </h2>
            <p className="text-sm text-slate-400">
              Modern engineering designed to eliminate clinic queue bottlenecks and streamline digital health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4 hover:border-teal-500/60 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Dynamic 30-Min Slot Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart scheduling algorithm computes consultation slots based on consultant operating hours and prevents double bookings in real time.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4 hover:border-blue-500/60 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Digital E-Prescriptions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Doctors issue structured dosage instructions and diagnosis summaries directly to patient medical portals for anytime download.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4 hover:border-indigo-500/60 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Executive Clinical Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time clinic administration KPIs, departmental patient volume, and revenue trend graphs powered by Recharts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal Trigger */}
      {selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
          isOpen={!!selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onSuccess={() => fetchHomeData()}
        />
      )}
    </div>
  );
}