import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import AppointmentModal from "../components/AppointmentModal";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  Stethoscope,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const res = await API.get(`/doctors/${id}`);
      setDoctor(res.data.doctor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-96 bg-slate-100 rounded-3.5xl animate-pulse"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Specialist Not Found</h2>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          <span>Return to Specialist Directory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3.5xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-8 relative overflow-hidden">
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500"></div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
              <img
                src={doctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
                alt={doctor.user?.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || 'Doctor')}&background=0D8ABC&color=fff&bold=true`;
                }}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-blue-500/15 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white" title="Verified Specialist">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-2.5">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {doctor.specialty?.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {doctor.user?.name}
              </h1>
              <p className="text-sm font-semibold text-slate-600">{doctor.qualifications}</p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center text-amber-600 font-bold gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  {doctor.rating?.toFixed(1) || "4.9"} ({doctor.reviews?.length || 0} reviews)
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
                  <Award className="w-4 h-4 text-blue-600" />
                  {doctor.experienceYears}+ Years Clinical Experience
                </span>
              </div>
            </div>
          </div>

          {/* Quick Booking CTA Box */}
          <div className="w-full md:w-auto p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl border border-slate-200/80 flex md:flex-col justify-between items-center md:items-end gap-4 min-w-[200px]">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Consultation Fee</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                LKR {doctor.consultationFee?.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 active:scale-98"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Working Hours Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-xs">
          <div className="p-4 bg-slate-50/70 rounded-2xl space-y-1 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Clinic Location</span>
            <p className="font-bold text-slate-800 truncate flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {doctor.hospital}
            </p>
          </div>
          <div className="p-4 bg-slate-50/70 rounded-2xl space-y-1 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Consultation Schedule</span>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
              {doctor.startTime} - {doctor.endTime} ({doctor.slotDurationMinutes} min slots)
            </p>
          </div>
          <div className="p-4 bg-slate-50/70 rounded-2xl space-y-1 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Working Days</span>
            <p className="font-bold text-slate-800 truncate flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              {doctor.workingDays}
            </p>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-3.5xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-black text-xl text-slate-900 tracking-tight">Doctor Biography & Clinical Expertise</h3>
        <p className="text-sm text-slate-600 leading-relaxed font-normal">{doctor.bio}</p>
      </div>

      {/* Patient Reviews */}
      <div className="bg-white rounded-3.5xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-black text-xl text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Patient Feedback & Verified Reviews
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {doctor.reviews?.length || 0} Reviews
          </span>
        </div>

        <div className="space-y-4">
          {doctor.reviews?.length > 0 ? (
            doctor.reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2.5xl bg-slate-50/60 border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.patient?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.patient?.name || 'Patient')}&background=0D8ABC&color=fff&bold=true`}
                      alt={rev.patient?.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.patient?.name || 'Patient')}&background=0D8ABC&color=fff&bold=true`;
                      }}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                    />
                    <span className="font-bold text-xs text-slate-800">{rev.patient?.name}</span>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-11">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No patient reviews submitted yet for this consultant.</p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <AppointmentModal
          doctor={doctor}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => fetchDoctor()}
        />
      )}
    </div>
  );
}