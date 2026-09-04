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
  Sparkles,
  Stethoscope,
  HeartPulse,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

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

    try {
      await API.patch(`/appointments/${activeConsultation.id}/details`, {
        status: "COMPLETED",
        diagnosisNotes: diagnosisNotes.trim(),
        prescription: prescription.trim()
      });

      setActionSuccess("Consultation & Prescription issued successfully!");
      setActiveConsultation(null);
      fetchDoctorAppointments();
      setTimeout(() => setActionSuccess(""), 3500);
    } catch (err) {
      alert("Failed to update consultation record");
    }
  };

  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-700 p-8 sm:p-10 rounded-3.5xl text-white shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-bold backdrop-blur-md">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Clinical Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{user?.name}</h1>
          <p className="text-xs sm:text-sm text-teal-50 font-medium">
            Manage your daily patient queue, record diagnoses, and issue digital prescriptions.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionSuccess}
          </span>
          <button onClick={() => setActionSuccess("")} className="text-emerald-900 font-black hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Assigned Patients"
          value={appointments.length}
          subtitle="All patient consultations"
          icon={Users}
          color="blue"
          trend="Total"
        />
        <StatCard
          title="Today's Pending Queue"
          value={confirmedCount}
          subtitle="Patients awaiting consultation"
          icon={Clock}
          color="teal"
          trend={confirmedCount > 0 ? "In Queue" : "Clear"}
        />
        <StatCard
          title="Completed Consultations"
          value={completedCount}
          subtitle="Prescriptions issued"
          icon={CheckCircle2}
          color="purple"
          trend="Completed"
        />
      </div>

      {/* Appointments Queue Table */}
      <div className="bg-white rounded-3.5xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-lg text-slate-900">Patient Consultation Queue</h3>
            <p className="text-xs text-slate-500 font-medium">Daily schedule and electronic diagnosis records</p>
          </div>
          <span className="text-xs font-extrabold text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            {appointments.length} Consultations
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">Loading patient schedule...</div>
        ) : appointments.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400 font-medium">No appointments assigned in queue yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 sm:p-8 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                <div className="flex gap-5 items-start">
                  <img
                    src={apt.patient?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient?.name || 'Patient')}&background=0D8ABC&color=fff&bold=true`}
                    alt={apt.patient?.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient?.name || 'Patient')}&background=0D8ABC&color=fff&bold=true`;
                    }}
                    className="w-14 h-14 rounded-2.5xl object-cover ring-2 ring-slate-100 flex-shrink-0 shadow-sm"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-lg text-slate-900">{apt.patient?.name}</h4>
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

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {apt.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {apt.appointmentTime}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {apt.patient?.phone || apt.patient?.email}
                      </span>
                    </div>

                    {apt.symptoms && (
                      <p className="text-xs text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-xl border border-slate-200 inline-block mt-1 font-medium">
                        <strong className="text-slate-800">Patient Symptoms:</strong> {apt.symptoms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="self-end md:self-center">
                  <button
                    onClick={() => handleOpenConsultationModal(apt)}
                    className="px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all active:scale-98"
                  >
                    <FileEdit className="w-4 h-4" />
                    <span>{apt.status === "COMPLETED" ? "Edit Prescription" : "Start Consultation"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultation & Prescription Modal */}
      {activeConsultation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveConsultation} className="bg-white rounded-3.5xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5" /> Clinical Consultation Record
                </span>
                <h3 className="font-black text-xl text-slate-900">Patient: {activeConsultation.patient?.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveConsultation(null)}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Clinical Diagnosis & Doctor Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="E.g. Patient presents with acute bronchitis, normal respiration, prescribed antibiotic regimen..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-xs text-slate-800 bg-slate-50/50"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Digital Prescription & Medication Dosage
                </label>
                <textarea
                  rows={4}
                  required
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="E.g.&#10;1. Tab. Amoxicillin 500mg - 1 tds x 5 days (After meals)&#10;2. Syr. Benadryl 10ml - tds x 3 days"
                  className="w-full p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs text-slate-800 bg-slate-50/50"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveConsultation(null)}
                className="w-1/3 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete & Issue Prescription</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}