import mongoose from "mongoose";

const otpEventSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mobile: { type: String, index: true },
  type:   { type: String, enum: ["request","resend","verify_ok","verify_fail","locked","cooldown"], required: true },
  reason: { type: String }, // e.g., "too_many_requests", "too_many_fails", "blocked_by_admin"
  ip:     { type: String },
  ua:     { type: String },
  at:     { type: Date, default: Date.now, index: true }
}, { versionKey: false });

export default mongoose.model("OtpEvent", otpEventSchema);
