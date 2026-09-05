import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Filter,
  ArrowRight
} from "lucide-react";

export default function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Reviews Star Filter & Pagination
  const [starFilter, setStarFilter] = useState("ALL");
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 3;

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

  // Reviews Analysis & Distribution
  const allReviews = doctor.reviews || [];
  const totalReviewsCount = allReviews.length;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviews.forEach((r) => {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating] += 1;
    }
  });

  // Filtered Reviews
  const filteredReviews = allReviews.filter((r) => {
    if (starFilter === "ALL") return true;
    return r.rating === Number(starFilter);
  });

  const totalReviewPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const paginatedReviews = filteredReviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

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
              <span className="flex items-center text-amber-500 font-bold gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                <Star className="w-4 h-4 fill-amber-400" />
                {doctor.rating?.toFixed(1) || "4.8"} ({totalReviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <Award className="w-4 h-4 text-blue-600" />
                {doctor.experienceYears}+ Years Clinical Experience
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
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

            {/* Dynamic Role-Based Action */}
            {user?.role === "DOCTOR" && (user?.id === doctor.userId || user?.id === doctor.user?.id) ? (
              <div className="flex flex-col items-end gap-1.5 mt-3">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                  Your Public Profile Mode
                </span>
                <Link
                  to="/doctor/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-teal-500/20 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Go to Live Queue
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : user?.role === "DOCTOR" ? (
              <div className="flex flex-col items-end gap-1.5 mt-3">
                <div className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                  Specialist Colleague View
                </div>
              </div>
            ) : user?.role === "ADMIN" ? (
              <div className="flex flex-col items-end gap-1.5 mt-3">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-purple-500/20 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Manage in Admin Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </button>
            )}
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

      {/* Patient Feedback & Reviews (Enterprise Widget with Breakdown & Pagination) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Clinical Reputation</span>
            <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Patient Feedback & Reviews
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 self-start sm:self-auto">
            {totalReviewsCount} Verified Patient Reviews
          </span>
        </div>

        {totalReviewsCount > 0 ? (
          <div className="space-y-6">
            {/* Rating Breakdown Summary Card */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-center gap-8">
              {/* Left Score Card */}
              <div className="text-center md:text-left flex flex-col items-center md:items-start flex-shrink-0">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.rating?.toFixed(1) || "4.8"}
                </span>
                <div className="flex items-center gap-1 my-1.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(doctor.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">Based on {totalReviewsCount} consultations</p>
              </div>

              {/* Right Star Distribution Bars */}
              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = starCounts[star] || 0;
                  const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-slate-600 font-semibold flex items-center gap-1 flex-shrink-0">
                        {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-right font-medium text-slate-500 text-[11px] flex-shrink-0">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Star Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                type="button"
                onClick={() => {
                  setStarFilter("ALL");
                  setReviewPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  starFilter === "ALL"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({totalReviewsCount})
              </button>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star] || 0;
                if (count === 0 && starFilter !== String(star)) return null;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => {
                      setStarFilter(String(star));
                      setReviewPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      starFilter === String(star)
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-current" />
                    <span>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Paginated Reviews List */}
            <div className="space-y-3 pt-2">
              {paginatedReviews.length > 0 ? (
                paginatedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            rev.patient?.avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"
                          }
                          alt={rev.patient?.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              rev.patient?.name || "Patient"
                            )}&background=2563eb&color=fff&bold=true`;
                          }}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{rev.patient?.name}</span>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Verified Consultation
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                  No reviews found matching the selected star filter.
                </div>
              )}
            </div>

            {/* Review Pagination Controls */}
            {totalReviewPages > 1 && (
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Showing Page <strong className="text-slate-900">{reviewPage}</strong> of{" "}
                  <strong>{totalReviewPages}</strong> ({filteredReviews.length} reviews)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={reviewPage <= 1}
                    onClick={() => setReviewPage((p) => p - 1)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <button
                    type="button"
                    disabled={reviewPage >= totalReviewPages}
                    onClick={() => setReviewPage((p) => p + 1)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No patient feedback yet</p>
            <p className="text-[11px] text-slate-400">Reviews will appear here once patients complete consultations.</p>
          </div>
        )}
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