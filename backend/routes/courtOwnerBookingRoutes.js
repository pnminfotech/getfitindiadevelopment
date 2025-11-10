// routes/courtOwnerBookingRoutes.js
import express from "express";
import { getOwnerBookings, getOwnerBookingStats ,getOwnerBookingById } from "../controllers/courtOwnerBookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Get all bookings for this owner
router.get("/", authMiddleware("court_owner"), getOwnerBookings);

// Dashboard summary cards
router.get("/stats", authMiddleware("court_owner"), getOwnerBookingStats);
// Single booking details
router.get("/:id", authMiddleware("court_owner"), getOwnerBookingById);

export default router;
