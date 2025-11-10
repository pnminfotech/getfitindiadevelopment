// // import mongoose from 'mongoose';
// // const BookingSchema = new mongoose.Schema({
// //   userId: mongoose.Schema.Types.ObjectId,
// //   facilityId: mongoose.Schema.Types.ObjectId,
// //   slotTime: String,
// //   status: { type: String, enum: ["paid", "pending"], default: "pending" },
// //   createdAt: { type: Date, default: Date.now },
// // });
// // export default mongoose.model('BookingModel', BookingSchema)



// // 1. 📁 models/BookingModel.js
// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueModel', required: true },
//   courtId: { type: String, required: true },
//   courtName: { type: String },
//   date: { type: Date, required: true },
//   startTime: { type: String, required: true },
//   endTime: { type: String, required: true },
//   // status: {
//   //   type: String,
//   //   enum: ['booked', 'cancelled'],
//   //   default: 'booked'
//   // }
// //   status: {
// //   type: String,
// //   enum: ["booked", "cancelled", "paid"], // include "paid"
// //   default: "booked"
// // }
// status: {
//   type: String,
//   enum: ["booked", "cancelled", "paid", "completed"], // ensure "paid" is allowed
//   default: "booked"
// },
// razorpay_payment_id: {
//   type: String
// },
// refundStatus: {
//   type: String,
//   enum: ["pending", "processed"],
//   default: "pending"
// }

// }, { timestamps: true });

// export default mongoose.model('Booking', bookingSchema);




// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueModel', required: true },
//   courtId: { type: String, required: true },
//   courtName: { type: String },
//   date: { type: Date, required: true },
//   startTime: { type: String, required: true },
//   endTime: { type: String, required: true },
//   price: { type: Number, required: true },   // ✅ Add this
//   status: {
//     type: String,
//     enum: ["pending", "paid", "cancelled", "completed"], // use "pending" for unpaid bookings
//     default: "pending",
//   },
//   // expires after 15 mins
//   // createdAt: { type: Date, default: Date.now, expires: 900 }, 
//   createdAt: { type: Date, default: Date.now },
//   // pendingAt: { type: Date, default: Date.now, expires: 900 },
//   razorpay_payment_id: { type: String },
//   refundStatus: { type: String, enum: ["pending", "processed"], default: "pending" },
// }, { timestamps: true });

// export default mongoose.model('Booking', bookingSchema);



import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "VenueModel", required: true },
    courtId: { type: String, required: true },
    courtName: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "completed"],
      default: "pending",
    },

    razorpay_payment_id: { type: String },
    refundStatus: {
      type: String,
      enum: ["pending", "processed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
bookingSchema.index({ venueId: 1, date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ razorpay_payment_id: 1 });
// ✅ No TTL index (MongoDB won't auto-delete now)

export default mongoose.model("Booking", bookingSchema);
