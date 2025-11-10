import User from '../models/User.js';
import Venue from '../models/VenueModel.js';
import Booking from '../models/Booking.js';
import BlockedSlot from '../models/BlockedSlot.js';


// controllers/userController.js
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const user = req.user;
  res.json({
    _id: user._id,
    mobile: user.mobile,
    email: user.email,
 
    name: user.name,
    city: user.city,
     gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    sportsPreferences: user.sportsPreferences,
    createdAt: user.createdAt,
  });
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch only users who are not admins
    const users = await User.find({ role: { $ne: "admin" } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


 export const updateMe = async (req, res) => {
    const updates = req.body;
    const  user = await User.findByIdAndUpdate(req.user._id, updates, { new: true});
    res.json(user);
 }


 export const updateUserLocation = async (req, res) => {
  const userId = req.user._id;
  const { latitude, longitude } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "Location saved", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" });
  }
};
// GET /slots/:venueId/:courtId?date=2025‑07‑15



export const getAvailableSlots = async (req, res) => {
  const { venueId, courtId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date query param is required (yyyy-mm-dd)" });
  }

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    const court = venue.courts.id(courtId);
    if (!court) return res.status(404).json({ message: "Court not found" });

    const courtSlots = court.slots;

    // Format date filter
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    // Fetch bookings & blocks for same date
    const bookings = await Booking.find({
      venueId,
      courtId,
      date: { $gte: start, $lt: end },
      status: "booked"
    });

    const blockedSlots = await BlockedSlot.find({
      venueId,
      courtId,
      date: { $gte: start, $lt: end }
    });

    const unavailable = new Set(
      [...bookings, ...blockedSlots].map(s => `${s.startTime}-${s.endTime}`)
    );

    const availableSlots = courtSlots.filter(s => {
      const key = `${s.startTime}-${s.endTime}`;
      return !unavailable.has(key) && s.isAvailable !== false;
    });

    res.json(availableSlots);
  } catch (err) {
    console.error("Error getting available slots:", err);
    res.status(500).json({ message: "Server error fetching available slots" });
  }
};


// PATCH /api/users/:id/block
// PATCH /api/users/:id/block
export const toggleBlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure only admin can block/unblock
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can block/unblock users" });
    }

    // Prevent self-blocking
    if (req.user._id.toString() === id) {
      return res.status(400).json({ error: "You cannot block yourself" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent blocking other admins
    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot block admin accounts" });
    }

    // Toggle block
    user.blocked = !user.blocked;
    await user.save();

    res.json({
      message: `User has been ${user.blocked ? "blocked" : "unblocked"}.`,
      user: { _id: user._id, name: user.name, blocked: user.blocked }
    });
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ error: "Failed to toggle user block status" });
  }
};

