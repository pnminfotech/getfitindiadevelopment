// models/AdminAlert.js
import mongoose from 'mongoose';

const adminAlertSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. "otp_lock"
  mobile: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String },               // "too_many_sends" | "too_many_verifies"
  meta: { type: Object, default: {} },    // counts, windowStart, etc.
}, { timestamps: true });

export default mongoose.model('AdminAlert', adminAlertSchema);
