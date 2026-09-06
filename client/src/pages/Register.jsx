import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  const [touched, setTouched] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time Field Validation Rules
  const validate = () => {
    const errors = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      if (touched.name) errors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Full name must be at least 2 characters long.";
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      if (touched.email) errors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email (e.g. name@example.com).";
    }

    // 3. Phone validation (Optional, but strictly digits/format if provided)
    if (formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
      const hasAlpha = /[a-zA-Z]/.test(formData.phone);
      if (hasAlpha || !phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Invalid phone number. Please enter digits only (e.g. 0771234567).";
      }
    }

    // 4. Password validation
    if (!formData.password) {
      if (touched.password) errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    // 5. Confirm password validation
    if (formData.confirmPassword || touched.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    return errors;
  };

  const errors = validate();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Touch all fields on submit
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrorMsg("Please correct the highlighted errors in the form before submitting.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        role: "PATIENT"
      });
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-2">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Patient Account
          </h2>
          <p className="text-xs text-slate-500">
            Book doctor consultations, manage prescriptions, and track health records.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${errors.name ? "text-red-400" : "text-slate-400"}`} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onBlur={() => handleBlur("name")}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Kasun Silva"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    errors.name
                      ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 text-red-900"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${errors.email ? "text-red-400" : "text-slate-400"}`} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onBlur={() => handleBlur("email")}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    errors.email
                      ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 text-red-900"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${errors.phone ? "text-red-400" : "text-slate-400"}`} />
                <input
                  type="tel"
                  value={formData.phone}
                  onBlur={() => handleBlur("phone")}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+94 77 123 4567"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    errors.phone
                      ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 text-red-900"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Passwords (Side by side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${errors.password ? "text-red-400" : "text-slate-400"}`} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onBlur={() => handleBlur("password")}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Min 6 chars"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      errors.password
                        ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 text-red-900"
                        : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm *
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${errors.confirmPassword ? "text-red-400" : "text-slate-400"}`} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onBlur={() => handleBlur("confirmPassword")}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 text-red-900"
                        : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:gap-3 disabled:opacity-50 mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}