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
  HeartHandshake
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

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Next-Gen Healthcare & Clinic Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Doctor Booking & Clinical Excellence.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CareSync seamlessly connects patients with verified Sri Lankan medical specialists. Schedule real-time time slots, manage digital prescriptions, and streamline clinic workflows.
              </p>

              {/* Hero Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 bg-white p-2 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-3 gap-2">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search doctor, hospital or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-medium text-slate-800 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  Find Doctors
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Specialists
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Slot Engine
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> E-Prescriptions
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
                <div className="relative rounded-2xl overflow-hidden mb-6 h-64">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                    alt="CareSync Clinic"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/90 text-white backdrop-blur-sm">
                      CareSync Central Hub
                    </span>
                    <h3 className="font-bold text-lg leading-tight mt-1">Multi-Specialty Clinical Network</h3>
                  </div>
                </div>

                {/* Floating Micro-Card */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Today's Slots</span>
                      <span className="text-base font-extrabold text-slate-900">100% Live</span>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Doctor Rating</span>
                      <span className="text-base font-extrabold text-slate-900">4.9 / 5.0</span>
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
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase">
            Specialized Care
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Consult Top Medical Disciplines
          </h2>
          <p className="text-sm text-slate-500">
            Choose from comprehensive clinical specialties managed by Sri Lanka's leading medical practitioners.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              to={`/doctors?specialty=${spec.id}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-400 hover:-translate-y-1 transition-all text-center group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {spec.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1">
                {spec._count?.doctors || 1} Specialists
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Doctors Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase">
              Certified Specialists
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Top Rated Clinical Consultants
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            View All Doctors
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
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
    </div>
  );
}