import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  getAvailableSlots,
  getAllSpecialties
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/specialties", getAllSpecialties);
router.get("/:id", getDoctorById);
router.get("/:doctorId/slots", getAvailableSlots);

export default router;
