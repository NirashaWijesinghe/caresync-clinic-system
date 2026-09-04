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
  MessageSquare
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
        <div className="h-96 bg-slate-100 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Doctor not found</h2>
        <Link to="/doctors" className="text-blue-600 text-sm mt-2 block">
          Back to Specialists
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={doctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
            alt={doctor.user?.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || 'Doctor')}&background=0D8ABC&color=fff&bold=true`;
            }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
          />
          <div className="flex-1 space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {doctor.specialty?.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {doctor.user?.name}
            </h1>
            <p className="text-sm font-medium text-slate-600">{doctor.qualifications}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
              <span className="flex items-center text-amber-500 font-bold gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400" />
                {doctor.rating?.toFixed(1) || "4.8"} ({doctor.reviews?.length || 0} reviews)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Award className="w-4 h-4 text-blue-600" />
                {doctor.experienceYears}+ Years Clinical Experience
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {doctor.hospital}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto text-right sm:text-right flex sm:flex-col justify-between items-center sm:items-end pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Consultation Fee</span>
              <span className="text-2xl font-extrabold text-slate-900">
                LKR {doctor.consultationFee?.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-blue-500/25 transition-all"
            >
              Book Consultation
            </button>
          </div>
        </div>

        {/* Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Working Days</span>
            <p className="font-semibold text-slate-800">{doctor.workingDays}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Clinic Hours</span>
            <p className="font-semibold text-slate-800">
              {doctor.startTime} to {doctor.endTime}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Slot Duration</span>
            <p className="font-semibold text-slate-800">{doctor.slotDurationMinutes} Minutes per Patient</p>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Doctor Biography & Expertise</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
      </div>

      {/* Patient Reviews */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Patient Feedback & Reviews
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {doctor.reviews?.length || 0} Verified Reviews
          </span>
        </div>

        <div className="space-y-4">
          {doctor.reviews?.length > 0 ? (
            doctor.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"}
                      alt={rev.patient?.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-bold text-xs text-slate-800">{rev.patient?.name}</span>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">No reviews yet for this consultant.</p>
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