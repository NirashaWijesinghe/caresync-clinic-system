import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Star, MapPin, Calendar, Clock, ArrowRight, Award, ShieldCheck, Stethoscope } from "lucide-react";

export default function DoctorCard({ doctor, onBookNow }) {
  const { user } = useAuth();

  const isOwnDoctorProfile =
    user?.role === "DOCTOR" &&
    (user?.id === doctor.userId || user?.id === doctor.user?.id);
  const isDoctor = user?.role === "DOCTOR";
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="clinic-card overflow-hidden flex flex-col group">
      <div className="p-6 flex-1 flex flex-col">
        {/* Top Doctor Info */}
        <div className="flex gap-4 items-start">
          <div className="relative flex-shrink-0">
            <img
              src={doctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
              alt={doctor.user?.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || 'Doctor')}&background=2563eb&color=fff&bold=true`;
              }}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-300 transition-all shadow-xs"
            />
            <span
              className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-2xs"
              title="Active & Verified Consultant"
            ></span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 mb-1 border border-blue-100">
              {doctor.specialty?.name || "Specialist"}
            </span>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {doctor.user?.name}
            </h3>
            <p className="text-xs text-slate-500 truncate font-medium">{doctor.qualifications}</p>

            <div className="flex items-center gap-2.5 mt-2 text-xs">
              <span className="flex items-center text-amber-600 font-bold gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {doctor.rating?.toFixed(1) || "4.8"}
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                {doctor.experienceYears}+ yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-500 mt-4 line-clamp-2 leading-relaxed flex-1 font-normal">
          {doctor.bio}
        </p>

        {/* Clinic & Schedule Specs */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="truncate font-medium">{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="font-medium">
              {doctor.startTime} - {doctor.endTime} ({doctor.slotDurationMinutes} min slots)
            </span>
          </div>
        </div>
      </div>

      {/* Footer Fee & Action */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Fee</span>
          <span className="text-base font-extrabold text-slate-900">
            LKR {doctor.consultationFee?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-white transition-colors"
          >
            Profile
          </Link>

          {isOwnDoctorProfile ? (
            <Link
              to="/doctor/dashboard"
              className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              My Queue
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : isDoctor ? (
            <Link
              to={`/doctors/${doctor.id}`}
              className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
            >
              View Info
            </Link>
          ) : isAdmin ? (
            <Link
              to="/admin"
              className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              Manage
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : !doctor.isActive ? (
            <button
              disabled
              className="text-xs font-bold text-slate-400 bg-slate-100 px-3.5 py-2 rounded-xl cursor-not-allowed border border-slate-200"
              title="This doctor is temporarily on leave or unavailable for appointments."
            >
              On Leave
            </button>
          ) : (
            <button
              onClick={() => onBookNow ? onBookNow(doctor) : null}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-all group-hover:shadow-sm"
            >
              Book Slot
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}