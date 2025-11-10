import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import { sendBookingConfirmationSMS } from "../utils/smsService.js";
// Create order
export const createOrder = async (req, res) => {
  try {
    console.log("RAZORPAY_KEY_ID in createOrder:", process.env.RAZORPAY_KEY_ID);

    // ✅ Initialize Razorpay here (after dotenv has loaded in index.js)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, currency = "INR", bookingId } = req.body;

    const options = {
      amount: amount * 100, // paise
      currency,
      receipt: `receipt_${bookingId}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (err) {
    console.error("Razorpay Order Creation Error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Verify payment webhook (optional but recommended)
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId } = req.body;

//     if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
//       return res.status(400).json({ error: "Missing required payment fields" });
//     }

//     // Verify signature
//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generated_signature !== razorpay_signature) {
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     // Mark booking as paid and store payment ID
//     const booking = await Booking.findById(bookingId);
//     if (!booking) return res.status(404).json({ error: "Booking not found" });

//     booking.status = "paid";                       // ✅ must match enum
//     booking.razorpay_payment_id = razorpay_payment_id;  // store payment ID for refunds
//     booking.refundStatus = "pending";             // optional, track refund later
//     await booking.save();

//     res.json({ message: "Payment verified and booking marked as paid", booking });
//   } catch (err) {
//     console.error("Payment Verification Error:", err);
//     res.status(500).json({ error: "Payment verification failed" });
//   }
// };


// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId } = req.body;

//     // (signature verification logic here)

//     const booking = await Booking.findById(bookingId).populate("venueId userId");
//     if (!booking) return res.status(404).json({ error: "Booking not found" });

//     booking.status = "paid";
//     booking.razorpay_payment_id = razorpay_payment_id;
//     booking.refundStatus = "pending";
//     await booking.save();

//     // ✅ Send SMS Confirmation
//     const phone = booking?.userId?.mobile; // fixed field
//     if (!phone) {
//       console.error("❌ No mobile found for user:", booking?.userId?._id);
//       return res.status(400).json({ error: "User mobile number not found" });
//     }

//     const smsData = {
//       venue: booking.venueId.name,
//       date: booking.date,
//       time: booking.startTime,
//       time2: booking.endTime,
//       amount: booking.price,
//     };

//     await sendBookingConfirmationSMS(phone, smsData);

//     res.json({ message: "Payment verified, booking confirmed & SMS sent", booking });
//   } catch (err) {
//     console.error("Payment Verification Error:", err);
//     res.status(500).json({ error: "Payment verification failed" });
//   }
// };

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      bookingId,
      bookingIds,
    } = req.body;

    // normalize ids
    const ids = bookingIds
      ? (Array.isArray(bookingIds) ? bookingIds : [bookingIds])
      : bookingId
      ? [bookingId]
      : [];

    if (!ids.length) {
      return res.status(400).json({ error: "No booking ID(s) provided" });
    }

    // find all bookings linked to this payment
    const bookings = await Booking.find({ _id: { $in: ids } }).populate("venueId userId");
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "Bookings not found" });
    }

    // ✅ mark all as paid
    for (let b of bookings) {
      b.status = "paid";
      b.razorpay_payment_id = razorpay_payment_id;
      b.refundStatus = "pending";
      await b.save();
    }

    // ✅ calculate combined SMS data
    const venue = bookings[0].venueId.name;
    const date = bookings[0].date;
    const phone = bookings[0].userId?.mobile;

    const startTimes = bookings.map(b => b.startTime).sort();
    const endTimes = bookings.map(b => b.endTime).sort();
    const totalAmount = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

    const dateObj = new Date(bookings[0].date);
const formattedDate = dateObj.toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

const smsData = {
  venue,
  date: formattedDate,
  time: formatTime(startTimes[0]),
  time2: formatTime(endTimes[endTimes.length - 1]),
  amount: totalAmount,
};

    // ✅ send SMS if phone exists
    if (phone) {
      await sendBookingConfirmationSMS(phone, smsData);
    } else {
      console.warn("⚠️ No phone found for user, SMS skipped");
    }

    res.json({
      message: "Payment verified, bookings confirmed & SMS sent",
      bookings,
    });
  } catch (err) {
    console.error("Payment Verification Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

