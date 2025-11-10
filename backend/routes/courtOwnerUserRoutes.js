import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getCourtOwnerUsers,
  toggleCourtOwnerUserBlock,
} from "../controllers/courtOwnerUserController.js";
import { exportReportPDF, exportReportExcel } from "../controllers/courtOwnerReportController.js";
const router = express.Router();

router.get("/users", authMiddleware("court_owner"), getCourtOwnerUsers);
router.patch("/users/:userId/block", authMiddleware("court_owner"), toggleCourtOwnerUserBlock);

router.get("/export/pdf", authMiddleware("court_owner"), exportReportPDF);
router.get("/export/excel", authMiddleware("court_owner"), exportReportExcel);

export default router;
