import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAdminStats = async (req, res) => {
  try {
    const totalPatients = await prisma.user.count({ where: { role: "PATIENT" } });
    const totalDoctors = await prisma.doctor.count({ where: { isActive: true } });
    const totalAppointments = await prisma.appointment.count();

    const revenueResult = await prisma.appointment.aggregate({
      _sum: { fee: true },
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } }
    });
    const totalRevenue = revenueResult._sum.fee || 0;

    // Status breakdown
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ["status"],
      _count: { id: true }
    });

    // Specialty breakdown
    const specialtyDistribution = await prisma.specialty.findMany({
      select: {
        name: true,
        _count: { select: { doctors: true } }
      }
    });

    // Recent 10 appointments
    const recentAppointments = await prisma.appointment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        doctor: {
          include: {
            user: { select: { name: true } },
            specialty: true
          }
        },
        patient: { select: { name: true, email: true, phone: true } }
      }
    });

    // Revenue trend mock/aggregated data
    const monthlyRevenue = [
      { month: "Jan", revenue: 45000, appointments: 18 },
      { month: "Feb", revenue: 62000, appointments: 24 },
      { month: "Mar", revenue: 58000, appointments: 22 },
      { month: "Apr", revenue: 84000, appointments: 32 },
      { month: "May", revenue: 95000, appointments: 36 },
      { month: "Jun", revenue: 112000, appointments: 42 },
      { month: "Jul", revenue: 130000, appointments: 49 },
      { month: "Aug", revenue: 145000, appointments: 55 },
      { month: "Sep", revenue: totalRevenue > 0 ? totalRevenue : 160000, appointments: totalAppointments }
    ];

    return res.status(200).json({
      kpis: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalRevenue
      },
      appointmentsByStatus,
      specialtyDistribution: specialtyDistribution.map((s) => ({
        name: s.name,
        doctorsCount: s._count.doctors
      })),
      monthlyRevenue,
      recentAppointments
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return res.status(500).json({ message: "Failed to fetch admin statistics", error: error.message });
  }
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialtyId,
      bio,
      qualifications,
      experienceYears,
      consultationFee,
      workingDays,
      startTime,
      endTime,
      hospital
    } = req.body;

    if (!name || !email || !password || !specialtyId) {
      return res.status(400).json({ message: "Doctor Name, Email, Password, and Specialty are required." });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Doctor's full name must be at least 2 characters long." });
    }

    if (!isValidEmail(email.trim())) {
      return res.status(400).json({ message: "Please provide a valid email address (e.g., dr.name@caresync.com)." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Temporary password must be at least 6 characters long." });
    }

    const feeNum = Number(consultationFee);
    if (isNaN(feeNum) || feeNum <= 0) {
      return res.status(400).json({ message: "Consultation fee must be a valid positive number (e.g. 2500)." });
    }

    const expNum = Number(experienceYears);
    if (isNaN(expNum) || expNum < 0) {
      return res.status(400).json({ message: "Experience years must be a valid non-negative number." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ message: "An account with this email is already registered in the system." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || null,
        role: "DOCTOR",
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400"
      }
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialtyId,
        bio: bio || "Experienced specialist dedicated to clinical excellence.",
        qualifications: qualifications || "MBBS, MD",
        experienceYears: Number(experienceYears) || 5,
        consultationFee: Number(consultationFee) || 2500,
        workingDays: workingDays || "Monday,Tuesday,Wednesday,Thursday,Friday",
        startTime: startTime || "09:00",
        endTime: endTime || "17:00",
        hospital: hospital || "CareSync Central Clinic, Colombo"
      },
      include: {
        user: { select: { name: true, email: true } },
        specialty: true
      }
    });

    return res.status(201).json({
      message: "Doctor onboarded successfully",
      doctor
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);
    return res.status(500).json({ message: "Failed to create doctor", error: error.message });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Specialty name is required" });
    }

    const specialty = await prisma.specialty.create({
      data: {
        name: name.trim(),
        description: description || null,
        icon: icon || "Stethoscope"
      }
    });

    return res.status(201).json({ message: "Specialty created", specialty });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create specialty", error: error.message });
  }
};

export const toggleDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: { isActive: !doctor.isActive },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        specialty: true
      }
    });

    return res.status(200).json({
      message: `Doctor ${updatedDoctor.user?.name} is now ${updatedDoctor.isActive ? "Active" : "Inactive"}`,
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error("Toggle Doctor Status Error:", error);
    return res.status(500).json({ message: "Failed to update doctor status", error: error.message });
  }
};

