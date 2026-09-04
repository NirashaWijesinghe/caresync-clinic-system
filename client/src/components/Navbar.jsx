import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  LogOut,
  LayoutDashboard,
  Calendar,
  Menu,
  X,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "DOCTOR") return "/doctor/dashboard";
    return "/dashboard";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1">
                Care<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Sync</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold -mt-1 tracking-widest uppercase flex items-center gap-1">
                Clinical Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive("/")
                  ? "bg-white text-blue-600 shadow-sm shadow-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isActive("/doctors")
                  ? "bg-white text-blue-600 shadow-sm shadow-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Stethoscope className="w-4 h-4 text-blue-500" />
              Specialists
            </Link>

            {user && (
              <Link
                to={getDashboardPath()}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive(getDashboardPath())
                    ? "bg-white text-blue-600 shadow-sm shadow-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {user.role === "ADMIN" ? (
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                ) : user.role === "DOCTOR" ? (
                  <Calendar className="w-4 h-4 text-teal-600" />
                ) : (
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                )}
                {user.role === "ADMIN"
                  ? "Admin Analytics"
                  : user.role === "DOCTOR"
                  ? "Consultation Hub"
                  : "My Visits"}
              </Link>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-white/80 pl-3 pr-2 py-1.5 rounded-2xl border border-slate-200/90 shadow-sm">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&bold=true`}
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&bold=true`;
                  }}
                  className="w-9 h-9 rounded-xl ring-2 ring-blue-500/20 object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">{user.name}</p>
                  <span className={`inline-block px-1.5 py-0.2 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : user.role === "DOCTOR" ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl transition-colors hover:bg-slate-100/60"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all duration-200 flex items-center gap-1.5 group"
                >
                  <span>Register</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-slate-800 font-semibold py-2.5 border-b border-slate-100"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-slate-800 font-semibold py-2.5 border-b border-slate-100"
          >
            <span>Find Specialists</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          {user ? (
            <div className="space-y-3 pt-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-blue-600 font-bold py-2.5 bg-blue-50/80 px-4 rounded-xl"
              >
                <span>Dashboard ({user.role})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-rose-600 font-bold py-2.5 px-4 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-between"
              >
                <span>Sign Out</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/30"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}