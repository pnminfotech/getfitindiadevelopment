// // routes/userRoutes.js
// import express from "express";
// import { getMe, updateMe,getAllUsers } from "../controllers/userController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";
// import { updateUserLocation } from "../controllers/userController.js";
// const router = express.Router();
// router.get("/", authMiddleware, getAllUsers);


// router.get("/me", authMiddleware, getMe); 
// router.put("/me", authMiddleware, updateMe);
// router.post("/location", authMiddleware, updateUserLocation);

// export default router; // ✅ ES module default export



import express from "express";
import {
  getMe,
  updateMe,
  getAllUsers,
  updateUserLocation,
  getAvailableSlots
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { toggleBlockUser } from "../controllers/userController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// // ✅ Authenticated routes
// router.get("/me", authMiddleware, getMe);
// router.put("/me", authMiddleware, updateMe);
// router.post("/location", authMiddleware, updateUserLocation);

// // ✅ Admin-only or internal listing route
// router.get("/", authMiddleware, getAllUsers);

// // ✅ Court slot availability (protected route)
// router.get("/slots/:venueId/:courtId", authMiddleware, getAvailableSlots);


// router.patch("/:id/block", authMiddleware, isAdmin, toggleBlockUser);


// These routes are reached only after authMiddleware("admin") in index.js
router.get("/", isAdmin, getAllUsers);
router.patch("/:id/block", isAdmin, toggleBlockUser);

export default router;

