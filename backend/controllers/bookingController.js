import Booking from '../models/Booking.js';
import Venue from '../models/VenueModel.js';
import BlockedSlot from '../models/BlockedSlot.js';
import Razorpay from 'razorpay';
import { sendBookingConfirmationSMS ,sendBookingCancelledSMS } from "../utils/smsService.js";
// export const createBooking = async (req, res) => {
//   console.log("🧾 Incoming Booking Payload:", req.body);
//   console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

//   // Initialize Razorpay here (env will be available now)
//   const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });

//   try {
//     const {
//       venueId,
//       courtId,
//       courtName,
//       date,
//       selectedSlots,
//     } = req.body;

//     const userId = req.user.id;
//     const bookingsToSave = [];
//     let totalAmount = 0;

//     for (const slot of selectedSlots) {
//       const { startTime, endTime, price } = slot;

//       // Prevent double-booking
//       const alreadyBooked = await Booking.findOne({
//         venueId,
//         courtId,
//         date,
//         startTime,
//         endTime,
//         status: { $in: ["pending", "paid"] },  // block both pending + paid
//       });

//       if (alreadyBooked) {
//         return res.status(400).json({
//           message: `Slot from ${startTime} to ${endTime} is already booked.`,
//         });
//       }

//       const isBlocked = await BlockedSlot.findOne({
//         venueId,
//         courtId,
//         date,
//         startTime,
//         endTime,
//       });

//       if (isBlocked) {
//         return res.status(400).json({
//           message: `Slot from ${startTime} to ${endTime} is blocked by admin.`,
//         });
//       }

//       const slotPrice = price || 0;
//       totalAmount += slotPrice;

//       bookingsToSave.push({
//         userId,
//         venueId,
//         courtId,
//         courtName,
//         date,
//         startTime,
//         endTime,
//         price: slotPrice,
//        status: "pending",
//       });
//     }

//     const savedBookings = await Booking.insertMany(bookingsToSave);

//     const options = {
//       amount: totalAmount * 100,
//       currency: "INR",
//       receipt: `receipt_${savedBookings[0]._id}`,
//       payment_capture: 1,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(201).json({
//       bookings: savedBookings,
//       razorpayOrder: order,
//       amount: totalAmount,
//     });
//   } catch (err) {
//     console.error("Booking creation error:", err);
//     res.status(500).json({ message: "Server error while booking slots" });
//   }
// };




// GET /api/bookings/:venueId/:courtId
export const getCourtBookings = async (req, res) => {
  try {
    const { venueId, courtId } = req.params;
    const bookings = await Booking.find({
      venueId,
      courtId,
       status: { $in: ["pending", "paid"] }, 
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate('venueId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


// export const cancelBooking = async (req, res) => {
//   const bookingId = req.params.id;

//   // Initialize Razorpay instance here
//   const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });

//   try {
//     const booking = await Booking.findById(bookingId);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     // Check if booking is already cancelled
//     if (booking.status === "cancelled") {
//       return res.status(400).json({ message: "Booking is already cancelled" });
//     }

//     // If booking is paid, trigger refund
//     if (booking.status === "paid" && booking.razorpay_payment_id) {
//       try {
//         // Refund full amount
//         const refund = await razorpay.payments.refund(booking.razorpay_payment_id, {
//           notes: { reason: "User cancelled booking" },
//         });

//         booking.refundStatus = "processed"; // track refund status
//         console.log("Refund successful:", refund);
//       } catch (refundErr) {
//         console.error("Refund failed:", refundErr);
//         return res.status(500).json({
//           message: "Booking cancellation failed. Refund could not be processed.",
//         });
//       }
//     }

//     // Update booking status to cancelled
//     booking.status = "cancelled";
//     await booking.save();

//     res.json({ message: "Booking cancelled successfully", booking });
//   } catch (err) {
//     console.error("Cancel booking failed:", err.message);
//     res.status(500).json({ message: "Failed to cancel booking" });
//   }
// };

// export const cancelBooking = async (req, res) => {
//   const bookingId = req.params.id;

//   try {
//     const booking = await Booking.findById(bookingId);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     booking.status = "cancelled";
//     await booking.save();

//     res.json({ message: "Booking cancelled", booking });
//   } catch (err) {
//     console.error("Cancel booking failed:", err.message);
//     res.status(500).json({ message: "Failed to cancel booking" });
//   }
// };

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('venueId userId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
};



export const cancelBooking = async (req, res) => {
  const bookingIds = req.params.id.split(","); // can cancel multiple

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const bookings = await Booking.find({ _id: { $in: bookingIds } }).populate("venueId userId");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "Booking(s) not found" });
    }

    let totalAmount = 0;
    let startTimes = [];
    let endTimes = [];

    for (let booking of bookings) {
      if (booking.status === "cancelled") continue;

      // ✅ Refund only if paid
      if (booking.status === "paid" && booking.razorpay_payment_id) {
        try {
          await razorpay.payments.refund(booking.razorpay_payment_id, {
            amount: booking.price * 100, // refund exact amount in paise
            notes: { reason: "User cancelled booking" },
          });
          booking.refundStatus = "processed";
        } catch (refundErr) {
          console.error("Refund failed:", refundErr.error || refundErr);
          return res.status(500).json({
            message: "Booking cancellation failed. Refund could not be processed.",
            error: refundErr.error || refundErr.message,
          });
        }
      }

      booking.status = "cancelled";
      await booking.save();

      totalAmount += booking.price || 0;
      startTimes.push(booking.startTime);
      endTimes.push(booking.endTime);
    }

    // SMS part
    const earliestStart = startTimes.sort()[0];
    const latestEnd = endTimes.sort()[endTimes.length - 1];
    const dateObj = new Date(bookings[0].date);
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const phone = bookings[0]?.userId?.mobile;
    if (phone) {
      const smsData = {
        venue: bookings[0].venueId.name,
        date: formattedDate,
        time: earliestStart,
        time1: latestEnd,
        amount: totalAmount,
      };
      await sendBookingCancelledSMS(phone, smsData);
    }

    res.json({ message: "Booking(s) cancelled successfully", bookings });
  } catch (err) {
    console.error("Cancel booking failed:", err.message);
    res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
};


// Cancel pending bookings
export const cancelPendingBookings = async (req, res) => {
  const { bookingIds } = req.body; // Array of booking _id's
  try {
    await Booking.updateMany(
      { _id: { $in: bookingIds }, status: "pending" }, // only pending
      { $set: { status: "cancelled" } } // mark as cancelled
    );
    res.json({ message: "Pending bookings cancelled successfully" });
  } catch (err) {
    console.error("Cancel pending booking error:", err);
    res.status(500).json({ message: "Failed to cancel pending bookings" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  const { venueId, courtId, selectedSlots, courtName, date } = req.body;

  try {
    const userId = req.user.id;
    let totalAmount = 0;

    // Check if any slot is already paid or blocked
    for (const slot of selectedSlots) {
      const { startTime, endTime, price } = slot;

      const alreadyBooked = await Booking.findOne({
        venueId,
        courtId,
        date,
        startTime,
        endTime,
        status: "paid",
      });

      if (alreadyBooked) {
        return res.status(400).json({
          message: `Slot from ${startTime} to ${endTime} is already booked.`,
        });
      }

      const isBlocked = await BlockedSlot.findOne({
        venueId,
        courtId,
        date,
        startTime,
        endTime,
      });

      if (isBlocked) {
        return res.status(400).json({
          message: `Slot from ${startTime} to ${endTime} is blocked by admin.`,
        });
      }

      totalAmount += price || 0;
    }

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    res.status(201).json({
      razorpayOrder: order,
      amount: totalAmount,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const confirmBookingAfterPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingData } = req.body;
  const { venueId, courtId, selectedSlots, courtName, date } = bookingData;
  const userId = req.user.id;

  try {
    // ✅ Double-check slots
    for (const slot of selectedSlots) {
      const { startTime, endTime } = slot;
      const alreadyBooked = await Booking.findOne({
        venueId,
        courtId,
        date,
        startTime,
        endTime,
        status: "paid",
      });
      if (alreadyBooked) {
        return res.status(400).json({ message: `Slot from ${startTime} to ${endTime} is already booked.` });
      }
    }

    // ✅ Save bookings
    const bookingsToSave = selectedSlots.map(slot => ({
      userId,
      venueId,
      courtId,
      courtName,
      date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price || 0,
      status: "paid",
      razorpay_payment_id,
      razorpay_order_id,
    }));

    const savedBookings = await Booking.insertMany(bookingsToSave);

    // ✅ Get Venue details
    const venue = await Venue.findById(venueId);

    // ✅ SMS Data
    const totalAmount = savedBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const earliestStart = savedBookings.map(b => b.startTime).sort()[0];
    const latestEnd = savedBookings.map(b => b.endTime).sort()[savedBookings.length - 1];

    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const userPhone = savedBookings[0]?.userId?.mobile || req.user?.mobile; // adjust based on your schema
    if (userPhone) {
      const smsData = {
        venue: venue?.name || "Venue",
        date: formattedDate,
        time: earliestStart,
        time2: latestEnd,
        amount: totalAmount,
      };
      await sendBookingConfirmationSMS(userPhone, smsData);
    } else {
      console.warn("⚠️ No phone found for user, skipping SMS");
    }

    res.status(201).json({
      message: "Booking confirmed successfully",
      bookings: savedBookings,
    });
  } catch (err) {
    console.error("Booking confirmation error:", err);
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};

// export const cancelBooking = async (req, res) => {
//   const bookingId = req.params.id;

//   const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });

//   try {
//     const booking = await Booking.findById(bookingId).populate("venueId userId");
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     if (booking.status === "cancelled") {
//       return res.status(400).json({ message: "Booking is already cancelled" });
//     }

//     // Refund if already paid
//     if (booking.status === "paid" && booking.razorpay_payment_id) {
//       try {
//         const refund = await razorpay.payments.refund(booking.razorpay_payment_id, {
//           notes: { reason: "User cancelled booking" },
//         });
//         booking.refundStatus = "processed";
//         console.log("Refund successful:", refund);
//       } catch (refundErr) {
//         console.error("Refund failed:", refundErr);
//         return res.status(500).json({
//           message: "Booking cancellation failed. Refund could not be processed.",
//         });
//       }
//     }

//     // Cancel booking
//     booking.status = "cancelled";
//     await booking.save();

//     // ✅ Send cancellation SMS
//     const phone = booking?.userId?.mobile;
//     if (phone) {
//       const smsData = {
//         venue: booking.venueId.name,
//         date: booking.date,
//         time: booking.startTime,
//       };
//       await sendBookingCancelledSMS(phone, smsData);
//     } else {
//       console.warn("⚠️ No mobile number found for user");
//     }

//     res.json({ message: "Booking cancelled successfully", booking });
//   } catch (err) {
//     console.error("Cancel booking failed:", err.message);
//     res.status(500).json({ message: "Failed to cancel booking" });
//   }
// };
