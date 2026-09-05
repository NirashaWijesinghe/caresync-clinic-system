import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import StatCard from "../components/StatCard";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileEdit,
  Activity,
  AlertCircle,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Queue Filters & Pagination
  const [queueFilter, setQueueFilter] = useState("ALL"); // ALL, CONFIRMED, COMPLETED, CANCELLED
  const [searchQuery, setSearchQuery] = useState("");
  const [queuePage, setQueuePage] = useState(1);
  const QUEUE_PER_PAGE = 5;

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const fetchDoctorAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConsultationModal = (apt) => {
    setActiveConsultation(apt);
    setDiagnosisNotes(apt.diagnosisNotes || "");
    setPrescription(apt.prescription || "");
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!activeConsultation) return;

    if (diagnosisNotes.trim().length < 3) {
      setActionSuccess("❌ Diagnosis notes must be at least 3 characters long.");
      setTimeout(() => setActionSuccess(""), 4000);
      return;
    }

    if (prescription.trim().length < 3) {
      setActionSuccess("❌ Digital Prescription must be at least 3 characters long.");
      setTimeout(() => setActionSuccess(""), 4000);
      return;
    }

    try {
      await API.patch(`/appointments/${activeConsultation.id}/details`, {
        status: "COMPLETED",
        diagnosisNotes: diagnosisNotes.trim(),
        prescription: prescription.trim()
      });

      setActionSuccess("Consultation & Prescription saved successfully!");
      setActiveConsultation(null);
      fetchDoctorAppointments();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      setActionSuccess("❌ Failed to update consultation record. Please try again.");
      setTimeout(() => setActionSuccess(""), 4000);
    }
  };

  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const cancelledCount = appointments.filter((a) => a.status === "CANCELLED").length;

  // Filtered Queue
  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = queueFilter === "ALL" || apt.status === queueFilter;
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      apt.patient?.name?.toLowerCase().includes(term) ||
      apt.patient?.phone?.toLowerCase().includes(term) ||
      apt.patient?.email?.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredAppointments.length / QUEUE_PER_PAGE) || 1;
  const paginatedAppointments = filteredAppointments.slice(
    (queuePage - 1) * QUEUE_PER_PAGE,
    queuePage * QUEUE_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-teal-100 uppercase tracking-wider">Doctor Clinical Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{user?.name}</h1>
          <p className="text-xs sm:text-sm text-teal-50 mt-1">
            Manage your daily patient queue, record diagnoses, and issue digital prescriptions.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
          <span className="font-semibold">{actionSuccess}</span>
          <button onClick={() => setActionSuccess("")} className="text-emerald-900 font-bold p-1 hover:bg-emerald-100 rounded-lg">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Scheduled Patients"
          value={appointments.length}
          subtitle="All patient consultations"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Pending / Waiting Queue"
          value={confirmedCount}
          subtitle="Patients awaiting consultation"
          icon={Clock}
          color="teal"
        />
        <StatCard
          title="Completed Consultations"
          value={completedCount}
          subtitle="Prescriptions issued"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Appointments Queue Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6">
        {/* Card Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Patient Queue & Schedules</h3>
            <p className="text-xs text-slate-500">Live consultation queue with status filters and search</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setQueuePage(1);
              }}
              placeholder="Search patient name, phone..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setQueueFilter("ALL");
              setQueuePage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              queueFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Consultations ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setQueueFilter("CONFIRMED");
              setQueuePage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              queueFilter === "CONFIRMED"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-teal-50 text-teal-700 hover:bg-teal-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Waiting / Queue ({confirmedCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setQueueFilter("COMPLETED");
              setQueuePage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              queueFilter === "COMPLETED"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed ({completedCount})
          </button>
          {cancelledCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setQueueFilter("CANCELLED");
                setQueuePage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                queueFilter === "CANCELLED"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          )}
        </div>

        {/* Queue Items */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading patient schedule...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-slate-700">No consultations found in this queue</p>
            <p className="text-[11px] text-slate-400">Try changing the filter or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {paginatedAppointments.map((apt) => (
              <div key={apt.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                <div className="flex gap-4 items-start">
                  <img
                    src={apt.patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"}
                    alt={apt.patient?.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{apt.patient?.name}</h4>
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

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {apt.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        {apt.appointmentTime}
                      </span>
                      <span>Contact: {apt.patient?.phone || apt.patient?.email}</span>
                    </div>

                    {apt.symptoms && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 inline-block mt-1">
                        <span className="font-bold">Patient Symptoms:</span> {apt.symptoms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="self-end md:self-center">
                  <button
                    onClick={() => handleOpenConsultationModal(apt)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    {apt.status === "COMPLETED" ? "Edit Prescription" : "Start Consultation"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Queue Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing Page <strong className="text-slate-900">{queuePage}</strong> of <strong>{totalPages}</strong> ({filteredAppointments.length} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={queuePage <= 1}
                onClick={() => setQueuePage((p) => p - 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                type="button"
                disabled={queuePage >= totalPages}
                onClick={() => setQueuePage((p) => p + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Consultation & Prescription Modal */}
      {activeConsultation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveConsultation} className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase">Clinical Consultation Record</span>
                <h3 className="font-bold text-lg text-slate-900">Patient: {activeConsultation.patient?.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveConsultation(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  1. Clinical Diagnosis & Doctor Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="E.g. Patient presents with acute bronchitis, lung sounds clear, recommended rest..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  2. Digital Prescription & Medication Dosage
                </label>
                <textarea
                  rows={4}
                  required
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="E.g.&#10;1. Tab. Amoxicillin 500mg - 1 tds x 5 days&#10;2. Syr. Benadryl 10ml - tds x 3 days"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveConsultation(null)}
                className="w-1/3 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete & Issue Prescription
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}