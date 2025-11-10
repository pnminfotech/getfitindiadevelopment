// // import express from 'express';
// // import { createBooking, getUserBookings, cancelBooking, getAllBookings,cancelPendingBookings } from '../controllers/bookingController.js';
// // import { authMiddleware } from '../middlewares/authMiddleware.js';
// // import { isAdmin } from "../middlewares/roleMiddleware.js";
// // const router = express.Router();

// // router.post("/", authMiddleware, createBooking);
// // router.get("/mybookings", authMiddleware, getUserBookings);
// // router.put("/cancel/:id", authMiddleware, cancelBooking);
// // // (optional: admin only)
// // // router.get("/all", authMiddleware, getAllBookings); 



// // router.get("/all", authMiddleware, isAdmin, getAllBookings);
// // router.post("/cancel-pending", authMiddleware, cancelPendingBookings);
// // export default router;




// import express from 'express';
// import {
//   getUserBookings,
//   cancelBooking,
//   getAllBookings,
//   cancelPendingBookings,
//   createRazorpayOrder,
//   confirmBookingAfterPayment
// } from '../controllers/bookingController.js';

// import { authMiddleware } from '../middlewares/authMiddleware.js';
// import { isAdmin } from "../middlewares/roleMiddleware.js";

// const router = express.Router();

// // 🔄 OLD flow (remove/comment this out)
// // router.post("/", authMiddleware, createBooking);

// // // ✅ New flow
// // router.post("/create-order", authMiddleware, createRazorpayOrder);
// // router.post("/confirm-payment", authMiddleware, confirmBookingAfterPayment);

// // router.get("/mybookings", authMiddleware, getUserBookings);
// // router.put("/cancel/:id", authMiddleware, cancelBooking);

// // // Admin only
// // router.get("/all", authMiddleware, isAdmin, getAllBookings);

// // router.post("/cancel-pending", authMiddleware, cancelPendingBookings);





// // New flow
// router.post("/create-order", createRazorpayOrder);
// router.post("/confirm-payment", confirmBookingAfterPayment);

// router.get("/mybookings", getUserBookings);
// router.put("/cancel/:id", cancelBooking);

// // Admin-only (still needs admin check even though this router is mounted as user)
// router.get("/all", isAdmin, getAllBookings);

// // If cancel-pending is an admin batch op, keep it admin-only too:
// router.post("/cancel-pending", isAdmin, cancelPendingBookings);



// export default router;


// routes/bookingRoutes.js
import express from "express";
import {
  getUserBookings,
  cancelBooking,
  getAllBookings,
  cancelPendingBookings,
  createRazorpayOrder,
  confirmBookingAfterPayment,
} from "../controllers/bookingController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/** USER routes (any authenticated user; index.js uses authMiddleware()) */
router.post("/create-order",       createRazorpayOrder);
router.post("/confirm-payment",    confirmBookingAfterPayment);
router.get("/mybookings",          getUserBookings);
router.put("/cancel/:id",          cancelBooking);

/** ADMIN routes */
router.get("/all",                 isAdmin, getAllBookings);
router.post("/cancel-pending",     isAdmin, cancelPendingBookings);

export default router;
