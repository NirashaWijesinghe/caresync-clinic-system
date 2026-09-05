import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import DoctorCard from "../components/DoctorCard";
import AppointmentModal from "../components/AppointmentModal";
import { Search, Stethoscope, X, Sparkles, CheckCircle2 } from "lucide-react";

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const specialtyQuery = searchParams.get("specialty") || "";
  const initialSearch = searchParams.get("search") || "";

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyQuery);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchSpecialties = async () => {
    try {
      const res = await API.get("/doctors/specialties");
      setSpecialties(res.data.specialties || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let url = "/doctors?";
      if (selectedSpecialty) url += `specialtyId=${selectedSpecialty}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
      const res = await API.get(url);
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleClearFilters = () => {
    setSelectedSpecialty("");
    setSearchTerm("");
    setSearchParams({});
    fetchDoctors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Verified Medical Specialists
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consult Specialist Doctors
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Filter by medical discipline or keyword to select an available 30-minute consultation slot.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          Showing <span className="text-blue-600 font-extrabold">{doctors.length}</span> Active Specialists
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 items-center">
          <div className="relative flex-1 w-full flex items-center bg-slate-50/90 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all px-4 py-1">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Search by doctor name, hospital, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1 text-slate-400 hover:text-slate-600 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            Search Panel
          </button>
          {(selectedSpecialty || searchTerm) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full sm:w-auto px-4 py-3.5 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex-shrink-0"
            >
              Reset Filters
            </button>
          )}
        </form>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedSpecialty("")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSpecialty === ""
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Specialties
          </button>
          {specialties.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSpecialty(s.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSpecialty === s.id
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookNow={(doc) => setSelectedDoctorForBooking(doc)}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Specialists Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No medical consultants matched your current filters. Try changing your search term or choosing "All Specialties".
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
          isOpen={!!selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onSuccess={() => fetchDoctors()}
        />
      )}
    </div>
  );
}