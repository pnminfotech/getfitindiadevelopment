import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  price: { type: Number, required: true },
});

const CourtSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VenueModel",
      required: true,
    },
    courtName: {
      type: String,
      required: true,
      trim: true,
    },
    sports: {
      type: [String],
      default: [],
    },
    slots: {
      type: [SlotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("CourtModel", CourtSchema);