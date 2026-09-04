import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Calendar, Clock, ArrowRight, Award } from "lucide-react";

export default function DoctorCard({ doctor, onBookNow }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group">
      <div className="p-6 flex-1 flex flex-col">
        {/* Top Doctor Info */}
        <div className="flex gap-4 items-start">
          <div className="relative">
            <img
              src={doctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
              alt={doctor.user?.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || 'Doctor')}&background=0D8ABC&color=fff&bold=true`;
              }}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition-all shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" title="Active"></span>
          </div>

          <div className="flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-1 border border-blue-100">
              {doctor.specialty?.name || "Specialist"}
            </span>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {doctor.user?.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">{doctor.qualifications}</p>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center text-amber-500 font-bold gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {doctor.rating?.toFixed(1) || "4.8"}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                {doctor.experienceYears}+ yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-500 mt-4 line-clamp-2 leading-relaxed flex-1">
          {doctor.bio}
        </p>

        {/* Clinic & Schedule Specs */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
            <span>
              {doctor.startTime} - {doctor.endTime} ({doctor.slotDurationMinutes} min slots)
            </span>
          </div>
        </div>
      </div>

      {/* Footer Fee & Action */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
          <span className="text-base font-extrabold text-slate-900">
            LKR {doctor.consultationFee?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
          >
            Profile
          </Link>
          <button
            onClick={() => onBookNow ? onBookNow(doctor) : null}
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-1 transition-all hover:gap-1.5"
          >
            Book Slot
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}