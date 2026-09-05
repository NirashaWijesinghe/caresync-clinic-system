import express from "express";
import {
  getAdminStats,
  createDoctor,
  createSpecialty,
  toggleDoctorStatus,
  getAllPatients
} from "../controllers/adminController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/stats", getAdminStats);
router.get("/patients", getAllPatients);
router.post("/doctors", createDoctor);
router.patch("/doctors/:id/toggle-status", toggleDoctorStatus);
router.post("/specialties", createSpecialty);

export default router;
