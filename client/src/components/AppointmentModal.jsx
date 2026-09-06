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
  CreditCard,
  User,
  ShieldCheck,
  Loader2
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
      navigate("/login", { state: { from: window.location.pathname } });
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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto max-h-[90vh] flex flex-col">
        {/* Header (Pinned) */}
        <div className="px-6 py-4.5 bg-blue-600 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={doctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
              alt={doctor.user?.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || 'Doctor')}&background=2563eb&color=fff&bold=true`;
              }}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30"
            />
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">Book Consultation</h3>
              <p className="text-xs text-blue-100">{doctor.user?.name} • {doctor.specialty?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {bookingSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h4>
            <p className="text-sm text-slate-600">
              Your consultation with {doctor.user?.name} on {selectedDate} at {selectedSlot?.time12} is booked. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-5 overflow-y-auto">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                1. Select Consultation Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm text-slate-800"
                required
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  2. Select Time Slot
                </span>
                {slotsData && (
                  <span className="text-[11px] font-normal text-slate-500">
                    {slotsData.availableSlotsCount || 0} slots available
                  </span>
                )}
              </label>

              {loadingSlots ? (
                <div className="py-6 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span>Checking doctor schedule & real-time slots...</span>
                </div>
              ) : slotsData && !slotsData.isWorkingDay ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700 text-center">
                  ⚠️ {doctor.user?.name} is not on schedule on {slotsData.day}s. Please pick another date.
                </div>
              ) : slotsData && slotsData.slots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1">
                  {slotsData.slots.map((slot, idx) => (
                    <button
                      type="button"
                      key={idx}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        !slot.isAvailable
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                          : selectedSlot?.time12 === slot.time12
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold scale-102"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {slot.time12}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-500">
                  No slots available for this date.
                </div>
              )}
            </div>

            {/* Symptoms Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Reason for Visit / Symptoms (Optional)
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="E.g. Fever for 2 days, headache, routine checkup..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 resize-none"
              ></textarea>
            </div>

            {/* Login Notice for Guest Users */}
            {!user && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800 space-y-0.5">
                  <p className="font-bold">Sign-in Required to Complete Booking</p>
                  <p className="text-amber-700/90">
                    You can pick an available date & time slot. Click below to sign in or create an account to finalize your booking.
                  </p>
                </div>
              </div>
            )}

            {/* Summary & Price */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Consultation Fee</span>
                <span className="text-lg font-extrabold text-slate-900">
                  LKR {doctor.consultationFee?.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Instant Online Confirmation
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || (!user ? false : !selectedSlot)}
                className="w-2/3 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : !user ? (
                  <>
                    <User className="w-4 h-4" />
                    Sign In to Book Consultation
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm & Book Now
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