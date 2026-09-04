import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Sparkles,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-3 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-2xl sm:rounded-full transition-all duration-300 px-4 sm:px-6 h-16 flex items-center justify-between ${
          scrolled
            ? "glass-pill shadow-lg shadow-slate-200/50 bg-white/90 border-slate-200/80"
            : "bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xs"
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-0.5">
              Care<span className="text-blue-600">Sync</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 animate-pulse" title="System Live"></span>
            </span>
            <span className="text-[9px] text-slate-400 font-bold -mt-1 tracking-widest uppercase">
              Clinical Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              isActive("/")
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isActive("/doctors")
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            Specialists
          </Link>

          {user && (
            <Link
              to={getDashboardPath()}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                location.pathname.startsWith(getDashboardPath())
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              {user.role === "ADMIN" ? (
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              ) : user.role === "DOCTOR" ? (
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              )}
              {user.role === "ADMIN" ? "Admin Portal" : user.role === "DOCTOR" ? "Doctor Hub" : "My Visits"}
            </Link>
          )}
        </nav>

        {/* Right CTA / User Profile */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 pl-2 pr-3 py-1.5 rounded-full">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user.name.split(" ")[0]}</p>
                <span className="text-[9px] font-extrabold uppercase text-blue-600 tracking-wider">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-full hover:bg-slate-100 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-full shadow-sm shadow-blue-500/30 transition-all hover:shadow-md hover:scale-[1.02]"
              >
                Book Consultation
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 shadow-2xl space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 font-bold py-2 text-sm"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 font-bold py-2 text-sm"
          >
            Find Specialists
          </Link>
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-blue-600 font-bold py-2 text-sm"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-rose-600 font-bold py-2 text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                Register as Patient
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}