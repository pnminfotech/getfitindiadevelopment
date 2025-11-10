import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// Create Razorpay order for a booking
paymentRouter.post("/order", createOrder);

// Verify payment and mark booking as paid
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;
