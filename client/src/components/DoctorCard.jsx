import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, ArrowRight, Award, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function DoctorCard({ doctor, onBookNow }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-300/80 transition-all duration-300 flex flex-col group hover:-translate-y-1 relative">
      {/* Top Banner Accent */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Top Doctor Info */}
        <div className="flex gap-4 items-start">
          <div className="relative flex-shrink-0">
            <img
              src={doctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
              alt={doctor.user?.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || 'Doctor')}&background=0D8ABC&color=fff&bold=true`;
              }}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-400/80 transition-all shadow-md group-hover:scale-102"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white" title="Verified & Active">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {doctor.specialty?.name || "Specialist"}
              </span>
            </div>
            
            <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {doctor.user?.name}
            </h3>
            <p className="text-xs text-slate-500 truncate font-medium">{doctor.qualifications}</p>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center text-amber-600 font-bold gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {doctor.rating?.toFixed(1) || "4.9"}
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-lg">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                {doctor.experienceYears}+ yrs
              </span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-500 mt-4 line-clamp-2 leading-relaxed flex-1">
          {doctor.bio}
        </p>

        {/* Clinic & Schedule Specs */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
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
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Fee</span>
          <span className="text-base font-extrabold text-slate-900 tracking-tight">
            LKR {doctor.consultationFee?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-white transition-all border border-transparent hover:border-slate-200"
          >
            Profile
          </Link>
          <button
            onClick={() => onBookNow ? onBookNow(doctor) : null}
            className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/35 active:scale-95"
          >
            <span>Book Slot</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}