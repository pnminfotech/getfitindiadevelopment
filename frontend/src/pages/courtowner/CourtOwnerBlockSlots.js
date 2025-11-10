import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

const API_BASE = "http://localhost:8000/api";

function CourtOwnerBlockSlots() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [blockType, setBlockType] = useState("single"); // "single" or "range"
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [blockedSlots, setBlockedSlots] = useState([]);

  // auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem("courtOwnerToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Load only this owner’s venues
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("courtOwnerToken");
        const res = await fetch(`${API_BASE}/venues`, {
          headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error("Failed to load venues");
        const data = await res.json();
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const myVenues = data.filter((v) => v.ownerId?._id === decoded.id);
        setVenues(myVenues);
      } catch (e) {
        console.error(e);
        alert("Failed to load venues");
      }
    })();
  }, []);

  // When venue changes, load its courts
  useEffect(() => {
    if (!selectedVenue) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/slots/${selectedVenue}/courts`, {
          headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error("Failed to load courts");
        const data = await res.json();
        setCourts(data);
      } catch (e) {
        console.error(e);
        alert("Failed to load courts");
      }
    })();
  }, [selectedVenue]);

  // Load blocked slots for selected court
  useEffect(() => {
    if (!selectedCourt) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/blockedslots/${selectedCourt}`, {
          headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error("Failed to fetch blocked slots");
        const data = await res.json();
        setBlockedSlots(data || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load blocked slots");
      }
    })();
  }, [selectedCourt]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVenue || !selectedCourt) {
      alert("Please select venue and court");
      return;
    }

    const body =
      blockType === "single"
        ? { venueId: selectedVenue, courtId: selectedCourt, date, startTime, endTime }
        : { venueId: selectedVenue, courtId: selectedCourt, startDate, endDate, startTime, endTime };

    try {
      const res = await fetch(`${API_BASE}/courtowner/blockslots`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to block slot");
      alert("Slot blocked successfully");
      setDate("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      // Refresh
      const refreshed = await fetch(`${API_BASE}/blockedslots/${selectedCourt}`, {
        headers: { ...getAuthHeader() },
      });
      const updated = await refreshed.json();
      setBlockedSlots(updated);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm("Unblock this slot?")) return;
    try {
      const res = await fetch(`${API_BASE}/courtowner/blockslots/${id}`, {
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

          {/* --- Top Buttons --- */}
          <div className="flex flex-wrap gap-3 mb-6">
            <NavLink
              to="/courtowner/manageslots"
              className={({ isActive }) =>
                `px-5 py-2 rounded font-medium transition ${
                  isActive
                    ? "bg-[#b37400] text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`
              }
            >
              Manage Courts & Slots
            </NavLink>

            <NavLink
              to="/courtowner/blockslots"
              className={({ isActive }) =>
                `px-5 py-2 rounded font-medium transition ${
                  isActive
                    ? "bg-[#009688] text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`
              }
            >
              Block Slots
            </NavLink>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-green-700">🕒 Block Slots</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select venue and court */}
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
                  {courts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.courtName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Block type selection */}
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

            {/* Date fields */}
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

            {/* Time fields */}
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
