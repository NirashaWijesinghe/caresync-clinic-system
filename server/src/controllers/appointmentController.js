import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId, appointmentDate, appointmentTime, symptoms } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: "Doctor, appointment date, and appointment time are required."
      });
    }

    // Validate that appointment date is today or a future date
    const todayStr = new Date().toISOString().split("T")[0];
    if (appointmentDate < todayStr) {
      return res.status(400).json({
        message: "Cannot book an appointment for a past date. Please select today or a future date."
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: true }
    });

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ message: "Doctor not found or inactive" });
    }

    // Check if slot is already booked
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "Selected time slot is already booked. Please choose another slot."
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
        symptoms: symptoms || "Routine medical consultation",
        fee: doctor.consultationFee,
        status: "CONFIRMED",
        paymentStatus: "PAID"
      },
      include: {
        doctor: {
          include: {
            user: { select: { name: true, avatar: true } },
            specialty: true
          }
        },
        patient: {
          select: { name: true, email: true, phone: true }
        }
      }
    });

    return res.status(201).json({
      message: "Appointment booked successfully!",
      appointment
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    return res.status(500).json({ message: "Failed to create appointment", error: error.message });
  }
};

export const getMyPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: {
            user: { select: { name: true, avatar: true, phone: true } },
            specialty: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};

export const getMyDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, status } = req.query;

    const doctor = await prisma.doctor.findUnique({
      where: { userId }
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found for this user" });
    }

    const whereClause = {
      doctorId: doctor.id,
      ...(date && { appointmentDate: date }),
      ...(status && { status })
    };

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: { id: true, name: true, email: true, phone: true, avatar: true }
        }
      },
      orderBy: { appointmentDate: "asc" }
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch doctor appointments", error: error.message });
  }
};

export const updateAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, diagnosisNotes, prescription } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const trimmedDiagnosis = diagnosisNotes !== undefined ? diagnosisNotes.trim() : undefined;
    const trimmedPrescription = prescription !== undefined ? prescription.trim() : undefined;

    if (trimmedDiagnosis !== undefined && trimmedDiagnosis.length > 0 && trimmedDiagnosis.length < 3) {
      return res.status(400).json({ message: "Diagnosis notes must be at least 3 characters long." });
    }

    if (trimmedPrescription !== undefined && trimmedPrescription.length > 0 && trimmedPrescription.length < 3) {
      return res.status(400).json({ message: "Prescription must be at least 3 characters long." });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trimmedDiagnosis !== undefined && { diagnosisNotes: trimmedDiagnosis }),
        ...(trimmedPrescription !== undefined && { prescription: trimmedPrescription })
      },
      include: {
        doctor: {
          include: { user: { select: { name: true } }, specialty: true }
        },
        patient: { select: { name: true, email: true } }
      }
    });

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update appointment", error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only cancel your own appointments" });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    return res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel appointment", error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId, rating, comment } = req.body;

    if (!doctorId || rating === undefined || !comment) {
      return res.status(400).json({ message: "Doctor, star rating (1-5), and review comment are required." });
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5 stars." });
    }

    if (comment.trim().length < 3) {
      return res.status(400).json({ message: "Review comment must be at least 3 characters long." });
    }

    const review = await prisma.review.create({
      data: {
        patientId,
        doctorId,
        rating: numRating,
        comment: comment.trim()
      }
    });

    // Update doctor average rating
    const allDoctorReviews = await prisma.review.findMany({
      where: { doctorId },
      select: { rating: true }
    });

    const avgRating =
      allDoctorReviews.reduce((sum, r) => sum + r.rating, 0) / allDoctorReviews.length;

    await prisma.doctor.update({
      where: { id: doctorId },
      data: { rating: Number(avgRating.toFixed(1)) }
    });

    return res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit review", error: error.message });
  }
};
