import React, { useEffect, useMemo, useState } from "react";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";
import { courtOwnerApi } from "../../api/courtOwnerApi";
import { FaCalendarAlt, FaListUl } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* ===== Helpers ===== */
const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

const parseMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

const normalizeName = (s) => (s || "").toLowerCase().replace(/\s+/g, "");

export default function CourtOwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // Visual constants
  const slotHeight = 80; // px per hour
  const dayStartMin = 5 * 60; // 5:00 AM
  const timeSlots = Array.from({ length: 19 }, (_, i) => 5 + i); // 5:00 → 23:00 (11 PM)

  /* ===== Fetch Venues ===== */
  useEffect(() => {
    const loadVenues = async () => {
      try {
        const v = await courtOwnerApi.getVenues();
        setVenues(v || []);
      } catch (err) {
        console.error("Error loading venues:", err);
      }
    };
    loadVenues();
  }, []);

  /* ===== Fetch Courts + Bookings ===== */
  useEffect(() => {
    const loadData = async () => {
      if (!selectedVenue) return;
      setLoading(true);
      try {
        const courtRes = await courtOwnerApi.getAllCourts(selectedVenue);
        const courtList = Array.isArray(courtRes) ? courtRes : courtRes.courts || [];
        const normalizedCourts = courtList.map((c) => ({
          _id: c._id,
          courtName: c.courtName || c.name || "Court",
        }));
        setCourts(normalizedCourts);

        const bookingPromises = normalizedCourts.map((c) =>
          courtOwnerApi.getCourtBookings(selectedVenue, c._id)
        );
        const allBookings = await Promise.all(bookingPromises);
        const combined = allBookings.flatMap((r) => (Array.isArray(r) ? r : r.bookings || []));
        setBookings(combined);
      } catch (err) {
        console.error("Error fetching courts/bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedVenue]);

  /* ===== Filters ===== */
  const filteredBookings = useMemo(() => {
    return (bookings || []).filter((b) => {
      const d = new Date(b.date);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    });
  }, [bookings, selectedDate]);

  const uniqueBookings = useMemo(() => {
    const map = new Map();
    filteredBookings.forEach((b) => {
      const cid = b.courtId?._id || b.courtId || normalizeName(b.courtName);
      const key = [cid, b.date?.slice(0, 10), b.startTime, b.endTime].join("|");
      if (!map.has(key)) map.set(key, b);
    });
    return Array.from(map.values());
  }, [filteredBookings]);

  const weekDays = useMemo(() => {
    const today = new Date(selectedDate);
    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - ((day + 1) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  /* ===== Main Layout ===== */
  return (
    <div className="flex flex-col md:flex-row bg-[#f7f9fc] min-h-screen relative">
      <CourtOwnerSidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 relative z-10 overflow-x-hidden">
        {/* ===== Header ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0C295F]">My Bookings</h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Venue Selector */}
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base bg-white text-gray-700 shadow-sm focus:outline-none"
            >
              <option value="">Select Ground</option>
              {venues.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>

            {/* Date Picker */}
            <div className="flex items-center gap-2 border border-gray-300 bg-white rounded-md px-3 py-2 shadow-sm relative z-[9999]">
              <FaCalendarAlt className="text-[#0C295F] text-sm sm:text-base" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd MMM yyyy"
                popperPlacement="bottom-end"
                className="outline-none text-sm sm:text-base cursor-pointer bg-transparent"
              />
            </div>

            {/* View Toggle */}
            <button
              onClick={() => setViewMode((prev) => (prev === "grid" ? "list" : "grid"))}
              className="flex items-center gap-2 border border-gray-300 bg-white rounded-md px-3 py-2 text-sm font-medium shadow-sm hover:bg-[#FFF4ED]"
            >
              {viewMode === "grid" ? (
                <>
                  <FaListUl className="text-[#FF7A1A]" />
                  List View
                </>
              ) : (
                <>
                  <FaCalendarAlt className="text-[#FF7A1A]" />
                  Calendar View
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===== Week Strip ===== */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-3 mb-4">
          {weekDays.map((d, i) => {
            const isActive = d.toDateString() === selectedDate.toDateString();
            return (
              <div
                key={i}
                onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 flex flex-col items-center justify-center px-3 sm:px-4 py-2 min-w-[50px] sm:min-w-[60px] rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? "bg-[#0C295F] text-white"
                    : "bg-white text-[#0C295F] border border-[#E6EBF2] hover:bg-[#FFF4ED] hover:text-[#FF7A1A]"
                }`}
              >
                <span className="text-xs sm:text-sm font-semibold">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-base sm:text-lg font-bold">{d.getDate()}</span>
              </div>
            );
          })}
        </div>

        {/* ===== LIST VIEW ===== */}
        {viewMode === "list" && selectedVenue && !loading && (
          <div className="space-y-4 sm:space-y-5 pb-10">
            {uniqueBookings.length === 0 ? (
              <p className="text-center text-gray-500">No bookings for selected date.</p>
            ) : (
              uniqueBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white rounded-xl shadow border border-[#E6EBF2] p-4 sm:p-5 text-sm"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <div className="flex gap-2 flex-wrap mb-2 sm:mb-0">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#16A34A] text-white">
                        {(b.status || "CONFIRMED").toUpperCase()}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-400 text-gray-700">
                        ONLINE
                      </span>
                    </div>
                    <div className="text-[12px] font-medium text-gray-600">
                      ID: {b.bookingId || b._id?.slice(-8)?.toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2 font-semibold text-[#0C295F]">
                    <span>
                      {new Date(b.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        weekday: "short",
                      })}
                    </span>
                    <span>
                      {formatTime(b.startTime)} – {formatTime(b.endTime)}
                    </span>
                  </div>

                  <div className="text-[#0C295F] font-medium">
                    {b.venueName || "Divisional Sports Complex Yerwada"}
                  </div>
                  <div className="text-[13px] text-gray-600 mb-3">Court {b.courtName || "N/A"}</div>

                  <hr className="my-2 border-[#E6EBF2]" />

                  {/* Amount Section */}
                  <div className="flex justify-between text-[13px] text-[#0C295F] font-medium mb-2">
                    <div className="flex gap-4 ml-auto items-start">
                      <div>
                        Amount Paid <br />
                        <span className="font-semibold">₹ {b.amountPaid || b.price || 0}</span>
                      </div>
                      <div>
                        Total <br />
                        <span className="font-semibold text-[#FF7A1A]">
                          ₹ {b.total || b.price || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className="my-2 border-[#E6EBF2]" />

                  {/* User Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[#0C295F] mt-3 gap-3">
                    <div className="font-semibold flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span>{b.userId?.name || b.userName || "N/A"}</span>
                      {(b.userId?.phone || b.phone) && (
                        <span className="text-[#FF7A1A] font-medium text-[13px] sm:text-[14px]">
                          {b.userId?.phone || b.phone}
                        </span>
                      )}
                    </div>

                    {(b.userId?.phone || b.phone) && (
                      <a
                        href={`tel:${b.userId?.phone || b.phone}`}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF4ED] text-[#FF7A1A] hover:bg-[#FFE4D0] transition"
                      >
                        📞
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== CALENDAR VIEW (Fixed Time column + horizontally scrollable courts) ===== */}
        {viewMode === "grid" && selectedVenue && !loading && (
          <div className="bg-white rounded-lg shadow border border-[#E6EBF2] mt-4 overflow-hidden">
            <div className="flex w-full">
              {/* Fixed Time Column */}
              <div className="flex-shrink-0 w-[100px] border-r border-[#E6EBF2]">
                {/* Time Header */}
                <div className="bg-[#0C295F] text-white text-center py-3 font-semibold text-xs sm:text-sm border-b border-[#1f2e52]">
                  Time
                </div>
                {/* Time Rows */}
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="text-center text-xs sm:text-sm py-2 font-medium text-[#0C295F] border-t border-[#f1f5f9]"
                    style={{ height: `${slotHeight}px` }}
                  >
                    {hour % 12 || 12}:00 {hour >= 12 ? "PM" : "AM"}
                  </div>
                ))}
              </div>

              {/* Scrollable Courts (header + columns) */}
              <div className="overflow-x-auto w-full">
                {/* Court Headers in one horizontal line */}
                <div className="flex min-w-max border-b border-[#E6EBF2] text-xs sm:text-sm">
                  {courts.length > 0 ? (
                    courts.map((c) => (
                      <div
                        key={c._id}
                        className="bg-[#0C295F] text-white flex-shrink-0 w-[200px] text-center py-3 border-l border-[#1f2e52]"
                      >
                        <div
                          className="px-2 font-semibold whitespace-nowrap overflow-x-auto text-ellipsis no-scrollbar"
                          title={`${c.courtName} – Full Court`}
                        >
                          {c.courtName} – Full Court
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-gray-500 w-full">
                      No Courts Found
                    </div>
                  )}
                </div>

                {/* Court Columns with Bookings */}
                <div className="relative flex min-w-max">
                  {courts.map((c) => (
                    <div
                      key={c._id}
                      className="relative flex-shrink-0 w-[200px] border-l border-[#E6EBF2]"
                      style={{ height: `${slotHeight * timeSlots.length}px` }}
                    >
                      {/* Horizontal grid lines per-hour in each column */}
                      {timeSlots.map((hour) => (
                        <div
                          key={`line-${c._id}-${hour}`}
                          className="absolute left-0 right-0 border-t"
                          style={{
                            borderColor: "#f1f5f9",
                            top: `${(hour - 5) * slotHeight}px`,
                          }}
                        />
                      ))}

                      {/* Bookings */}
                      {uniqueBookings
                        .filter((b) => {
                          const byId = (b.courtId?._id || b.courtId) === c._id;
                          const byName =
                            normalizeName(b.courtName) === normalizeName(c.courtName);
                          return byId || byName;
                        })
                        .map((b) => {
                          const startMin = parseMinutes(b.startTime);
                          const endMin = parseMinutes(b.endTime);
                          const durationHrs = Math.max((endMin - startMin) / 60, 0.25);
                          const topPx = ((startMin - dayStartMin) / 60) * slotHeight;

                          const isBlocked =
                            b.status === "blocked" || b.type === "blocked" || b.isBlocked;

                          return (
                            <div
                              key={`${b._id}-${b.startTime}-${b.endTime}`}
                              className={`absolute left-1 right-1 rounded-md p-1.5 sm:p-2 text-[10px] sm:text-xs font-semibold shadow-sm border ${
                                isBlocked
                                  ? "bg-[#364A6A] text-white border-[#2A3B57]"
                                  : "bg-[#FFF4ED] text-[#0C295F] border-[#FFD7B5]"
                              }`}
                              style={{
                                top: `${topPx}px`,
                                height: `${slotHeight * durationHrs - 4}px`,
                              }}
                            >
                              <div className="truncate">
                                {isBlocked ? "Bulk slots blocked" : b.userId?.name || "User"}
                              </div>
                              <div className="text-[10px] opacity-80">
                                {isBlocked
                                  ? "Coaching & Membership"
                                  : `${formatTime(b.startTime)} – ${formatTime(b.endTime)}`}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedVenue && (
          <div className="text-center text-[#0C295F] mt-10 text-sm sm:text-base">
            Please select a ground to view bookings.
          </div>
        )}
      </main>
    </div>
  );
}
