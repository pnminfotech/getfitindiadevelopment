// routes/adminOtpRoutes.js
import express from "express";
import OtpEvent from "../models/OtpEvent.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/admin/otp-events?mobile=91XXXXXXXXXX&limit=100
router.get("/otp-events", authMiddleware("admin"), async (req, res) => {
  const { mobile, limit = 100 } = req.query;
  const q = {};
  if (mobile) q.mobile = mobile;
  const rows = await OtpEvent.find(q).sort({ at: -1 }).limit(Number(limit));
  res.json(rows);
});

// GET /api/admin/otp-stats/top-requesters (last 24h)
router.get("/otp-stats/top-requesters", authMiddleware("admin"), async (req, res) => {
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  const rows = await OtpEvent.aggregate([
    { $match: { at: { $gte: since }, type: { $in: ["request","resend"] } } },
    { $group: { _id: "$mobile", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 50 }
  ]);
  res.json(rows);
});

export default router;
