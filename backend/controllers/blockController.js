// controllers/blockController.js
import BlockedSlot from '../models/BlockedSlot.js';
 

export const blockSlot = async (req, res) => {
  const { venueId, courtId, date, slots } = req.body; // <- use courtId instead of courtIndex

  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ message: "No slots provided" });
  }

  try {
    const blocked = await Promise.all(
      slots.map((slot) =>
        BlockedSlot.create({
          venueId,
           courtId,               // correct key name
          date,
          startTime: slot.startTime,  // ✅ correct usage
          endTime: slot.endTime       // ✅ correct usage
        })
      )
    );

    res.status(201).json({ message: "Slots blocked successfully", blocked });
  } catch (err) {
    console.error("Block slot error:", err);
    res.status(500).json({ message: "Failed to block slots" });
  }
};



export const unblockSlot = async (req,res)=>{
  await BlockedSlot.findByIdAndDelete(req.params.id);
  res.json({ message: 'Slot unblocked' });
};


export const getBlockedOfCourt = async (req, res) => {
  const { venueId, courtId } = req.params;
  const { date } = req.query;

  const filter = { venueId, courtId };

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  try {
    const slots = await BlockedSlot.find(filter);
    res.json(slots);
  } catch (error) {
    console.error("Error fetching blocked slots:", error);
    res.status(500).json({ message: "Error fetching blocked slots" });
  }
};


// Get all blocked slots
// export const getBlockedSlots = async (req, res) => {
//   try {
//     const blockedSlots = await BlockedSlot.find({});
//     res.status(200).json(blockedSlots);
//   } catch (error) {
//     console.error("Error fetching blocked slots:", error);
//     res.status(500).json({ message: "Error fetching blocked slots" });
//   }
// };



export const getBlockedSlots = async (req, res) => {
  try {
    // Fetch daily blocked slots (without startDate and endDate)
    const dailyBlocked = await BlockedSlot.aggregate([
      { $match: { startDate: { $exists: false }, endDate: { $exists: false } } },
      {
        $lookup: {
          from: 'venuemodels',
          localField: 'venueId',
          foreignField: '_id',
          as: 'venue',
        },
      },
      { $unwind: '$venue' },
      {
        $addFields: {
          court: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$venue.courts',
                  as: 'court',
                  cond: { $eq: ['$$court._id', '$courtId'] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          venueId: 1,
          courtId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          venueName: '$venue.name',
          courtName: '$court.courtName',
        },
      },
    ]);

    // Fetch monthly blocked slots (having startDate and endDate)
    const monthlyBlocked = await BlockedSlot.aggregate([
      { $match: { startDate: { $exists: true }, endDate: { $exists: true } } },
      {
        $lookup: {
          from: 'venuemodels',
          localField: 'venueId',
          foreignField: '_id',
          as: 'venue',
        },
      },
      { $unwind: '$venue' },
      {
        $addFields: {
          court: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$venue.courts',
                  as: 'court',
                  cond: { $eq: ['$$court._id', '$courtId'] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          venueId: 1,
          courtId: 1,
          startDate: 1,
          endDate: 1,
          startTime: 1,
          endTime: 1,
          venueName: '$venue.name',
          courtName: '$court.courtName',
        },
      },
    ]);

    res.status(200).json({ dailyBlocked, monthlyBlocked });
  } catch (error) {
    console.error("Error fetching blocked slots:", error);
    res.status(500).json({ message: "Error fetching blocked slots" });
  }
};


// ✅ BULK BLOCK SLOTS FOR A MONTH
export const blockSlotsForMonth = async (req, res) => {
  const { venueId, courtId, year, month, slots } = req.body;

  if (!venueId || !courtId || !year || !month || !Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ message: "Missing required fields or slots" });
  }

  try {
    const documents = [];

    const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-based
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month - 1, daysInMonth);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);

      for (const slot of slots) {
        documents.push({
          venueId,
          courtId,
          date,
          startDate,
          endDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }
    }

    await BlockedSlot.insertMany(documents);

    res.status(201).json({ message: "All slots blocked for month" });
  } catch (err) {
    console.error("Bulk block error:", err);
    res.status(500).json({ message: "Failed to block slots for month" });
  }
};


export const unblockMonthSlots = async (req, res) => {
  const { venueId, courtId, year, month } = req.body;

  if (!venueId || !courtId || !year || !month) {
    return res.status(400).json({ message: "Missing required info" });
  }

  try {
    const startDate = new Date(year, month - 1, 1); // month is 1-based
    const endDate = new Date(year, month, 0); // end of that month

    const result = await BlockedSlot.deleteMany({
      venueId,
      courtId,
      startDate: { $gte: startDate, $lte: endDate },
      endDate: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json({
      message: "Month slots unblocked successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Unblock month error:", error);
    res.status(500).json({ message: "Failed to unblock month" });
  }
};

export const blockSlotsForRange = async (req, res) => {
  const { venueId, courtId, startDate, endDate, slots } = req.body;

  if (!venueId || !courtId || !startDate || !endDate || !Array.isArray(slots)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const documents = [];

    while (start <= end) {
      for (const slot of slots) {
        documents.push({
          venueId,
          courtId,
          date: new Date(start),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }
      start.setDate(start.getDate() + 1);
    }

    await BlockedSlot.insertMany(documents);
    res.status(201).json({ message: "Slots blocked for range" });
  } catch (err) {
    console.error("Range block error:", err);
    res.status(500).json({ message: "Error blocking range" });
  }
};


export const unblockSlotsForRange = async (req, res) => {
  const { venueId, courtId, startDate, endDate } = req.body;

  if (!venueId || !courtId || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = await BlockedSlot.deleteMany({
      venueId,
      courtId,
      date: { $gte: start, $lte: end }
    });

    res.status(200).json({ message: "Slots unblocked for range", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Range unblock error:", err);
    res.status(500).json({ message: "Error unblocking range" });
  }
};
