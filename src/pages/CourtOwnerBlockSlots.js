import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

function CourtOwnerBlockSlots() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [blockDate, setBlockDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [blockedSlots, setBlockedSlots] = useState([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("courtOwnerToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Load only this owner’s venues
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("courtOwnerToken");
        const res = await fetch(`${API_BASE}/venues`, { headers: getAuthHeader() });
        const data = await res.json();
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const myVenues = data.filter((v) => v.ownerId?._id === decoded.id);
        setVenues(myVenues);
      } catch {
        alert("Failed to load your venues");
      }
    })();
  }, []);

  // Load courts for selected venue
  useEffect(() => {
    if (!selectedVenue) {
      setCourts([]);
      setBlockedSlots([]);
      return;
    }

    (async () => {
      const res = await fetch(`${API_BASE}/slots/${selectedVenue}/courts`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setCourts(data);
    })();
  }, [selectedVenue]);

  // Load blocked slots for selected court
  useEffect(() => {
    if (!selectedCourt) return;
    (async () => {
      const res = await fetch(`${API_BASE}/blockslots/${selectedCourt}`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setBlockedSlots(Array.isArray(data) ? data : []);
    })();
  }, [selectedCourt]);

  const handleBlock = async (e) => {
    e.preventDefault();
    if (!selectedVenue) return alert("Select venue");
    if (!selectedCourt) return alert("Select court");
    if (!blockDate) return alert("Select date");
    if (!startTime || !endTime) return alert("Select time range");
    if (!reason.trim()) return alert("Enter reason");

    const body = {
      courtId: selectedCourt,
      date: blockDate,
      startTime,
      endTime,
      reason: reason.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/blockslots`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to block slot");
      alert("Slot blocked successfully");
      setReason("");
      setStartTime("");
      setEndTime("");
      loadBlockedSlots();
    } catch (err) {
      alert(err.message || "Error blocking slot");
    }
  };

  const loadBlockedSlots = async () => {
    if (!selectedCourt) return;
    const res = await fetch(`${API_BASE}/blockslots/${selectedCourt}`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    setBlockedSlots(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this blocked slot?")) return;
    const res = await fetch(`${API_BASE}/blockslots/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (res.ok) {
      alert("Removed successfully");
      setBlockedSlots((prev) => prev.filter((b) => b._id !== id));
    } else alert("Failed to remove blocked slot");
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e2b3a] text-white flex flex-col">
        <div className="text-center py-4 font-bold text-xl border-b border-gray-700">
          Court Owner
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <a href="/courtowner/dashboard" className="block py-2 px-3 rounded hover:bg-gray-700">
            Dashboard
          </a>
          <a href="/courtowner/venues" className="block py-2 px-3 rounded hover:bg-gray-700">
            Venues
          </a>
          <a href="/courtowner/manageslots" className="block py-2 px-3 rounded hover:bg-gray-700">
            Manage Slots
          </a>
          <a href="/courtowner/blockslots" className="block py-2 px-3 rounded bg-gray-700">
            Block Slots
          </a>
        </nav>
        <a
          href="/logout"
          className="m-4 py-2 px-3 bg-red-600 rounded text-center hover:bg-red-700"
        >
          Logout
        </a>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Top Button Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => (window.location.href = "/courtowner/manageslots")}
            className="px-5 py-2 rounded font-medium bg-[#b37400] text-white"
          >
            Manage Courts & Slots
          </button>
          <button
            className="px-5 py-2 rounded font-medium bg-[#009688] text-white"
          >
            Block Slots
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-green-700">🛑 Block Slots</h2>

          {/* Block Form */}
          <form onSubmit={handleBlock} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium">Select Venue</label>
                <select
                  value={selectedVenue}
                  onChange={(e) => {
                    setSelectedVenue(e.target.value);
                    setSelectedCourt("");
                  }}
                  className="w-full p-2 border rounded mt-1"
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium">Select Date</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="block font-medium">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium">Reason for Blocking</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="e.g., Maintenance, Event, Cleaning"
              ></textarea>
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
            <h3 className="text-xl font-semibold mb-4">📋 Blocked Slots</h3>
            {blockedSlots.length === 0 ? (
              <p className="text-gray-500">No blocked slots found.</p>
            ) : (
              blockedSlots.map((b) => (
                <div
                  key={b._id}
                  className="flex justify-between items-center p-4 border rounded mb-2"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(b.date).toLocaleDateString()} | {formatTime(b.startTime)} -{" "}
                      {formatTime(b.endTime)}
                    </p>
                    <p className="text-sm text-gray-600">Reason: {b.reason}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourtOwnerBlockSlots;
