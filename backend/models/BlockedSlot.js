// import mongoose from 'mongoose';

// const BlockedSlotSchema = new mongoose.Schema({
//   venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueModel' },
//   courtId: { type: mongoose.Schema.Types.ObjectId },
//   date: { type: Date },
//   startDate: { type: Date }, // only for monthly block
//   endDate: { type: Date },   // only for monthly block
//   startTime: { type: String }, // ✅ Add this
//   endTime: { type: String },   // ✅ Add this
// });

// export default mongoose.model('BlockedSlotModel', BlockedSlotSchema);



// models/BlockedSlotModel.js
import mongoose from "mongoose";

const BlockedSlotSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: "VenueModel", required: true },
  courtId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date },
  startDate: { type: Date }, // for monthly block
  endDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  blockedBy: { type: String, enum: ["admin", "court_owner"], required: true },
}, { timestamps: true });

export default mongoose.model("BlockedSlotModel", BlockedSlotSchema);
