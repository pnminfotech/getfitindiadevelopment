// import express from 'express';
// import {
//   getAllCourts,        // ✅ new
//   getSlotsOfCourt,     // ✅ new
//   createCourt,
//   updateCourt,
//   deleteCourt
// } from '../controllers/slotController.js';
// import { getCourtBookings } from '../controllers/bookingController.js';
// import {getAvailableSlots} from '../controllers/userController.js';
// // import {blockSlot, unblockSlot} from '../controllers/blockController.js'
// const slotRouter = express.Router();

// // Admin: Get all courts in a venue
// slotRouter.get("/:venueId/courts", getAllCourts);
// slotRouter.post("/:venueId/courts", createCourt);
// slotRouter.put("/:venueId/courts/:courtId", updateCourt);
// slotRouter.delete("/:venueId/courts/:courtId", deleteCourt);

// // Booking: Get all slots for a court (raw court slots)
// slotRouter.get("/:venueId/:courtId/slots", getSlotsOfCourt);

// // Booking: Get bookings for a court
// slotRouter.get("/:venueId/:courtId/bookings", getCourtBookings);

// // Booking: Get available slots for a court and date
// slotRouter.get("/:venueId/:courtId/available", getAvailableSlots);


// export default slotRouter;



// import express from 'express';
// import {
//   getAllCourts,        // ✅ new
//   getSlotsOfCourt,     // ✅ new
//   createCourt,
//   updateCourt,
//   deleteCourt
// } from '../controllers/slotController.js';
// import { getCourtBookings } from '../controllers/bookingController.js';
// import {getAvailableSlots} from '../controllers/userController.js';
// import {blockSlot, unblockSlot} from '../controllers/blockController.js'
// const slotRouter = express.Router();

// // ✅ PUBLIC reads for UI
// router.get("/:venueId/:courtId/available", getAvailableSlots);
// router.get("/:venueId/:courtId/bookings", getCourtBookings);

// // (optional) public:
// router.get("/:venueId/:courtId/slots", getSlotsOfCourt);

// // 🔒 ADMIN court CRUD only
// router.post("/:venueId/courts", authMiddleware("admin"), createCourt);
// router.put("/:venueId/courts/:courtId", authMiddleware("admin"), updateCourt);
// router.delete("/:venueId/courts/:courtId", authMiddleware("admin"), deleteCourt);

// export default router;


// routes/slotRoutes.js
import express from "express";
import {
  getAllCourts,
  getSlotsOfCourt,
  createCourt,
  updateCourt,
  deleteCourt,
} from "../controllers/slotController.js";
import { getCourtBookings } from "../controllers/bookingController.js";
import { getAvailableSlots } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const slotRouter = express.Router();

/* ---------- PUBLIC reads for the booking UI ---------- */
slotRouter.get("/:venueId/:courtId/available", getAvailableSlots);
slotRouter.get("/:venueId/:courtId/bookings", getCourtBookings);
slotRouter.get("/:venueId/:courtId/slots", getSlotsOfCourt);

// (optional) if you need courts listing public:
slotRouter.get("/:venueId/courts", getAllCourts);

/* ---------- ADMIN-only court CRUD ---------- */
slotRouter.post("/:venueId/courts", authMiddleware("admin"), createCourt);
slotRouter.put("/:venueId/courts/:courtId", authMiddleware("admin"), updateCourt);
slotRouter.delete("/:venueId/courts/:courtId", authMiddleware("admin"), deleteCourt);

export default slotRouter;
