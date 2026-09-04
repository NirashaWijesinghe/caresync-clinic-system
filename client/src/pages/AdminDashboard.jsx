import React, { useState, useEffect } from "react";
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
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  MapPin
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

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, specRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/doctors/specialties")
      ]);
      setStats(statsRes.data);
      setSpecialties(specRes.data.specialties || []);
      if (specRes.data.specialties?.length > 0) {
        setNewDoctorData((prev) => ({ ...prev, specialtyId: specRes.data.specialties[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/doctors", newDoctorData);
      setSuccessMsg("New consultant onboarded successfully!");
      setShowAddDoctorModal(false);
      fetchAdminData();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add doctor");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400 font-medium">
        Loading Admin Intelligence Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 rounded-3.5xl text-white shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Executive Clinic Management & Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">CareSync Analytics Hub</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Live clinic revenue performance, department distributions, and consultant onboarding.
          </p>
        </div>

        <button
          onClick={() => setShowAddDoctorModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 relative z-10 active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard Specialist</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-900 font-black hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats?.kpis?.totalPatients || 0}
          subtitle="Registered accounts"
          icon={Users}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Active Doctors"
          value={stats?.kpis?.totalDoctors || 0}
          subtitle="Medical specialists"
          icon={Stethoscope}
          color="teal"
          trend="Certified"
        />
        <StatCard
          title="Total Consultations"
          value={stats?.kpis?.totalAppointments || 0}
          subtitle="Clinic-wide visits"
          icon={Calendar}
          color="purple"
          trend="+18%"
        />
        <StatCard
          title="Clinic Gross Revenue"
          value={`LKR ${(stats?.kpis?.totalRevenue || 0).toLocaleString()}`}
          subtitle="Confirmed bookings"
          icon={DollarSign}
          color="amber"
          trend="+28%"
        />
      </div>

      {/* Visual Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Growth Trend Chart */}
        <div className="lg:col-span-8 bg-white p-7 rounded-3.5xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Monthly Revenue & Consultation Growth
              </h3>
              <p className="text-xs text-slate-400 font-medium">Gross revenue generated across all clinic branches</p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              +28% QoQ Growth
            </span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `LKR ${val / 1000}k`} />
                <Tooltip
                  formatter={(val) => [`LKR ${Number(val).toLocaleString()}`, "Gross Revenue"]}
                  contentStyle={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Specialty Distribution Bar Chart */}
        <div className="lg:col-span-4 bg-white p-7 rounded-3.5xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-teal-600" />
              Specialist Breakdown
            </h3>
            <p className="text-xs text-slate-400 font-medium">Doctors per clinical discipline</p>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.specialtyDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #e2e8f0" }} />
                <Bar dataKey="doctorsCount" fill="#0d9488" radius={[10, 10, 0, 0]} name="Specialists" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Appointments Feed */}
      <div className="bg-white rounded-3.5xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-lg text-slate-900">Recent Clinic Activity</h3>
            <p className="text-xs text-slate-500 font-medium">Live consultation logs across departments</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-100">
            Real-Time Stream
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {stats?.recentAppointments?.map((apt) => (
            <div key={apt.id} className="p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {apt.patient?.name} <span className="text-slate-400 font-normal">consulted</span> {apt.doctor?.user?.name}
                  </h4>
                  <p className="text-slate-500 font-medium">{apt.doctor?.specialty?.name} • {apt.appointmentDate} at {apt.appointmentTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="font-extrabold text-sm text-slate-900">LKR {apt.fee?.toLocaleString()}</span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    apt.status === "CONFIRMED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : apt.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboard New Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddDoctorSubmit} className="bg-white rounded-3.5xl max-w-2xl w-full p-8 sm:p-10 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" /> Doctor Onboarding Engine
                </span>
                <h3 className="font-black text-xl text-slate-900">Register Medical Consultant</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDoctorModal(false)}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  value={newDoctorData.name}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                  placeholder="e.g. Dr. Nihal Jayasinghe"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Specialty Discipline</label>
                <select
                  value={newDoctorData.specialtyId}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, specialtyId: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Login Email</label>
                <input
                  type="email"
                  required
                  value={newDoctorData.email}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, email: e.target.value })}
                  placeholder="dr.nihal@caresync.com"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newDoctorData.password}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, password: e.target.value })}
                  placeholder="doctor123"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Qualifications</label>
                <input
                  type="text"
                  value={newDoctorData.qualifications}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, qualifications: e.target.value })}
                  placeholder="MBBS, MD (Cardiology)"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Consultation Fee (LKR)</label>
                <input
                  type="number"
                  value={newDoctorData.consultationFee}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, consultationFee: Number(e.target.value) })}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowAddDoctorModal(false)}
                className="w-1/3 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Register Consultant</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}