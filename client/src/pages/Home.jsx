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
  Heart,
  Baby,
  Brain,
  Bone,
  Eye,
  FileText,
  Zap
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
      {/* 1. Clean Hospital Hero Section */}
      <section className="hero-clean-bg pt-12 pb-20 lg:pt-18 lg:pb-28 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sri Lanka's Certified Doctor Consultation Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Find & Book Top Doctors. <br />
                <span className="text-blue-600">Zero Clinic Waiting Time.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with board-certified medical specialists. Book guaranteed 30-minute consultation slots, receive digital prescriptions, and manage healthcare records effortlessly.
              </p>

              {/* Large Pristine Search Box */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 bg-white p-2.5 rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 flex items-center px-3 gap-2.5">
                  <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search doctor name, specialty, or clinic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Find Doctors
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trust Checkmarks */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Board-Certified Consultants
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Instant 30-Min Slot Booking
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Official E-Prescriptions
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                <div className="relative rounded-2xl overflow-hidden mb-6 h-64 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                    alt="CareSync Clinic"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500 text-white inline-block">
                      CareSync Central Hospital
                    </span>
                    <h3 className="font-bold text-lg leading-tight mt-1.5">
                      Multi-Specialty Clinical Network
                    </h3>
                  </div>
                </div>

                {/* Metric Summary Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Daily Slots</span>
                      <span className="text-base font-extrabold text-slate-900">100% Realtime</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
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
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Specialized Care
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Consult Top Clinical Disciplines
          </h2>
          <p className="text-sm text-slate-500">
            Choose from comprehensive clinical specialties managed by Sri Lanka's leading medical consultants.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              to={`/doctors?specialty=${spec.id}`}
              className="clinic-card p-6 text-center group flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {spec.name}
              </h3>
              <span className="text-xs text-slate-400 mt-1 font-medium">
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
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Verified Doctors
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Top Rated Specialists
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

      {/* 4. How CareSync Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How CareSync Works
            </h2>
            <p className="text-slate-300 text-sm">
              Experience a streamlined 3-step consultation workflow designed to eradicate clinic queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-lg text-white">Find Your Specialist</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter by clinical specialty, doctor qualifications, hospital location, and patient reviews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-lg text-white">Select a 30-Min Slot</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose an available consultation slot generated directly from the doctor's live schedule.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-lg text-white">Get E-Prescription</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive diagnosis notes, dosage instructions, and official digital prescriptions in your portal.
              </p>
            </div>
          </div>
        </div>
      </section>

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