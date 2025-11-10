import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  name: String,
  city: String,
  gender: {
  type: String,
  enum: ['Male', 'Female', 'Other'],
  default: 'Male',
},
dateOfBirth: Date,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  sportsPreferences: [String],
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'coach', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);

