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
  Award
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

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, specRes, docRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/doctors/specialties"),
        API.get("/doctors")
      ]);
      setStats(statsRes.data);
      setSpecialties(specRes.data.specialties || []);
      setDoctorsList(docRes.data.doctors || []);
      if (specRes.data.specialties?.length > 0) {
        setNewDoctorData((prev) => ({ ...prev, specialtyId: specRes.data.specialties[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [doctorModalError, setDoctorModalError] = useState("");
  const [addingDoctor, setAddingDoctor] = useState(false);

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setDoctorModalError("");
    setAddingDoctor(true);
    try {
      await API.post("/admin/doctors", newDoctorData);
      setSuccessMsg("New doctor onboarded successfully!");
      setShowAddDoctorModal(false);
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
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* KPI Cards */}
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

      {/* Recent Appointments Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">Recent Clinic Consultations</h3>
          <span className="text-xs font-semibold text-slate-500">Live Hospital Feed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {stats?.recentAppointments?.map((apt) => (
            <div key={apt.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
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
      </div>

      {/* Consultant Doctors Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Active Medical Specialists</h3>
            <p className="text-xs text-slate-400">All registered consultants, consultation fees, and hospital locations</p>
          </div>
          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Onboard Doctor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Doctor & Contact</th>
                <th className="px-6 py-3.5">Specialty</th>
                <th className="px-6 py-3.5">Hospital / Clinic Wing</th>
                <th className="px-6 py-3.5">Fee</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctorsList.map((doc) => (
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
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
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
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={newDoctorData.name}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                  placeholder="e.g. Dr. Nihal Jayasinghe"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Specialty Discipline</label>
                <select
                  value={newDoctorData.specialtyId}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, specialtyId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Doctor Login Email</label>
                <input
                  type="email"
                  required
                  autoComplete="new-email"
                  value={newDoctorData.email}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, email: e.target.value })}
                  placeholder="dr.nihal@caresync.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={newDoctorData.password}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, password: e.target.value })}
                  placeholder="doctor123"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Qualifications</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={newDoctorData.qualifications}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, qualifications: e.target.value })}
                  placeholder="MBBS, MD (Cardiology)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Consultation Fee (LKR)</label>
                <input
                  type="number"
                  required
                  value={newDoctorData.consultationFee}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, consultationFee: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
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
                className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Register Consultant
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}