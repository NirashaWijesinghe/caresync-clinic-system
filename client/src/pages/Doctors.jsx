import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import DoctorCard from "../components/DoctorCard";
import AppointmentModal from "../components/AppointmentModal";
import { Search, Stethoscope } from "lucide-react";

export default function Doctors() {
  const [searchParams] = useSearchParams();
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Specialist Directory
        </h1>
        <p className="text-sm text-slate-500">
          Browse certified healthcare specialists and book immediate clinic consultations
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedSpecialty("")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSpecialty === ""
                ? "bg-blue-600 text-white shadow-sm"
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
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search doctor or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Search
          </button>
        </form>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
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
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
          <p className="text-xs text-slate-500">
            No active medical consultants matched your filter criteria. Try clearing search filters.
          </p>
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