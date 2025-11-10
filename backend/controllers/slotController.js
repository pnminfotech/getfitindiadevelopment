import Venue from '../models/VenueModel.js';
import mongoose from 'mongoose'; // ⬅️ Required for ObjectId validation


export const createCourt = async (req, res) => {
  const { courtName, sports, slots } = req.body;
  const venueId = req.params.venueId;

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    // ✅ ensure each slot has isAvailable = true
    const slotsWithFlag = slots.map((s) => ({
      ...s,
      price: s.price || 0,
      isAvailable: true,
    }));

    venue.courts.push({ courtName, sports, slots: slotsWithFlag });
    await venue.save();

    res.status(201).json({ message: "Court added successfully", venue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateCourt = async (req, res) => {
  const { courtName, sports, slots } = req.body;
  const { venueId, courtId } = req.params;

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    const court = venue.courts.id(courtId);
    if (!court) return res.status(404).json({ message: "Court not found" });

    court.courtName = courtName;
    court.sports = sports;

    // ✅ preserve existing isAvailable flag or default to true
    court.slots = slots.map((s) => ({
      ...s,
        price: s.price || 0,
      isAvailable:
        typeof s.isAvailable === "boolean" ? s.isAvailable : true,
    }));

    await venue.save();
    res.json({ message: "Court updated successfully", venue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourt = async (req, res) => {
  const { venueId, courtId } = req.params;

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const index = venue.courts.findIndex((c) => c._id.toString() === courtId);
    if (index === -1) return res.status(404).json({ message: 'Court not found' });

    venue.courts.splice(index, 1);
    await venue.save();

    res.json({ message: 'Court deleted successfully' });
  } catch (err) {
    console.error("Error deleting court:", err);
    res.status(500).json({ message: err.message });
  }
};


// export const getCourts = async (req, res) => {
//   try {
//     const venue = await Venue.findById(req.params.venueId);
//     if (!venue) return res.status(404).json({ message: 'Venue not found' });

//     res.json(venue.courts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Admin — Get all courts
export const getAllCourts = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    res.json(venue.courts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSlotsOfCourt = async (req, res) => {
  const { venueId, courtId } = req.params;

  console.log("➡️ Fetching slots for Venue:", venueId, "Court:", courtId);

  // Check ObjectId validity
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    console.error("❌ Invalid venueId");
    return res.status(400).json({ message: "Invalid venueId" });
  }
  if (!mongoose.Types.ObjectId.isValid(courtId)) {
    console.error("❌ Invalid courtId");
    return res.status(400).json({ message: "Invalid courtId" });
  }

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) {
      console.error("❌ Venue not found");
      return res.status(404).json({ message: "Venue not found" });
    }

    const court = venue.courts.id(courtId);
    if (!court) {
      console.error("❌ Court not found inside venue");
      return res.status(404).json({ message: "Court not found" });
    }

    console.log("✅ Found Court:", court.courtName);
    console.log("🟡 Slots:", court.slots);

    if (!court.slots || court.slots.length === 0) {
      console.warn("⚠️ No slots found for this court.");
      return res.status(200).json([]); // Return empty
    }

    res.status(200).json(court.slots);
  } catch (err) {
    console.log("🔥 Full Error:", err); // logs the full stack if needed

    console.error("🔥 Error fetching slots:", err.message, err.stack);
    res.status(500).json({ message: "Server error while fetching slots", error: err.message });
  }
};
