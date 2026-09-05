import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  X,
  User,
  Phone,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  CreditCard,
  FileText,
  Loader2
} from "lucide-react";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=256"
];

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [bio, setBio] = useState(user?.doctorProfile?.bio || "");
  const [hospital, setHospital] = useState(user?.doctorProfile?.hospital || "");
  const [consultationFee, setConsultationFee] = useState(user?.doctorProfile?.consultationFee || 2500);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        name,
        phone,
        avatar,
        ...(user.role === "DOCTOR" && { bio, hospital, consultationFee })
      };

      const res = await API.patch("/auth/profile", payload);
      updateUser(res.data.user);
      setSuccessMsg(true);

      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Account Settings</span>
            <h3 className="font-bold text-xl text-slate-900">Manage Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Profile Updated!</h4>
            <p className="text-xs text-slate-500">Your account changes have been saved across the portal.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Avatar Section */}
            <div className="space-y-3 text-center sm:text-left">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Avatar
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group flex-shrink-0">
                  <img
                    src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"}
                    alt={name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=2563eb&color=fff&bold=true`;
                    }}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="flex-1 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 block">Pick Quick Avatar:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((presetUrl, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAvatar(presetUrl)}
                        className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          avatar === presetUrl ? "border-blue-600 scale-110 shadow-xs" : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Image URL */}
              <div>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Or enter custom image URL (https://...)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Specific Fields */}
            {user.role === "DOCTOR" && (
              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Hospital / Clinic Wing</label>
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="CareSync Central Clinic, Colombo"
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Consultation Fee (LKR)</label>
                    <input
                      type="number"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Doctor Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short description of medical expertise..."
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Save Profile Changes
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
