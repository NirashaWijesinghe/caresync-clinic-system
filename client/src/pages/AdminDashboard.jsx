import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import StatCard from "../components/StatCard";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  Plus,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserPlus,
  CheckCircle2,
  PieChart as PieIcon,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialtyId: "",
    qualifications: "MBBS, MD",
    experienceYears: 6,
    consultationFee: 3000,
    hospital: "CareSync Central Clinic, Colombo",
    bio: "Dedicated specialist committed to patient wellness."
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [toggleModalDoc, setToggleModalDoc] = useState(null);
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Active Top Section Tab
  const [activeTab, setActiveTab] = useState("OVERVIEW"); // OVERVIEW, DOCTORS, PATIENTS, APPOINTMENTS

  // Doctor Table Search & Pagination
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorPage, setDoctorPage] = useState(1);
  const DOCTORS_PER_PAGE = 5;

  // Patient Table Search & Pagination
  const [patientSearch, setPatientSearch] = useState("");
  const [patientPage, setPatientPage] = useState(1);
  const PATIENTS_PER_PAGE = 5;

  // Appointment Table Search & Pagination
  const [aptSearch, setAptSearch] = useState("");
  const [aptStatusFilter, setAptStatusFilter] = useState("ALL");
  const [aptPage, setAptPage] = useState(1);
  const APTS_PER_PAGE = 5;

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, specRes, docRes, patRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/doctors/specialties"),
        API.get("/doctors?includeInactive=true"),
        API.get("/admin/patients")
      ]);
      setStats(statsRes.data);
      setSpecialties(specRes.data.specialties || []);
      setDoctorsList(docRes.data.doctors || []);
      setPatientsList(patRes.data.patients || []);
      if (specRes.data.specialties?.length > 0) {
        setNewDoctorData((prev) => ({ ...prev, specialtyId: specRes.data.specialties[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (!toggleModalDoc) return;
    setTogglingStatus(true);
    try {
      const res = await API.patch(`/admin/doctors/${toggleModalDoc.id}/toggle-status`);
      const updated = res.data.doctor;
      setDoctorsList((prev) =>
        prev.map((d) => (d.id === updated.id ? { ...d, isActive: updated.isActive } : d))
      );
      setSuccessMsg(res.data.message);
      setTimeout(() => setSuccessMsg(""), 4000);
      setToggleModalDoc(null);
    } catch (err) {
      console.error("Failed to toggle doctor status:", err);
    } finally {
      setTogglingStatus(false);
    }
  };

  const [doctorModalError, setDoctorModalError] = useState("");
  const [doctorModalTouched, setDoctorModalTouched] = useState({});
  const [addingDoctor, setAddingDoctor] = useState(false);

  // Real-time Onboard Doctor Validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateDoctorForm = () => {
    const errs = {};
    if (!newDoctorData.name.trim()) {
      if (doctorModalTouched.name) errs.name = "Doctor full name is required.";
    } else if (newDoctorData.name.trim().length < 3) {
      errs.name = "Doctor name must be at least 3 characters.";
    }

    if (!newDoctorData.email.trim()) {
      if (doctorModalTouched.email) errs.email = "Doctor email is required.";
    } else if (!emailRegex.test(newDoctorData.email.trim())) {
      errs.email = "Please enter a valid email (e.g. dr.name@caresync.com).";
    }

    if (!newDoctorData.password) {
      if (doctorModalTouched.password) errs.password = "Initial password is required.";
    } else if (newDoctorData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    const feeNum = Number(newDoctorData.consultationFee);
    if (isNaN(feeNum) || feeNum <= 0) {
      errs.consultationFee = "Fee must be a positive number (e.g. 2500).";
    }

    if (doctorModalTouched.qualifications && !newDoctorData.qualifications.trim()) {
      errs.qualifications = "Qualifications required (e.g. MBBS, MD).";
    }

    return errs;
  };

  const docErrors = validateDoctorForm();

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setDoctorModalError("");
    setDoctorModalTouched({
      name: true,
      email: true,
      password: true,
      qualifications: true,
      consultationFee: true
    });

    const formErrs = validateDoctorForm();
    if (Object.keys(formErrs).length > 0) {
      setDoctorModalError("Please correct the highlighted errors in the form.");
      return;
    }

    const feeNum = Number(newDoctorData.consultationFee);
    setAddingDoctor(true);
    try {
      await API.post("/admin/doctors", {
        ...newDoctorData,
        name: newDoctorData.name.trim(),
        email: newDoctorData.email.trim(),
        consultationFee: feeNum,
        experienceYears: Number(newDoctorData.experienceYears) || 0,
        hospital: newDoctorData.hospital.trim(),
        bio: newDoctorData.bio.trim()
      });
      setSuccessMsg("New doctor onboarded successfully!");
      setShowAddDoctorModal(false);
      setDoctorModalTouched({});
      fetchAdminData();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setDoctorModalError(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setAddingDoctor(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Admin Intelligence Dashboard...
      </div>
    );
  }

  // Filtered Doctors Calculation
  const filteredDoctors = doctorsList.filter((doc) => {
    const term = doctorSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      doc.user?.name?.toLowerCase().includes(term) ||
      doc.specialty?.name?.toLowerCase().includes(term) ||
      doc.hospital?.toLowerCase().includes(term) ||
      doc.user?.email?.toLowerCase().includes(term)
    );
  });
  const totalDoctorPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE) || 1;
  const paginatedDoctors = filteredDoctors.slice(
    (doctorPage - 1) * DOCTORS_PER_PAGE,
    doctorPage * DOCTORS_PER_PAGE
  );

  // Filtered Appointments Calculation
  const allAppointments = stats?.recentAppointments || [];
  const filteredAppointments = allAppointments.filter((apt) => {
    const matchesStatus = aptStatusFilter === "ALL" || apt.status === aptStatusFilter;
    const term = aptSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      apt.patient?.name?.toLowerCase().includes(term) ||
      apt.doctor?.user?.name?.toLowerCase().includes(term) ||
      apt.doctor?.specialty?.name?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });
  const totalAptPages = Math.ceil(filteredAppointments.length / APTS_PER_PAGE) || 1;
  const paginatedAppointments = filteredAppointments.slice(
    (aptPage - 1) * APTS_PER_PAGE,
    aptPage * APTS_PER_PAGE
  );

  // Filtered & Paginated Patients
  const filteredPatients = patientsList.filter((p) => {
    if (!patientSearch.trim()) return true;
    const q = patientSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });
  const totalPatientPages = Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE) || 1;
  const paginatedPatients = filteredPatients.slice(
    (patientPage - 1) * PATIENTS_PER_PAGE,
    patientPage * PATIENTS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Executive Management Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">CareSync Clinic Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time appointment volumes, revenue projections, and doctor onboarding.
          </p>
        </div>
        <button
          onClick={() => setShowAddDoctorModal(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Onboard New Doctor
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* KPI Cards (Always visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Patients"
          value={stats?.kpis?.totalPatients || 0}
          subtitle="Active patient accounts"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Doctors"
          value={stats?.kpis?.totalDoctors || 0}
          subtitle="Consulting medical specialists"
          icon={Stethoscope}
          color="teal"
        />
        <StatCard
          title="Total Appointments"
          value={stats?.kpis?.totalAppointments || 0}
          subtitle="Across all clinic branches"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Clinic Gross Revenue"
          value={`LKR ${(stats?.kpis?.totalRevenue || 0).toLocaleString()}`}
          subtitle="Confirmed consultation fees"
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Navigation View Switcher Tabs (Industry Standard) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "OVERVIEW"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Overview & Charts
        </button>
        <button
          onClick={() => {
            setActiveTab("DOCTORS");
            setDoctorPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "DOCTORS"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Doctors Directory ({doctorsList.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("PATIENTS");
            setPatientPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "PATIENTS"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          Patients Directory ({patientsList.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("APPOINTMENTS");
            setAptPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "APPOINTMENTS"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Consultations Feed ({allAppointments.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & RECHARTS */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Visual Analytics Charts (Recharts) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Revenue Growth Trend Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Monthly Revenue & Booking Growth (LKR)
                  </h3>
                  <p className="text-xs text-slate-400">Monthly gross consultations revenue analytics</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  +28% vs Last Quarter
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.monthlyRevenue || []}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `LKR ${val / 1000}k`} />
                    <Tooltip
                      formatter={(val) => [`LKR ${Number(val).toLocaleString()}`, "Revenue"]}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Specialty Distribution Bar Chart */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-teal-600" />
                  Specialist Breakdown
                </h3>
                <p className="text-xs text-slate-400">Doctors per clinical department</p>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.specialtyDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="doctorsCount" fill="#0d9488" radius={[8, 8, 0, 0]} name="Specialists" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTORS DIRECTORY (PAGINATED & SEARCHABLE) */}
      {activeTab === "DOCTORS" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Active Medical Specialists</h3>
              <p className="text-xs text-slate-400">Manage all verified consultants and clinical parameters</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  value={doctorSearch}
                  onChange={(e) => {
                    setDoctorSearch(e.target.value);
                    setDoctorPage(1);
                  }}
                  className="bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-xs w-48 sm:w-60"
                />
              </div>

              <button
                onClick={() => setShowAddDoctorModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Onboard Doctor
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {paginatedDoctors.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No specialists matched your search query.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Doctor & Contact</th>
                    <th className="px-6 py-3.5">Specialty</th>
                    <th className="px-6 py-3.5">Hospital Wing</th>
                    <th className="px-6 py-3.5">Consultation Fee</th>
                    <th className="px-6 py-3.5">Rating</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
                            alt={doc.user?.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.user?.name || 'Doctor')}&background=2563eb&color=fff&bold=true`;
                            }}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                          />
                          <div>
                            <Link to={`/doctors/${doc.id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors">
                              {doc.user?.name}
                            </Link>
                            <p className="text-[11px] text-slate-400">{doc.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {doc.specialty?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {doc.hospital}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        LKR {doc.consultationFee?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          ★ {doc.rating?.toFixed(1) || "4.8"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setToggleModalDoc(doc)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs cursor-pointer ${
                            doc.isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          }`}
                          title={doc.isActive ? "Click to Deactivate / Suspend" : "Click to Reactivate Doctor"}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              doc.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                            }`}
                          ></span>
                          {doc.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalDoctorPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <span>
                Showing Page <strong className="text-slate-900">{doctorPage}</strong> of <strong>{totalDoctorPages}</strong> ({filteredDoctors.length} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={doctorPage <= 1}
                  onClick={() => setDoctorPage((p) => p - 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <button
                  type="button"
                  disabled={doctorPage >= totalDoctorPages}
                  onClick={() => setDoctorPage((p) => p + 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PATIENTS DIRECTORY (PAGINATED & SEARCHABLE) */}
      {activeTab === "PATIENTS" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Registered Patient Base</h3>
              <p className="text-xs text-slate-400">All registered clinic patient accounts, contacts & consultation counts</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-1.5 focus-within:border-blue-500 focus-within:bg-white text-xs">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search patient by name, email, or phone..."
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setPatientPage(1);
                  }}
                  className="bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-xs w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {paginatedPatients.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No patient accounts matched your search query.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Patient Profile</th>
                    <th className="px-6 py-3.5">Contact Phone</th>
                    <th className="px-6 py-3.5">Registered Date</th>
                    <th className="px-6 py-3.5">Consultations History</th>
                    <th className="px-6 py-3.5 text-right">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPatients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pat.name)}`}
                            alt={pat.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pat.name || 'Patient')}&background=0D8ABC&color=fff&bold=true`;
                            }}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-sm text-slate-900">{pat.name}</p>
                            <p className="text-[11px] text-slate-400">{pat.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {pat.phone || <span className="text-slate-400 italic">Not Provided</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(pat.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          <Activity className="w-3.5 h-3.5 text-blue-600" />
                          {pat._count?.appointments || 0} Visits
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active Patient
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPatientPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <span>
                Showing Page <strong className="text-slate-900">{patientPage}</strong> of <strong>{totalPatientPages}</strong> ({filteredPatients.length} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={patientPage <= 1}
                  onClick={() => setPatientPage((p) => p - 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <button
                  type="button"
                  disabled={patientPage >= totalPatientPages}
                  onClick={() => setPatientPage((p) => p + 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: APPOINTMENTS FEED (PAGINATED & FILTERABLE) */}
      {activeTab === "APPOINTMENTS" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Recent Clinic Consultations</h3>
              <p className="text-xs text-slate-400">Live clinical logs, patient visits, and fees</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filters */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                {["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setAptStatusFilter(st);
                      setAptPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                      aptStatusFilter === st
                        ? "bg-white text-slate-900 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search patient or doctor..."
                  value={aptSearch}
                  onChange={(e) => {
                    setAptSearch(e.target.value);
                    setAptPage(1);
                  }}
                  className="bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-xs w-44"
                />
              </div>
            </div>
          </div>

          {paginatedAppointments.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No consultation records found in this category.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {paginatedAppointments.map((apt) => (
                <div key={apt.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {apt.patient?.name} <span className="text-slate-400 font-normal">consulting</span> {apt.doctor?.user?.name}
                      </h4>
                      <p className="text-slate-500">{apt.doctor?.specialty?.name} • {apt.appointmentDate} at {apt.appointmentTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="font-bold text-slate-800">LKR {apt.fee?.toLocaleString()}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : apt.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalAptPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <span>
                Showing Page <strong className="text-slate-900">{aptPage}</strong> of <strong>{totalAptPages}</strong> ({filteredAppointments.length} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={aptPage <= 1}
                  onClick={() => setAptPage((p) => p - 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <button
                  type="button"
                  disabled={aptPage >= totalAptPages}
                  onClick={() => setAptPage((p) => p + 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Onboard New Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={handleAddDoctorSubmit} autoComplete="off" className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Doctor Management</span>
                <h3 className="font-bold text-xl text-slate-900">Onboard New Medical Consultant</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddDoctorModal(false);
                  setDoctorModalError("");
                }}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            </div>

            {doctorModalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{doctorModalError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Doctor Full Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Doctor Full Name *</span>
                  {newDoctorData.name.trim().length >= 3 && !docErrors.name && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={newDoctorData.name}
                  onBlur={() => setDoctorModalTouched((p) => ({ ...p, name: true }))}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                  placeholder="e.g. Dr. Nihal Jayasinghe"
                  className={`w-full p-2.5 rounded-xl border text-xs transition-all ${
                    docErrors.name
                      ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-400/30"
                      : newDoctorData.name.trim().length >= 3
                      ? "border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {docErrors.name && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {docErrors.name}
                  </p>
                )}
              </div>

              {/* Specialty Discipline */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Specialty Discipline *</label>
                <select
                  value={newDoctorData.specialtyId}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, specialtyId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Doctor Login Email */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Doctor Login Email *</span>
                  {newDoctorData.email.trim() && !docErrors.email && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  required
                  autoComplete="new-email"
                  value={newDoctorData.email}
                  onBlur={() => setDoctorModalTouched((p) => ({ ...p, email: true }))}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, email: e.target.value })}
                  placeholder="dr.nihal@caresync.com"
                  className={`w-full p-2.5 rounded-xl border text-xs transition-all ${
                    docErrors.email
                      ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-400/30"
                      : newDoctorData.email.trim() && !docErrors.email
                      ? "border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {docErrors.email && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {docErrors.email}
                  </p>
                )}
              </div>

              {/* Initial Password */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Initial Password *</span>
                  {newDoctorData.password.length >= 6 && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={newDoctorData.password}
                  onBlur={() => setDoctorModalTouched((p) => ({ ...p, password: true }))}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, password: e.target.value })}
                  placeholder="doctor123"
                  className={`w-full p-2.5 rounded-xl border text-xs transition-all ${
                    docErrors.password
                      ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-400/30"
                      : newDoctorData.password.length >= 6
                      ? "border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {docErrors.password && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {docErrors.password}
                  </p>
                )}
              </div>

              {/* Qualifications */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Qualifications *</span>
                  {newDoctorData.qualifications.trim() && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={newDoctorData.qualifications}
                  onBlur={() => setDoctorModalTouched((p) => ({ ...p, qualifications: true }))}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, qualifications: e.target.value })}
                  placeholder="MBBS, MD (Cardiology)"
                  className={`w-full p-2.5 rounded-xl border text-xs transition-all ${
                    docErrors.qualifications
                      ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-400/30"
                      : newDoctorData.qualifications.trim()
                      ? "border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {docErrors.qualifications && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {docErrors.qualifications}
                  </p>
                )}
              </div>

              {/* Experience Years */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Experience (Years) *</span>
                  {Number(newDoctorData.experienceYears) >= 0 && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newDoctorData.experienceYears}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, experienceYears: Number(e.target.value) })}
                  placeholder="e.g. 6"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Consultation Fee (LKR) *</span>
                  {Number(newDoctorData.consultationFee) > 0 && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  value={newDoctorData.consultationFee}
                  onBlur={() => setDoctorModalTouched((p) => ({ ...p, consultationFee: true }))}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, consultationFee: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-xs transition-all ${
                    docErrors.consultationFee
                      ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-400/30"
                      : Number(newDoctorData.consultationFee) > 0
                      ? "border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {docErrors.consultationFee && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {docErrors.consultationFee}
                  </p>
                )}
              </div>

              {/* Hospital / Clinic Wing */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 uppercase mb-1">Hospital / Clinic Wing</label>
                <input
                  type="text"
                  value={newDoctorData.hospital}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, hospital: e.target.value })}
                  placeholder="CareSync Central Clinic, Colombo"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Doctor Bio */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 uppercase mb-1">Doctor Bio</label>
                <textarea
                  rows={2}
                  value={newDoctorData.bio}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, bio: e.target.value })}
                  placeholder="Short description of doctor's clinical expertise..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowAddDoctorModal(false)}
                className="w-1/3 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addingDoctor}
                className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                {addingDoctor ? "Registering..." : "Register Consultant"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SweetAlert Style Doctor Status Toggle Confirmation Modal */}
      {toggleModalDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ring-8 animate-pulse ${
                toggleModalDoc.isActive
                  ? "bg-rose-100 text-rose-600 ring-rose-50"
                  : "bg-emerald-100 text-emerald-600 ring-emerald-50"
              }`}
            >
              {toggleModalDoc.isActive ? (
                <AlertCircle className="w-8 h-8" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                {toggleModalDoc.isActive ? "Deactivate Specialist?" : "Reactivate Specialist?"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to change the status of{" "}
                <span className="font-bold text-slate-800">{toggleModalDoc.user?.name}</span> to{" "}
                <span
                  className={`font-extrabold ${
                    toggleModalDoc.isActive ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {toggleModalDoc.isActive ? "INACTIVE" : "ACTIVE"}
                </span>
                ?
              </p>
              <p
                className={`text-[11px] p-2.5 rounded-xl border font-medium ${
                  toggleModalDoc.isActive
                    ? "text-rose-700 bg-rose-50 border-rose-200"
                    : "text-emerald-700 bg-emerald-50 border-emerald-200"
                }`}
              >
                {toggleModalDoc.isActive
                  ? "Patients will not be able to book new consultations with this doctor until reactivated."
                  : "This doctor's profile and consultation schedule will become live for patients immediately."}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setToggleModalDoc(null)}
                disabled={togglingStatus}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                disabled={togglingStatus}
                className={`w-1/2 py-2.5 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all ${
                  toggleModalDoc.isActive
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                }`}
              >
                {togglingStatus
                  ? "Updating..."
                  : toggleModalDoc.isActive
                  ? "Yes, Deactivate"
                  : "Yes, Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}