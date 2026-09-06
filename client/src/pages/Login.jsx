import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  User,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = typeof location.state?.from === "string" 
    ? location.state.from 
    : location.state?.from?.pathname || "/";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = email.trim() && emailRegex.test(email.trim());
  const emailError = touched.email && (!email.trim() ? "Email address is required." : !isEmailValid ? "Please enter a valid email address." : "");
  const passwordError = touched.password && !password ? "Password is required." : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setTouched({ email: true, password: true });

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isEmailValid) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const loggedUser = await login(trimmedEmail, password);
      if (loggedUser.role === "ADMIN") {
        navigate("/admin");
      } else if (loggedUser.role === "DOCTOR") {
        navigate("/doctor/dashboard");
      } else {
        navigate(from === "/" ? "/dashboard" : from);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-fill Helper for Recruiters / Reviewers
  const fillDemoCredentials = (role) => {
    setErrorMsg("");
    setTouched({});
    if (role === "admin") {
      setEmail("admin@caresync.com");
      setPassword("admin123");
    } else if (role === "doctor") {
      setEmail("dr.sarah@caresync.com");
      setPassword("doctor123");
    } else if (role === "patient") {
      setEmail("kasun@test.com");
      setPassword("patient123");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-2">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to CareSync
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your consultations, prescriptions, and clinic tools
          </p>
        </div>

        {/* Demo Quick Access Card */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200/80 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Recruiter Demo Accounts
            </span>
            <span className="text-[10px] uppercase font-semibold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full">
              1-Click Fill
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Click any role to test full permissions with pre-populated medical records:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin")}
              className="py-1.5 px-2 bg-white hover:bg-purple-50 text-purple-700 text-xs font-semibold rounded-xl border border-purple-200 shadow-2xs hover:border-purple-400 transition-all flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-purple-600" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("doctor")}
              className="py-1.5 px-2 bg-white hover:bg-teal-50 text-teal-700 text-xs font-semibold rounded-xl border border-teal-200 shadow-2xs hover:border-teal-400 transition-all flex items-center justify-center gap-1"
            >
              <Stethoscope className="w-3 h-3 text-teal-600" />
              Doctor
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("patient")}
              className="py-1.5 px-2 bg-white hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 shadow-2xs hover:border-blue-400 transition-all flex items-center justify-center gap-1"
            >
              <User className="w-3 h-3 text-blue-600" />
              Patient
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${emailError ? "text-red-400" : "text-slate-400"}`} />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  value={email}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    emailError
                      ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 text-red-900"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${passwordError ? "text-red-400" : "text-slate-400"}`} />
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    passwordError
                      ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-400/30 text-red-900"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
              {passwordError && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:gap-3 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
                Register as Patient
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}