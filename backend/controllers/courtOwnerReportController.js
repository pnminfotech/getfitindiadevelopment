import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import VenueModel from "../models/VenueModel.js";
import { default as PDFDocument } from "pdfkit";
import ExcelJS from "exceljs";



import BlockedSlot from '../models/BlockedSlot.js';

// // helper to fetch venues owned by current court owner
// async function ownerVenueIds(ownerId) {
//   const vens = await VenueModel.find({ ownerId, deleted: { $ne: true } }, { _id: 1 }).lean();
//   return vens.map(v => v._id);
// }

// ----- helpers -----
const toStartOfDay = d => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const toEndOfDay   = d => { const x = new Date(d); x.setHours(23,59,59,999); return x; };

function parseRange({ range, from, to }) {
  const today = new Date();
  let start, end;

  const toStartOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
  const toEndOfDay   = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };

  if (range === "lastWeek") {
    // ✅ Get Monday of this week
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // treat Sunday as 7
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - (dayOfWeek - 1));
    mondayThisWeek.setHours(0, 0, 0, 0);

    // ✅ Last week's Monday → Sunday
    start = new Date(mondayThisWeek);
    start.setDate(start.getDate() - 7);
    end = new Date(mondayThisWeek);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);

  } else if (range === "lastMonth") {
    const d = new Date(today.getFullYear(), today.getMonth(), 0); // last day prev month
    end = toEndOfDay(d);
    start = new Date(d.getFullYear(), d.getMonth(), 1); // first day prev month

  } else if (range === "mtd") {
    end = toEndOfDay(today);
    start = new Date(today.getFullYear(), today.getMonth(), 1);

  } else if (from && to) {
    start = toStartOfDay(new Date(from));
    end = toEndOfDay(new Date(to));

  } else {
    // default = last 30 days
    end = toEndOfDay(today);
    start = toStartOfDay(new Date(today));
    start.setDate(start.getDate() - 29);
  }

  return { start, end };
}


const isPaidLike = (status) => ["paid", "completed"].includes(status);

// Build an owner filter by looking up venues owned by this owner
async function ownerVenueIds(ownerId) {
  const vens = await VenueModel.find({ ownerId, deleted: { $ne: true } }, { _id: 1 }).lean();
  return vens.map(v => v._id);
}

// Common base match for bookings in range + owner’s venues
async function baseMatch(req, range) {
  const ownerId = req.user._id; // from authMiddleware("court_owner")
  const { start, end } = parseRange(range || {});
  const venueIds = await ownerVenueIds(ownerId);

  return {
    match: {
      venueId: { $in: venueIds },
      date: { $gte: start, $lte: end },
    },
    start, end,
  };
}

// ----- /summary -----
// ----- /summary (Updated to support ?date= filtering) -----
export const ownerReportsSummary = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const venueIds = await ownerVenueIds(ownerId);
    const { date, from, to } = req.query;
    let start, end;

    if (from && to) {
      start = new Date(from);
      start.setHours(0, 0, 0, 0);
      end = new Date(to);
      end.setHours(23, 59, 59, 999);
    } else if (date) {
      start = new Date(date);
      start.setHours(0, 0, 0, 0);
      end = new Date(date);
      end.setHours(23, 59, 59, 999);
    } else {
      const parsed = parseRange(req.query);
      start = parsed.start;
      end = parsed.end;
    }

    // --- Fetch bookings in selected range ---
    const bookings = await Booking.find({
      venueId: { $in: venueIds },
      date: { $gte: start, $lte: end },
      status: { $in: ["paid", "completed", "cancelled"] },
    }).lean();

    let totalRevenue = 0;
    let onlineRevenue = 0;
    let offlineRevenue = 0;
    let totalBookings = 0;
    let onlineBookings = 0;
    let cancelled = 0;

    for (const b of bookings) {
      if (["paid", "completed"].includes(b.status)) {
        totalRevenue += b.price || 0;
        totalBookings++;
        if (b.razorpay_payment_id) {
          onlineRevenue += b.price || 0;
          onlineBookings++;
        } else {
          offlineRevenue += b.price || 0;
        }
      }
      if (b.status === "cancelled") cancelled++;
    }

    // --- Count total slots only for this owner’s venues (not per day × range) ---
    const venues = await VenueModel.find({ _id: { $in: venueIds } }).lean();
    let totalSlots = 0;
    for (const v of venues) {
      for (const c of v.courts || []) {
        totalSlots += (c.slots?.length || 0);
      }
    }

    res.json({
      totalRevenue,
      onlineRevenue,
      offlineRevenue,
      totalBookings,
      onlineBookings,
      totalSlots,
      cancellations: cancelled,
    });
  } catch (err) {
    console.error("ownerReportsSummary error:", err);
    res.status(500).json({ error: "Failed to compute summary" });
  }
};



// ----- /calendar -----
export const ownerReportsCalendar = async (req, res) => {
  try {
    const { start, end, match } = await baseMatch(req, req.query);

    // Aggregate per-day stats
    const perDay = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { date: "$date", format: "%Y-%m-%d" } },
          bookings: { $sum: { $cond: [{ $in: ["$status", ["paid","completed"]] }, 1, 0] } },
          revenue:  { $sum: { $cond: [{ $in: ["$status", ["paid","completed"]] }, "$price", 0] } },
          onlineRevenue: { $sum: { $cond: [
            { $and: [{ $in: ["$status", ["paid","completed"]] }, { $ne: ["$razorpay_payment_id", null] }] },
            "$price", 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill gaps for all days in range
    const map = new Map(perDay.map(d => [d._id, d]));
    const out = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0,10);
      const row = map.get(key) || { _id: key, bookings: 0, revenue: 0, onlineRevenue: 0, cancelled: 0 };
      out.push({
        date: key,
        bookings: row.bookings,
        revenue: row.revenue,
        onlineRevenue: row.onlineRevenue,
        cancelled: row.cancelled,
        // optional occupancy%
      });
    }

    res.json({ range: { start, end }, days: out });
  } catch (e) {
    console.error("ownerReportsCalendar err:", e);
    res.status(500).json({ error: "Failed to compute calendar series" });
  }
};

// ----- /list -----
export const ownerReportsList = async (req, res) => {
  try {
    const { match } = await baseMatch(req, req.query);

    const { page = 1, limit = 20, status, mode } = req.query;
    const q = { ...match };

    if (status) {
      q.status = status; // "pending" | "paid" | "cancelled" | "completed"
    }
    if (mode === "online") {
      q.razorpay_payment_id = { $ne: null };
      q.status = { $in: ["paid","completed"] };
    }
    if (mode === "offline") {
      q.$and = [
        ...(q.$and || []),
        { $or: [{ razorpay_payment_id: null }, { razorpay_payment_id: { $exists: false } }] },
      ];
      q.status = { $in: ["paid","completed"] };
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Keep GDPR: do not expose phone/email. Only minimal display fields.
    const [items, total] = await Promise.all([
    //   Booking.find(q, {
    //     _id: 1, date: 1, startTime: 1, endTime: 1, courtName: 1, price: 1,
    //     status: 1, razorpay_payment_id: 1, userName: 1 // if you store it
    //   })
    Booking.find(q)
  .populate("venueId", "name")
  .populate("userId", "name")
  .select("_id date startTime endTime courtName price status razorpay_payment_id")

      .sort({ date: -1, startTime: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
      Booking.countDocuments(q),
    ]);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      items,
    });
  } catch (e) {
    console.error("ownerReportsList err:", e);
    res.status(500).json({ error: "Failed to fetch list" });
  }
};
// ✅ Get occupancy by date for selected day
export const ownerReportsByDate = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const venueIds = await ownerVenueIds(ownerId);
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Missing date parameter" });

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    // fetch all venues + courts
    const venues = await VenueModel.find({ _id: { $in: venueIds } }).lean();

    // fetch bookings for that date
    const bookings = await Booking.find({
      venueId: { $in: venueIds },
      date: { $gte: selectedDate, $lte: endDate },
      status: { $in: ["paid", "completed"] },
    }).lean();

    // build occupancy map
    const courts = [];
    for (const venue of venues) {
      for (const court of venue.courts || []) {
        const totalSlots = court.slots?.length || 0;

        const bookedSlots = bookings.filter(
          (b) => b.courtName === court.courtName && b.venueId.toString() === venue._id.toString()
        ).length;

        // 1 slot = 30 min, so total hours = totalSlots * 0.5
        const totalHours = (totalSlots * 0.5).toFixed(1);
        const bookedHours = (bookedSlots * 0.5).toFixed(1);

        courts.push({
          venue: venue.name,
          court: court.courtName,
          bookedSlots,
          totalSlots,
          bookedHours,
          totalHours,
        });
      }
    }

    res.json({ date: selectedDate, courts });
  } catch (err) {
    console.error("ownerReportsByDate error:", err);
    res.status(500).json({ error: "Failed to fetch occupancy for date" });
  }
};

// ----- slots capacity (optional) -----
// Approximates "total slots" over a range by expanding owner venues & court slots
async function computeTotalSlotsForOwner(ownerId, query) {
  const { start, end } = parseRange(query || {});
  const venues = await VenueModel.find({ ownerId, deleted: { $ne: true } }, {
    courts: 1
  }).lean();

  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const dow = (d) => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];

  let total = 0;
  for (const v of venues) {
    for (const c of (v.courts || [])) {
      const slots = c.slots || [];
      for (const day of days) {
        const name = dow(day);
        total += slots.filter(s => !s.day || s.day === name).length;
      }
    }
  }
  return total;
}


// ✅ USE THIS for both PDF & Excel exports

export const exportReportPDF = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const venueIds = await ownerVenueIds(ownerId);

    // ✅ Apply filter
    const { start, end } = parseRange(req.query);

    const bookings = await Booking.find({
      venueId: { $in: venueIds },
      date: { $gte: start, $lte: end },
      status: { $in: ["paid", "completed", "cancelled"] },
    })
      .populate("venueId", "name")
      .populate("userId", "name")
      .lean();

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Owner_Report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Court Owner Booking Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text("Venue", 50, 100);
    doc.text("Court", 150);
    doc.text("User", 250);
    doc.text("Date", 350);
    doc.text("Time", 420);
    doc.text("Price", 490);
    doc.text("Status", 550);
    doc.moveDown().moveDown();

    bookings.forEach((b) => {
      const status =
        b.status === "cancelled"
          ? "Cancelled"
          : ["paid", "completed"].includes(b.status)
          ? "Success"
          : "Pending";

      doc
        .fontSize(10)
        .text(b.venueId?.name || "-", 50)
        .text(b.courtName || "-", 150)
        .text(b.userId?.name || "-", 250)
        .text(new Date(b.date).toLocaleDateString(), 350)
        .text(`${b.startTime} - ${b.endTime}`, 420)
        .text(`₹${b.price}`, 490)
        .text(status, 550)
        .moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("PDF Export Error:", err);
    res.status(500).json({ error: "Failed to export PDF" });
  }
};

// ✅ Excel Export with Range Filtering
export const exportReportExcel = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const venueIds = await ownerVenueIds(ownerId);
    const { start, end } = parseRange(req.query);

    const venues = await VenueModel.find({ _id: { $in: venueIds } }).lean();

    const bookings = await Booking.find({
      venueId: { $in: venueIds },
      date: { $gte: start, $lte: end },
    })
      .populate("venueId", "name")
      .populate("userId", "name")
      .lean();

    const blockedSlots = await BlockedSlot.find({
      venueId: { $in: venueIds },
      $or: [
        { date: { $gte: start, $lte: end } },
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    }).lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Filtered Report");

    sheet.columns = [
      { header: "Venue Name", key: "venueName", width: 25 },
      { header: "Court Name", key: "courtName", width: 20 },
      { header: "Username", key: "username", width: 20 },
      { header: "Timeslot Date", key: "timeslotDate", width: 15 },
      { header: "Start Time", key: "startTime", width: 15 },
      { header: "End Time", key: "endTime", width: 15 },
      { header: "Booking Date", key: "bookingDate", width: 20 },
      { header: "Price", key: "price", width: 10 },
      { header: "Status", key: "status", width: 20 },
      { header: "Blocked By", key: "blockedBy", width: 20 },
    ];

    for (const venue of venues) {
      for (const court of venue.courts || []) {
        for (const slot of court.slots || []) {
          const booked = bookings.find(
            (b) =>
              b.venueId?._id?.toString() === venue._id.toString() &&
              b.courtName === court.courtName &&
              b.startTime === slot.startTime &&
              b.endTime === slot.endTime
          );

          const blocked = blockedSlots.find(
            (blk) =>
              blk.venueId?.toString() === venue._id.toString() &&
              blk.courtId?.toString() === court._id.toString() &&
              blk.startTime === slot.startTime &&
              blk.endTime === slot.endTime
          );

          if (booked) {
            const status =
              booked.status === "cancelled"
                ? "Cancelled"
                : ["paid", "completed"].includes(booked.status)
                ? "Success"
                : "Pending";

            sheet.addRow({
              venueName: venue.name,
              courtName: court.courtName,
              username: booked.userId?.name || "-",
              timeslotDate: new Date(booked.date).toLocaleDateString(),
              startTime: booked.startTime,
              endTime: booked.endTime,
              bookingDate: new Date(booked.createdAt).toLocaleString(),
              price: booked.price,
              status,
              blockedBy: "-",
            });
          } else if (blocked) {
            sheet.addRow({
              venueName: venue.name,
              courtName: court.courtName,
              username: "-",
              timeslotDate: blocked.date
                ? new Date(blocked.date).toLocaleDateString()
                : "-",
              startTime: blocked.startTime,
              endTime: blocked.endTime,
              bookingDate: "-",
              price: "-",
              status: "Blocked",
              blockedBy: blocked.blockedBy === "admin" ? "Admin" : "Court Owner",
            });
          } else {
            sheet.addRow({
              venueName: venue.name,
              courtName: court.courtName,
              username: "-",
              timeslotDate: "-",
              startTime: slot.startTime,
              endTime: slot.endTime,
              bookingDate: "-",
              price: slot.price || "-",
              status: "Available",
              blockedBy: "-",
            });
          }
        }
      }
    }

    // Style header
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0D2149" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=All_Slots_Report_${req.query.range || "month"}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel Export Error:", err);
    res.status(500).json({ error: "Failed to export Excel" });
  }
};


