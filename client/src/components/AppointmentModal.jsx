import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Sun,
  Moon,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AppointmentModal({ doctor, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Selected state
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState("");

  // Slots fetching state
  const [slotsData, setSlotsData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && doctor && selectedDate) {
      fetchSlots(doctor.id, selectedDate);
    }
  }, [isOpen, doctor, selectedDate]);

  const fetchSlots = async (doctorId, date) => {
    setLoadingSlots(true);
    setErrorMsg("");
    setSelectedSlot(null);
    try {
      const res = await API.get(`/doctors/${doctorId}/slots?date=${date}`);
      setSlotsData(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load time slots for this date");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedSlot) {
      setErrorMsg("Please select an available consultation time slot.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await API.post("/appointments", {
        doctorId: doctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot.time12,
        symptoms: symptoms.trim() || "Routine medical consultation"
      });

      setBookingSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to confirm appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3.5xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header with Gradient Accent */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3.5 relative z-10">
            <img
              src={doctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
              alt={doctor.user?.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || 'Doctor')}&background=0D8ABC&color=fff&bold=true`;
              }}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/40 shadow-sm"
            />
            <div>
              <h3 className="font-extrabold text-lg leading-tight flex items-center gap-1.5">
                Book Consultation
              </h3>
              <p className="text-xs text-blue-100 font-medium">{doctor.user?.name} • {doctor.specialty?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-extrabold text-slate-900">Appointment Confirmed!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your visit with <strong className="text-slate-900">{doctor.user?.name}</strong> on <span className="text-blue-600 font-bold">{selectedDate}</span> at <span className="text-teal-600 font-bold">{selectedSlot?.time12}</span> has been confirmed. Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 sm:p-7 space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Date Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                1. Select Consultation Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-sm text-slate-800 bg-slate-50/50 hover:bg-white transition-all shadow-xs"
                required
              />
            </div>

            {/* Step 2: Time Slot Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  2. Choose Dynamic Slot
                </label>
                {slotsData && (
                  <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    {slotsData.availableSlotsCount || 0} slots available
                  </span>
                )}
              </div>

              {loadingSlots ? (
                <div className="py-8 bg-slate-50/60 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs gap-2 border border-dashed border-slate-200">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="font-medium">Calculating dynamic 30-min doctor slots...</span>
                </div>
              ) : slotsData && !slotsData.isWorkingDay ? (
                <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-800 text-center font-medium">
                  ⚠️ {doctor.user?.name} is not on schedule on {slotsData.day}s. Please select another date.
                </div>
              ) : slotsData && slotsData.slots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50/50 rounded-2xl border border-slate-200/70">
                  {slotsData.slots.map((slot, idx) => (
                    <button
                      type="button"
                      key={idx}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                        !slot.isAvailable
                          ? "bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed line-through"
                          : selectedSlot?.time12 === slot.time12
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-102"
                          : "bg-white text-slate-700 border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs"
                      }`}
                    >
                      {slot.time12}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  No slots available for this date.
                </div>
              )}
            </div>

            {/* Step 3: Symptoms */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Reason for Visit / Symptoms
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="E.g. Fever for 2 days, migraine, routine cardiology review..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 bg-slate-50/50 hover:bg-white transition-all resize-none shadow-xs"
              ></textarea>
            </div>

            {/* Fee & Security Summary */}
            <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Consultation Fee</span>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                  LKR {doctor.consultationFee?.toLocaleString()}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Booking
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="w-2/3 py-3.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Locking Slot...
                  </>
                ) : (
                  <>
                    <span>Confirm Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}