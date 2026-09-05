import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import StatCard from "../components/StatCard";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Stethoscope,
  Activity,
  Receipt
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [reviewModalAppointment, setReviewModalAppointment] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewedAptIds, setReviewedAptIds] = useState(() => {
    try {
      const saved = localStorage.getItem("caresync_reviewed_apts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/patient");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [cancelModalApt, setCancelModalApt] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    if (!cancelModalApt) return;
    setCancelling(true);
    try {
      await API.patch(`/appointments/${cancelModalApt.id}/cancel`);
      setActionMsg("✓ Appointment cancelled successfully");
      setCancelModalApt(null);
      fetchAppointments();
      setTimeout(() => setActionMsg(""), 3500);
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Failed to cancel appointment");
      setTimeout(() => setActionMsg(""), 3500);
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalAppointment) return;
    setReviewError("");
    setSubmittingReview(true);

    try {
      await API.post("/appointments/reviews", {
        doctorId: reviewModalAppointment.doctorId,
        rating: reviewRating,
        comment: reviewComment
      });

      // Save reviewed appointment to prevent duplicate submissions
      const updatedReviewed = [...reviewedAptIds, reviewModalAppointment.id];
      setReviewedAptIds(updatedReviewed);
      localStorage.setItem("caresync_reviewed_apts", JSON.stringify(updatedReviewed));

      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setReviewModalAppointment(null);
        setReviewComment("");
      }, 1800);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const upcomingCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-600 to-teal-600 p-8 rounded-3xl text-white shadow-xl">
        <div>
          <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Patient Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Hello, {user?.name}!</h1>
          <p className="text-xs sm:text-sm text-blue-50 mt-1">
            Track your clinic appointments, doctor schedules, and digital prescriptions.
          </p>
        </div>
        <Link
          to="/doctors"
          className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Book New Consultation
        </Link>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg("")} className="text-emerald-900 font-bold">×</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Consultations"
          value={appointments.length}
          subtitle="All-time booking history"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Upcoming Appointments"
          value={upcomingCount}
          subtitle="Scheduled upcoming slots"
          icon={Clock}
          color="teal"
        />
        <StatCard
          title="Completed Visits"
          value={completedCount}
          subtitle="Prescriptions & notes available"
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">Your Appointment History</h3>
          <span className="text-xs font-semibold text-slate-500">{appointments.length} Consultations</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading your appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Appointments Scheduled</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't booked any medical consultations yet. Browse our specialist directory to find a doctor.
            </p>
            <Link
              to="/doctors"
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Browse Specialists
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                {/* Doctor & Info */}
                <div className="flex gap-4 items-start">
                  <img
                    src={apt.doctor?.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
                    alt={apt.doctor?.user?.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.user?.name || 'Doctor')}&background=0D8ABC&color=fff&bold=true`;
                    }}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {apt.doctor?.specialty?.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : apt.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{apt.doctor?.user?.name}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {apt.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        {apt.appointmentTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-slate-400" />
                        LKR {apt.fee?.toLocaleString()} ({apt.paymentStatus})
                      </span>
                    </div>

                    {apt.symptoms && (
                      <p className="text-xs text-slate-500 italic pt-1">
                        Reason: "{apt.symptoms}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {apt.status === "COMPLETED" && (
                    <>
                      <button
                        onClick={() => setSelectedPrescription(apt)}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Prescription & Notes
                      </button>

                      {reviewedAptIds.includes(apt.id) ? (
                        <span className="px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200/80 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => setReviewModalAppointment(apt)}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          Rate Doctor
                        </button>
                      )}
                    </>
                  )}

                  {apt.status === "CONFIRMED" && (
                    <button
                      onClick={() => setCancelModalApt(apt)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription & Medical Notes Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Official Medical Record</span>
                <h3 className="font-bold text-lg text-slate-900">Consultation Summary</h3>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 font-semibold block">Attending Consultant</span>
                <p className="font-bold text-slate-800 text-sm">{selectedPrescription.doctor?.user?.name}</p>
                <p className="text-slate-500">{selectedPrescription.doctor?.specialty?.name} • {selectedPrescription.appointmentDate}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Clinical Diagnosis Notes:</span>
                <p className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-slate-800 leading-relaxed font-mono">
                  {selectedPrescription.diagnosisNotes || "No diagnosis notes recorded."}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Prescribed Medication & Dosage:</span>
                <p className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-slate-800 leading-relaxed font-mono whitespace-pre-line">
                  {selectedPrescription.prescription || "No prescription issued."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedPrescription(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 overflow-hidden">
            {reviewSuccess ? (
              <div className="py-8 px-4 text-center space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">Thank You, {user?.name}!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Your verified review & rating for <span className="font-bold text-slate-700">{reviewModalAppointment.doctor?.user?.name}</span> have been published successfully.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ✓ Feedback Recorded
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-bold text-lg text-slate-900">Review {reviewModalAppointment.doctor?.user?.name}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewModalAppointment(null);
                      setReviewError("");
                    }}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                  >
                    ✕
                  </button>
                </div>

                {reviewError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{reviewError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-amber-50"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Your Experience / Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Doctor was very punctual and helpful..."
                    className="w-full p-3 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReviewModalAppointment(null);
                      setReviewError("");
                    }}
                    className="w-1/2 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SweetAlert Style Cancel Confirmation Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-center">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50 animate-pulse">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">Cancel Consultation?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel your appointment with <span className="font-bold text-slate-700">{cancelModalApt.doctor?.user?.name}</span> on <span className="font-semibold text-slate-700">{cancelModalApt.appointmentDate}</span> at <span className="font-semibold text-slate-700">{cancelModalApt.appointmentTime}</span>?
              </p>
              <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-xl border border-amber-200 font-medium">
                This time slot will be released back to the clinic pool.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                disabled={cancelling}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Nevermind, Keep
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}