// controllers/courtOwnerBookingController.js
import Booking from "../models/Booking.js";
import VenueModel from "../models/VenueModel.js";

/**
 * GET /api/courtowner/bookings
 * Court Owner - View all bookings for their venues
 */
export const getOwnerBookings = async (req, res) => {
  try {
    // ✅ Get all venue IDs owned by this owner
    const myVenues = await VenueModel.find({ ownerId: req.user._id }).select("_id name");
    if (!myVenues.length)
      return res.status(200).json({ success: true, bookings: [], message: "No venues found" });

    const venueIds = myVenues.map(v => v._id);

    // ✅ Find all bookings linked to those venues
    const bookings = await Booking.find({ venueId: { $in: venueIds } })
      .populate("userId", "name mobile email")
      .populate("venueId", "name city")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res.status(500).json({ error: "Failed to load bookings" });
  }
};

/**
 * GET /api/courtowner/bookings/stats
 * Dashboard summary for court owner
 */
export const getOwnerBookingStats = async (req, res) => {
  try {
    const myVenues = await VenueModel.find({ ownerId: req.user._id }).select("_id");
    const venueIds = myVenues.map(v => v._id);

    const bookings = await Booking.find({ venueId: { $in: venueIds } });

    const totalBookings = bookings.length;
    const totalEarnings = bookings
      .filter(b => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (b.price || 0), 0);

    const upcoming = bookings.filter(b => new Date(b.date) >= new Date()).length;

    res.json({
      success: true,
      totalBookings,
      totalEarnings,
      upcoming,
    });
  } catch (err) {
    console.error("Error fetching booking stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};



/**
 * GET /api/courtowner/bookings/:id
 * Get single booking details with user + venue populated
 */
export const getOwnerBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId)
      .populate("userId", "name email mobile")
      .populate("venueId", "name city");

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // Calculate totals / bill structure
    const totalSlotsPrice = booking.price || 0;
    const couponDiscount = booking.discount || 0;
    const fee = booking.convenienceFee || 0;
    const subtotal = totalSlotsPrice - couponDiscount + fee;

    const bill = {
      totalSlotsPrice,
      coupon: booking.couponCode ? { code: booking.couponCode, discount: couponDiscount } : null,
      fee,
      subtotal,
      total: subtotal,
      amountReceived: booking.razorpay_payment_id ? subtotal : 0,
    };

    res.json({
      success: true,
      booking,
      player: booking.userId,
      allSlots: [booking], // adjust if you have multiple slots per booking group
      bill,
    });
  } catch (err) {
    console.error("Error fetching single booking:", err);
    res.status(500).json({ success: false, error: "Failed to fetch booking details" });
  }
};
