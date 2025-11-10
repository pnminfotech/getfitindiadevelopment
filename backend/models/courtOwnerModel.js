import mongoose from "mongoose";
import bcrypt from "bcrypt";

const courtOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true }, // Hashed
    businessName: { type: String },
    documents: {
      gst: String,
      idProof: String,
      agreement: String,
    },
    paymentInfo: {
      upiId: String,
      bank: {
        accountNumber: String,
        ifsc: String,
        holderName: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Hash password before save
courtOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
courtOwnerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("CourtOwner", courtOwnerSchema);
