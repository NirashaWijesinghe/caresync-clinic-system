import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";
import {
  HeartPulse,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  Menu,
  X,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Settings
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center">
                  Care<span className="text-blue-600">Sync</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold -mt-0.5 tracking-wider uppercase">
                  Healthcare Network
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors ${
                  isActive("/")
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive("/doctors")
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="w-4 h-4 text-blue-500" />
                Find Specialists
              </Link>

              {user && (
                <Link
                  to={getDashboardPath()}
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    location.pathname.includes("dashboard") || location.pathname === "/admin"
                      ? "text-blue-600 font-bold"
                      : "text-slate-600 hover:text-slate-900"
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
                    ? "Admin Portal"
                    : user.role === "DOCTOR"
                    ? "Doctor Schedule"
                    : "My Appointments"}
                </Link>
              )}
            </nav>

            {/* Right Action / Profile */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  <button
                    onClick={() => setProfileModalOpen(true)}
                    className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-50 transition-all text-left group"
                    title="Click to edit profile & avatar"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=2563eb&color=fff&bold=true`;
                        }}
                        className="w-9 h-9 rounded-xl ring-2 ring-blue-100 object-cover group-hover:ring-blue-400 transition-all"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </p>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                        {user.role}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setProfileModalOpen(true)}
                    title="Profile Settings"
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-sm shadow-blue-500/25 transition-all flex items-center gap-1.5"
                >
                  Book Appointment
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 font-bold py-2 border-b border-slate-100"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 font-bold py-2 border-b border-slate-100"
          >
            Find Specialists
          </Link>
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-blue-600 font-bold py-2 border-b border-slate-100"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-rose-600 font-bold py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold text-white bg-blue-600 rounded-xl shadow-sm"
              >
                Register as Patient
              </Link>
            </div>
          )}
        </div>
      )}
    </header>

    {/* Account Profile & Avatar Modal */}
    {profileModalOpen && (
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    )}
  </>
  );
}