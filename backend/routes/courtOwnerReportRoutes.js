import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  ownerReportsSummary,
  ownerReportsCalendar,
  ownerReportsList, ownerReportsByDate,
} from "../controllers/courtOwnerReportController.js";

const router = express.Router();

// All endpoints require a valid court_owner token
router.get("/summary",  authMiddleware("court_owner"), ownerReportsSummary);
router.get("/calendar", authMiddleware("court_owner"), ownerReportsCalendar);
router.get("/list",     authMiddleware("court_owner"), ownerReportsList);
router.get("/bydate", authMiddleware("court_owner"), ownerReportsByDate);
export default router;
