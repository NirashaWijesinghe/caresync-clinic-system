import express from "express";
import {
  createAppointment,
  getMyPatientAppointments,
  getMyDoctorAppointments,
  updateAppointmentDetails,
  cancelAppointment,
  createReview,
  getPatientMedicalHistory
} from "../controllers/appointmentController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patient routes
router.post("/", authenticate, authorizeRoles("PATIENT", "ADMIN"), createAppointment);
router.get("/patient", authenticate, authorizeRoles("PATIENT", "ADMIN"), getMyPatientAppointments);
router.patch("/:id/cancel", authenticate, cancelAppointment);
router.post("/reviews", authenticate, authorizeRoles("PATIENT"), createReview);

// Doctor routes
router.get("/doctor", authenticate, authorizeRoles("DOCTOR", "ADMIN"), getMyDoctorAppointments);
router.get("/patient-history/:patientId", authenticate, authorizeRoles("DOCTOR", "ADMIN"), getPatientMedicalHistory);
router.patch("/:id/details", authenticate, authorizeRoles("DOCTOR", "ADMIN"), updateAppointmentDetails);

export default router;
