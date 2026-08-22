import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to format 24-hr time to 12-hr format (e.g. 09:30 -> "09:30 AM")
const formatTime12Hr = (time24) => {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

export const getAllDoctors = async (req, res) => {
  try {
    const { specialtyId, search } = req.query;

    const whereClause = {
      isActive: true,
      ...(specialtyId && { specialtyId }),
      ...(search && {
        OR: [
          { user: { name: { contains: search } } },
          { hospital: { contains: search } },
          { specialty: { name: { contains: search } } }
        ]
      })
    };

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatar: true }
        },
        specialty: true,
        _count: {
          select: { reviews: true, appointments: true }
        }
      },
      orderBy: { rating: "desc" }
    });

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    return res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatar: true }
        },
        specialty: true,
        reviews: {
          include: {
            patient: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch doctor details", error: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // Expected: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Appointment date parameter is required (YYYY-MM-DD)" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check day of week
    const dateObj = new Date(date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDay = dayNames[dateObj.getDay()];
    const workingDays = doctor.workingDays.split(",").map((d) => d.trim().toLowerCase());

    const isWorkingDay = workingDays.includes(targetDay.toLowerCase());
    if (!isWorkingDay) {
      return res.status(200).json({
        date,
        day: targetDay,
        isWorkingDay: false,
        message: `Doctor is not scheduled to work on ${targetDay}s`,
        slots: []
      });
    }

    // Fetch existing booked appointments
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: date,
        status: { in: ["PENDING", "CONFIRMED"] }
      },
      select: { appointmentTime: true }
    });

    const bookedTimeSet = new Set(bookedAppointments.map((a) => a.appointmentTime));

    // Generate slots
    const [startH, startM] = doctor.startTime.split(":").map(Number);
    const [endH, endM] = doctor.endTime.split(":").map(Number);
    const duration = doctor.slotDurationMinutes || 30;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const slots = [];

    while (currentMinutes + duration <= endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const time24 = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const time12 = formatTime12Hr(time24);

      slots.push({
        time24,
        time12,
        isAvailable: !bookedTimeSet.has(time12)
      });

      currentMinutes += duration;
    }

    return res.status(200).json({
      date,
      day: targetDay,
      isWorkingDay: true,
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.isAvailable).length,
      slots
    });
  } catch (error) {
    console.error("Slots Error:", error);
    return res.status(500).json({ message: "Failed to generate slots", error: error.message });
  }
};

export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await prisma.specialty.findMany({
      include: {
        _count: { select: { doctors: true } }
      }
    });

    return res.status(200).json({ specialties });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch specialties", error: error.message });
  }
};
