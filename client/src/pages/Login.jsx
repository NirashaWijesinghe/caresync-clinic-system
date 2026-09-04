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
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
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

  // Quick Demo Auto-fill Helper
  const fillDemoCredentials = (role) => {
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative">
      <div className="max-w-md w-full space-y-7">
        {/* Top Branding */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex w-14 h-14 rounded-2.5xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-1 group hover:scale-105 transition-transform">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome to CareSync
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to access your consultations, prescriptions, and clinic tools
          </p>
        </div>

        {/* 1-Click Demo Switcher Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50/90 via-white to-teal-50/50 rounded-3xl border border-blue-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              1-Click Demo Accounts
            </span>
            <span className="text-[10px] uppercase font-extrabold text-blue-700 bg-blue-100/90 px-2.5 py-0.5 rounded-full">
              Quick Test
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Select a role to populate pre-configured medical records:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin")}
              className="py-2.5 px-2 bg-white hover:bg-purple-50 text-purple-700 text-xs font-bold rounded-2xl border border-purple-200 shadow-xs hover:border-purple-400 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("doctor")}
              className="py-2.5 px-2 bg-white hover:bg-teal-50 text-teal-700 text-xs font-bold rounded-2xl border border-teal-200 shadow-xs hover:border-teal-400 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              Doctor
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("patient")}
              className="py-2.5 px-2 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-2xl border border-blue-200 shadow-xs hover:border-blue-400 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              Patient
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3.5xl border border-slate-200/80 shadow-xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-800 bg-slate-50/50 hover:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-800 bg-slate-50/50 hover:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:gap-2.5 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-extrabold text-blue-600 hover:text-blue-700">
                Register as Patient
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}