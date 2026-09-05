import React, { useState, useRef } from "react";
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
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  RotateCcw
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
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [bio, setBio] = useState(user?.doctorProfile?.bio || "");
  const [hospital, setHospital] = useState(user?.doctorProfile?.hospital || "");
  const [consultationFee, setConsultationFee] = useState(user?.doctorProfile?.consultationFee || 2500);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [fileName, setFileName] = useState("");

  if (!isOpen || !user) return null;

  // Handle local laptop image file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    // Validate file size (Max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("Image size is too large. Please select a photo under 3MB.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setAvatar(uploadEvent.target.result);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file. Please try another photo.");
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefault = () => {
    setFileName("");
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}`;
    setAvatar(defaultAvatar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (name.trim().length < 2) {
      setErrorMsg("Full name must be at least 2 characters long.");
      return;
    }

    if (phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
      if (/[a-zA-Z]/.test(phone) || !phoneRegex.test(phone.trim())) {
        setErrorMsg("Please enter a valid phone number (digits only).");
        return;
      }
    }

    if (user.role === "DOCTOR") {
      const feeNum = Number(consultationFee);
      if (isNaN(feeNum) || feeNum <= 0) {
        setErrorMsg("Consultation fee must be a valid positive number.");
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        avatar: avatar ? avatar.trim() : undefined,
        ...(user.role === "DOCTOR" && {
          bio: bio ? bio.trim() : undefined,
          hospital: hospital ? hospital.trim() : undefined,
          consultationFee: Number(consultationFee)
        })
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
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 flex-shrink-0">
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
          <form onSubmit={handleSubmit} className="space-y-5 pt-4 overflow-y-auto pr-1">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Avatar Section */}
            <div className="space-y-3.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Photo & Avatar
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Image Preview with click-to-upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group flex-shrink-0 cursor-pointer"
                  title="Click to choose a photo from your laptop"
                >
                  <img
                    src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"}
                    alt={name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=2563eb&color=fff&bold=true`;
                    }}
                    className="w-18 h-18 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md group-hover:opacity-90 transition-all"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span>Change</span>
                  </div>
                </div>

                {/* Upload Buttons & File Controls */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload from Laptop
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Reset to generated avatar"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>

                  {fileName ? (
                    <p className="text-[11px] text-emerald-600 font-medium truncate flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      Selected: {fileName}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WEBP (Max 3MB)
                    </p>
                  )}
                </div>
              </div>

              {/* Preset Avatars Selection */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 block">Or Choose a Medical Preset:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((presetUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setFileName("");
                        setAvatar(presetUrl);
                      }}
                      className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        avatar === presetUrl ? "border-blue-600 scale-110 shadow-xs" : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL Option */}
              <div>
                <input
                  type="url"
                  value={avatar.startsWith("data:image") ? "" : avatar}
                  onChange={(e) => {
                    setFileName("");
                    setAvatar(e.target.value);
                  }}
                  placeholder="Or paste external image URL (https://...)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-mono"
                />
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-medium"
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
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-medium"
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
                      placeholder="2500"
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Professional Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief introduction about your clinical background..."
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Save Profile
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
