import React, { useEffect, useState } from "react";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { courtOwnerApi } from "../../api/courtOwnerApi";

export default function BlockSlot() {
  const [venues, setVenues] = useState([]);
  const [venueId, setVenueId] = useState("");
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState("");

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [slots, setSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]); // ✅ new
  const [loading, setLoading] = useState(false);

  // ✅ Load all venues
  useEffect(() => {
    (async () => {
      try {
        const v = await courtOwnerApi.getVenues();
        setVenues(v || []);
      } catch (err) {
        console.error("Failed to load venues:", err);
      }
    })();
  }, []);

  // ✅ Load courts for selected venue
  useEffect(() => {
    if (!venueId) {
      setCourts([]);
      setCourtId("");
      return;
    }
    (async () => {
      try {
        const res = await courtOwnerApi.getAllCourts(venueId);
        const list = Array.isArray(res) ? res : res.courts || [];
        setCourts(list);
      } catch (err) {
        console.error("Failed to load courts:", err);
      }
    })();
  }, [venueId]);

  // ✅ Fetch blocked slots for selected court + date
  useEffect(() => {
    if (!courtId || !date) return;
    (async () => {
      try {
        const res = await courtOwnerApi.getCourtBlockedSlots(
          courtId,
          date.toISOString().slice(0, 10)
        );
        setBlockedSlots(res || []);
      } catch (err) {
        console.error("Failed to load blocked slots:", err);
        setBlockedSlots([]);
      }
    })();
  }, [courtId, date]);

  // ✅ Add slot locally
  const addSlot = () => {
    if (!startTime || !endTime) {
      alert("Please select start and end time first.");
      return;
    }
    setSlots((prev) => [...prev, { startTime, endTime, reason }]);
    setStartTime("");
    setEndTime("");
    setReason("");
  };

  // ✅ Submit each slot to backend
  const handleBlock = async () => {
    if (!venueId || !courtId || !date || slots.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      for (const s of slots) {
        await courtOwnerApi.blockSlots({
          venueId,
          courtId,
          date: date.toISOString().slice(0, 10),
          startTime: s.startTime,
          endTime: s.endTime,
          reason: s.reason || "Blocked",
        });
      }

      alert("All slots blocked successfully ✅");
      setSlots([]);

      // Refresh blocked slot list
      const res = await courtOwnerApi.getCourtBlockedSlots(
        courtId,
        date.toISOString().slice(0, 10)
      );
      setBlockedSlots(res || []);
    } catch (e) {
      console.error(e);
      alert("Failed to block one or more slots ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f7f9fc] min-h-screen overflow-hidden relative">
      <CourtOwnerSidebar />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#0C295F] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <h1 className="text-lg font-semibold tracking-wide">Block Slots</h1>
        </div>

        <div className="flex-1 px-4 py-6 md:px-10 max-w-lg mx-auto w-full">
          <div className="bg-white shadow rounded-xl p-6 space-y-5 border border-[#E6EBF2]">
            {/* Property */}
            <div>
              <label className="block text-sm font-semibold text-[#0C295F] mb-1">
                Select Property
              </label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
              >
                <option value="">Select Property</option>
                {venues.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Court Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-[#0C295F] mb-1">
                Select Court
              </label>
              <select
                value={courtId}
                onChange={(e) => setCourtId(e.target.value)}
                disabled={!courts.length}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 disabled:bg-gray-100"
              >
                <option value="">
                  {courts.length ? "Select Court" : "Select Venue First"}
                </option>
                {courts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courtName || c.name || `Court ${c.number}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-[#0C295F] mb-1">
                Select Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={date}
                  onChange={setDate}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select Date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-500" />
              </div>
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0C295F] mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C295F] mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-[#0C295F] mb-1">
                Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (e.g., Maintenance)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
              />
            </div>

            {/* Add Slot Button */}
            <div className="flex justify-end">
              <button
                onClick={addSlot}
                className="bg-gray-200 text-[#0C295F] font-semibold px-4 py-2 rounded-md hover:bg-gray-300"
              >
                ADD SLOT
              </button>
            </div>


            {/* Added Slots Preview */}
            {slots.length > 0 && (
              <div className="border-t pt-3 space-y-2">
                <h4 className="font-semibold text-[#0C295F]">Added Slots:</h4>
                {slots.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm border p-2 rounded-md bg-gray-50"
                  >
                    <span>
                      {s.startTime} - {s.endTime}
                    </span>
                    {s.reason && (
                      <span className="text-gray-600 italic">{s.reason}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Already Blocked Slots */}
          {blockedSlots.length > 0 && (
            <div className="bg-white shadow mt-6 rounded-xl p-5 border border-[#E6EBF2]">
              <h3 className="text-md font-semibold text-[#0C295F] mb-3">
                Already Blocked Slots ({blockedSlots.length})
              </h3>
              {blockedSlots.map((b, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm border p-2 rounded-md mb-2 bg-[#f9fafb]"
                >
                  <span>
                    {b.startTime} - {b.endTime}
                  </span>
                  <span className="text-gray-600 italic">{b.reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-[#0C295F] text-[#0C295F] font-semibold rounded-md hover:bg-[#f0f4ff]"
            >
              CANCEL
            </button>

            <button
              onClick={handleBlock}
              disabled={!venueId || !courtId || !date || slots.length === 0 || loading}
              className={`px-6 py-2 rounded-md font-semibold text-white transition-all ${
                !venueId || !courtId || !date || slots.length === 0 || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#0C295F] hover:bg-[#183a7d]"
              }`}
            >
              {loading ? "BLOCKING..." : "BLOCK SLOT"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
