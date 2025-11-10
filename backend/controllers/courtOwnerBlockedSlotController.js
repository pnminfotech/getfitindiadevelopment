import BlockedSlotModel from "../models/BlockedSlot.js";
import Court from "../models/CourtModel.js";
import VenueModel from "../models/VenueModel.js";

/**
 * Court Owner: Add Blocked Slot (own ground only)
 */
export const addCourtOwnerBlockedSlot = async (req, res) => {
  try {
    const { venueId, courtId, date, startTime, endTime, reason } = req.body;

    if (!venueId || !courtId || !date || !startTime || !endTime)
      return res.status(400).json({ error: "Missing required fields" });

    // ✅ Verify court belongs to this owner
    const venue = await VenueModel.findOne({ _id: venueId, ownerId: req.user._id });
    if (!venue) return res.status(403).json({ error: "You do not own this venue" });

    const court = await Court.findOne({ _id: courtId, venueId });
    if (!court) return res.status(404).json({ error: "Court not found" });

    // ✅ Prevent overlap for same court/date
    const overlap = await BlockedSlotModel.findOne({
      courtId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (overlap)
      return res.status(400).json({ error: "This time slot is already blocked" });

    const blocked = await BlockedSlotModel.create({
      ownerId: req.user._id,
      venueId,
      courtId,
      date,
      startTime,
      endTime,
      reason,
    });

    res.status(201).json({ success: true, blocked });
  } catch (err) {
    console.error("Owner Add Block Error:", err);
    res.status(500).json({ error: "Failed to block slot" });
  }
};

/**
 * Court Owner: Get all blocked slots for a specific court
 */
export const getCourtOwnerBlockedSlots = async (req, res) => {
  try {
    const { courtId } = req.params;

    const slots = await BlockedSlotModel.find({
      courtId,
      ownerId: req.user._id, // ✅ Owner’s own only
    })
      .sort({ date: -1, startTime: 1 })
      .lean();

    res.json(slots);
  } catch (err) {
    console.error("Owner Get Blocks Error:", err);
    res.status(500).json({ error: "Failed to fetch blocked slots" });
  }
};

/**
 * Court Owner: Delete Blocked Slot (only own)
 */
export const deleteCourtOwnerBlockedSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await BlockedSlotModel.findOne({
      _id: id,
      ownerId: req.user._id, // ✅ Restrict delete
    });

    if (!slot)
      return res.status(404).json({ error: "Slot not found or access denied" });

    await slot.deleteOne();

    res.json({ success: true, message: "Slot unblocked successfully" });
  } catch (err) {
    console.error("Owner Delete Block Error:", err);
    res.status(500).json({ error: "Failed to delete blocked slot" });
  }
};
