import React, { useEffect, useState } from "react";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

const API_BASE = "http://localhost:8000/api";

function CourtOwnerBlockSlots() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [blockType, setBlockType] = useState("single");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [blockedSlots, setBlockedSlots] = useState([]);

  // 🔐 Auth header helper
  const getAuthHeader = () => {
    const token = localStorage.getItem("courtOwnerToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 🎯 Load logged-in owner's venues
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/courtowner/venues`, {
          headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error("Failed to load venues");
        const data = await res.json();
        console.log("✅ Loaded venues:", data);
        setVenues(data);
      } catch (e) {
        console.error(e);
        alert("Failed to load venues");
      }
    })();
  }, []);

  // 🎯 Load courts of selected venue
  useEffect(() => {
    if (!selectedVenue) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/venues/${selectedVenue}`);
        if (!res.ok) throw new Error("Failed to load courts");
        const venueData = await res.json();
        console.log("✅ Loaded venue:", venueData);
        setCourts(venueData.courts || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load courts");
      }
    })();
  }, [selectedVenue]);

  // 🎯 Load blocked slots for selected court
  useEffect(() => {
    if (!selectedCourt) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/courtowner/blocked-slots/${selectedCourt}`, {
          headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error("Failed to fetch blocked slots");
        const data = await res.json();
        console.log("✅ Loaded blocked slots:", data);
        setBlockedSlots(data || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load blocked slots");
      }
    })();
  }, [selectedCourt]);

  // ✅ Submit handler (Block slot)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVenue || !selectedCourt) {
      alert("Please select a venue and court first");
      return;
    }

    const body =
      blockType === "single"
        ? { venueId: selectedVenue, courtId: selectedCourt, date, startTime, endTime }
        : { venueId: selectedVenue, courtId: selectedCourt, startDate, endDate, startTime, endTime };

    console.log("🟢 Sending body:", body);

    try {
      const res = await fetch(`${API_BASE}/courtowner/block-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to block slot");

      alert("✅ Slot blocked successfully");
      setDate("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");

      // Refresh blocked slots
      const refreshed = await fetch(`${API_BASE}/courtowner/blocked-slots/${selectedCourt}`, {
        headers: { ...getAuthHeader() },
      });
      const updated = await refreshed.json();
      setBlockedSlots(updated);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ❌ Unblock slot
  const handleUnblock = async (id) => {
    if (!window.confirm("Unblock this slot?")) return;
    try {
      const res = await fetch(`${API_BASE}/courtowner/blocked-slots/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error("Failed to unblock slot");
      alert("Slot unblocked successfully");
      setBlockedSlots((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🕓 Format helper
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex">
      <CourtOwnerSidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-green-700">🕒 Block Slots</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Venue & Court Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium">Select Venue</label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  required
                >
                  <option value="">-- Choose Venue --</option>
                  {venues.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Select Court</label>
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  required
                >
                  <option value="">-- Choose Court --</option>
                  {courts.map((c, idx) => (
                    <option key={c._id || idx} value={c._id || c.id || c.courtId || ""}>
                      {c.courtName || c.name || `Court ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Block Type */}
            <div>
              <label className="block font-medium mb-1">Block Type</label>
              <div className="flex gap-6 mt-1">
                <label>
                  <input
                    type="radio"
                    name="blockType"
                    value="single"
                    checked={blockType === "single"}
                    onChange={(e) => setBlockType(e.target.value)}
                  />{" "}
                  Single Day
                </label>
                <label>
                  <input
                    type="radio"
                    name="blockType"
                    value="range"
                    checked={blockType === "range"}
                    onChange={(e) => setBlockType(e.target.value)}
                  />{" "}
                  Multiple Days
                </label>
              </div>
            </div>

            {/* Date Fields */}
            {blockType === "single" ? (
              <div>
                <label className="block font-medium">Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-2 border rounded mt-1"
                  required
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded mt-1"
                    required
                  />
                </div>
              </div>
            )}

            {/* Time Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="p-2 border rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="p-2 border rounded mt-1"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Block Slot
            </button>
          </form>

          {/* Blocked Slots List */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">🚫 Blocked Slots</h3>
            {blockedSlots.length === 0 ? (
              <p className="text-gray-500">No blocked slots found.</p>
            ) : (
              <ul className="space-y-3">
                {blockedSlots.map((b) => (
                  <li
                    key={b._id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      {b.date ? (
                        <span>
                          {formatDate(b.date)} • {b.startTime} - {b.endTime}
                        </span>
                      ) : (
                        <span>
                          {formatDate(b.startDate)} → {formatDate(b.endDate)} •{" "}
                          {b.startTime} - {b.endTime}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleUnblock(b._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourtOwnerBlockSlots;
