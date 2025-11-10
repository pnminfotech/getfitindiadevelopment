// import express, { Router } from 'express';
// import { blockSlot,unblockSlot,getBlockedOfCourt, getBlockedSlots, blockSlotsForMonth, } from '../controllers/blockController.js';
// import { unblockMonthSlots } from '../controllers/blockController.js';


// const router = express.Router();
// router.post('/', blockSlot);
// router.get('/blocked',getBlockedSlots);
// router.get('/:venueId/:courtId', getBlockedOfCourt);
// router.delete('/:id',unblockSlot);


// router.post('/bulk', blockSlotsForMonth);




// router.post('/unblock-month', unblockMonthSlots);



import { Router } from "express";
import {
  blockSlot, unblockSlot, getBlockedOfCourt,
  getBlockedSlots, blockSlotsForMonth, unblockMonthSlots
} from "../controllers/blockController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// // ✅ PUBLIC reads for UI
// router.get('/blocked', getBlockedSlots);
// router.get('/:venueId/:courtId', getBlockedOfCourt);

// // 🔒 ADMIN mutations
// router.post('/', authMiddleware("admin"), blockSlot);
// router.post('/bulk', authMiddleware("admin"), blockSlotsForMonth);
// router.post('/unblock-month', authMiddleware("admin"), unblockMonthSlots);
// router.delete('/:id', authMiddleware("admin"), unblockSlot);


// PUBLIC reads
router.get("/blocked", getBlockedSlots);
router.get("/:venueId/:courtId", getBlockedOfCourt);

// ADMIN mutations
router.post("/", authMiddleware("admin"), blockSlot);
router.post("/bulk", authMiddleware("admin"), blockSlotsForMonth);
router.post("/unblock-month", authMiddleware("admin"), unblockMonthSlots);
router.delete("/:id", authMiddleware("admin"), unblockSlot);

export default router;

