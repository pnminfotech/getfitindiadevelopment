import express from "express";
import upload from "../middlewares/upload.js";

import { createVenue } from "../controllers/venueController.js";
import {
  registerCourtOwner,
  loginCourtOwner,
  getProfile,
  updateProfile,
  getOwnerVenues,
  updateOwnerVenue,
  deleteOwnerVenue,
} from "../controllers/courtOwnerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { exportReportPDF, exportReportExcel } from "../controllers/courtOwnerReportController.js";

const router = express.Router();

router.post("/register", registerCourtOwner);
router.post("/login", loginCourtOwner);
router.get("/profile", authMiddleware("court_owner"), getProfile);

router.post(
  "/venues/owner",
  authMiddleware("court_owner"),
  upload.single("image"),
  createVenue
);

router.put("/profile", authMiddleware("court_owner"), updateProfile);
router.get("/venues", authMiddleware("court_owner"), getOwnerVenues);
router.put(
  "/venues/:id",
  authMiddleware("court_owner"),
  upload.single("image"),
  updateOwnerVenue
);
router.delete("/venues/:id", authMiddleware("court_owner"), deleteOwnerVenue);
router.get("/reports/export/pdf", authMiddleware("court_owner"), exportReportPDF);
router.get("/reports/export/excel", authMiddleware("court_owner"), exportReportExcel);

export default router;
