import express from "express";
import {
  addCourtOwnerBlockedSlot,
  getCourtOwnerBlockedSlots,
  deleteCourtOwnerBlockedSlot,
} from "../controllers/courtOwnerBlockedSlotController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a block (only for own courts)
router.post("/", authMiddleware("court_owner"), addCourtOwnerBlockedSlot);

// Get blocks for a specific court
router.get("/:courtId", authMiddleware("court_owner"), getCourtOwnerBlockedSlots);

// Delete a block (only if owner created it)
router.delete("/:id", authMiddleware("court_owner"), deleteCourtOwnerBlockedSlot);

export default router;
