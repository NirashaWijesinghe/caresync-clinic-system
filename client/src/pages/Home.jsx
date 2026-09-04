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
  ChevronRight
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
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section with Glowing Mesh */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 hero-mesh border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-extrabold tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Next-Gen Healthcare & Clinic Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Smart Specialist Booking. <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  Zero Queue Waiting.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CareSync connects patients directly with certified medical consultants across Sri Lanka. Experience dynamic 30-minute time-slot bookings, instant E-prescriptions, and continuous clinical records.
              </p>

              {/* Hero Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 bg-white p-2.5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row gap-2.5"
              >
                <div className="flex-1 flex items-center px-3.5 gap-3">
                  <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search specialist by name, specialty, or clinic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3.5 px-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 hover:gap-3"
                >
                  Find Doctors
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Board-Certified Doctors
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Dynamic 30-Min Slots
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Secure E-Prescriptions
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl shadow-slate-300/50 border border-slate-200/80">
                <div className="relative rounded-2xl overflow-hidden mb-6 h-64">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                    alt="CareSync Clinic"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500/90 text-white backdrop-blur-md inline-block shadow-sm">
                      CareSync Central Hospital
                    </span>
                    <h3 className="font-bold text-lg leading-tight mt-1.5">
                      Advanced Medical & Clinical Network
                    </h3>
                  </div>
                </div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/30">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Daily Slots</span>
                      <span className="text-base font-extrabold text-slate-900">100% Realtime</span>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-100 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm shadow-teal-500/30">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Doctor Rating</span>
                      <span className="text-base font-extrabold text-slate-900">4.9 / 5.0 ★</span>
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
          <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Specialized Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consult Top Clinical Disciplines
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Explore verified specialists across departments, review doctor credentials, and book consultation sessions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              to={`/doctors?specialty=${spec.id}`}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 text-center group flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-teal-500 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-3.5 shadow-xs">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {spec.name}
              </h3>
              <span className="text-xs text-slate-400 mt-1 font-medium">
                {spec._count?.doctors || 1} Consultants
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Doctors Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Verified Medical Panel
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Top Rated Clinical Specialists
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group px-4 py-2 rounded-xl hover:bg-blue-50 transition-all"
          >
            Explore All Doctors
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* 4. Why CareSync Platform Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mb-12 space-y-3 relative">
            <span className="text-xs font-extrabold text-teal-400 tracking-wider uppercase">
              Clinical Quality & Convenience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Patients & Clinics Choose CareSync
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Engineered with advanced scheduling algorithms and role-based workflows to eradicate clinic waiting rooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Dynamic Slot Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Guaranteed 30-minute consultation intervals calculated in real-time from doctor working hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Digital E-Prescriptions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consultants issue structured digital medical records and prescriptions accessible anytime.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Verified Consultants</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Only credentialed doctors with hospital affiliations are approved onto the CareSync medical panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking Modal */}
      {selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
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