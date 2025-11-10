import Booking from "../models/Booking.js";
import User from "../models/User.js";
import VenueModel from "../models/VenueModel.js";

// ✅ Get users who booked any venue of this court owner
export const getCourtOwnerUsers = async (req, res) => {
  try {
    const myVenues = await VenueModel.find({ ownerId: req.user._id }).select("_id");
    if (!myVenues.length)
      return res.status(200).json({ success: true, users: [] });

    const venueIds = myVenues.map(v => v._id);

    const bookings = await Booking.find({ venueId: { $in: venueIds } }).select("userId");
    const userIds = [...new Set(bookings.map(b => b.userId.toString()))];

    const users = await User.find({ _id: { $in: userIds } }).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Error fetching court owner users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Toggle block/unblock user for this court owner
export const toggleCourtOwnerUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      message: `User ${user.blocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (err) {
    console.error("Error toggling user block:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};
