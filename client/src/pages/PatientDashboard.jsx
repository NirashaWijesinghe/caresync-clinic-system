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
  Receipt,
  Download,
  Printer,
  Sparkles,
  HeartPulse,
  Award
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

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await API.patch(`/appointments/${id}/cancel`);
      setActionMsg("Appointment cancelled successfully");
      fetchAppointments();
    } catch (err) {
      alert("Failed to cancel appointment");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalAppointment) return;

    try {
      await API.post("/appointments/reviews", {
        doctorId: reviewModalAppointment.doctorId,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewModalAppointment(null);
      setReviewComment("");
      setActionMsg("Thank you! Review submitted successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const upcomingCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 p-8 sm:p-10 rounded-3.5xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patient Consultation Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
            Manage your clinic consultations, doctor schedules, and digital medical records.
          </p>
        </div>

        <Link
          to="/doctors"
          className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold rounded-2xl shadow-lg shadow-black/10 transition-all flex items-center gap-2 relative z-10 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Book Consultation</span>
        </Link>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionMsg}
          </span>
          <button onClick={() => setActionMsg("")} className="text-emerald-900 font-black hover:text-emerald-700">×</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Consultations"
          value={appointments.length}
          subtitle="All-time visits"
          icon={Calendar}
          color="blue"
          trend="Lifetime"
        />
        <StatCard
          title="Upcoming Visits"
          value={upcomingCount}
          subtitle="Scheduled doctor slots"
          icon={Clock}
          color="teal"
          trend={upcomingCount > 0 ? "Active" : "None"}
        />
        <StatCard
          title="Completed Consultations"
          value={completedCount}
          subtitle="Prescriptions ready"
          icon={Activity}
          color="purple"
          trend="Available"
        />
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-3.5xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-lg text-slate-900">Your Appointment History</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time status and digital prescriptions</p>
          </div>
          <span className="text-xs font-extrabold text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            {appointments.length} Consultations
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">Loading your medical visits...</div>
        ) : appointments.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-extrabold text-slate-800">No Appointments Scheduled</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't booked any medical consultations yet. Browse our specialist directory to find a doctor.
              </p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
            >
              <span>Browse Specialists</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 sm:p-8 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                {/* Doctor & Info */}
                <div className="flex gap-5 items-start">
                  <img
                    src={apt.doctor?.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
                    alt={apt.doctor?.user?.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.user?.name || 'Doctor')}&background=0D8ABC&color=fff&bold=true`;
                    }}
                    className="w-16 h-16 rounded-2.5xl object-cover ring-2 ring-slate-100 flex-shrink-0 shadow-sm"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                        {apt.doctor?.specialty?.name}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : apt.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-lg text-slate-900">{apt.doctor?.user?.name}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {apt.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {apt.appointmentTime}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
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
                <div className="flex items-center gap-2.5 self-end md:self-center">
                  {apt.status === "COMPLETED" && (
                    <>
                      <button
                        onClick={() => setSelectedPrescription(apt)}
                        className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors border border-blue-200/60"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Prescription & Notes</span>
                      </button>

                      <button
                        onClick={() => setReviewModalAppointment(apt)}
                        className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors border border-amber-200/60"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>Rate Doctor</span>
                      </button>
                    </>
                  )}

                  {apt.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors border border-rose-200/60"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Cancel Visit</span>
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3.5xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5" /> CareSync Digital Medical Record
                </span>
                <h3 className="font-black text-xl text-slate-900">E-Prescription & Clinical Summary</h3>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2.5xl space-y-1.5 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Consultant Details</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedPrescription.doctor?.user?.name}</p>
                <p className="text-slate-500 font-medium">
                  {selectedPrescription.doctor?.specialty?.name} • Visit Date: {selectedPrescription.appointmentDate} ({selectedPrescription.appointmentTime})
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-700 font-bold uppercase tracking-wider block text-[11px]">
                  Clinical Diagnosis Notes:
                </span>
                <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 text-slate-800 leading-relaxed font-sans font-medium">
                  {selectedPrescription.diagnosisNotes || "Routine health consultation. No critical flags noted."}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-700 font-bold uppercase tracking-wider block text-[11px]">
                  Prescribed Medication & Dosage:
                </span>
                <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100 text-slate-800 leading-relaxed font-mono whitespace-pre-line text-xs font-semibold">
                  {selectedPrescription.prescription || "No prescription required."}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Record</span>
              </button>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition-colors shadow-md shadow-blue-500/25"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-3.5xl max-w-md w-full p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-slate-900">Review {reviewModalAppointment.doctor?.user?.name}</h3>
              <button
                type="button"
                onClick={() => setReviewModalAppointment(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-2.5 rounded-2xl border border-slate-200 hover:bg-amber-50 transition-colors"
                  >
                    <Star className={`w-6 h-6 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Your Feedback</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Doctor was very professional and thorough in diagnosis..."
                className="w-full p-3.5 text-xs font-medium border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalAppointment(null)}
                className="w-1/2 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 bg-blue-600 text-white text-xs font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}