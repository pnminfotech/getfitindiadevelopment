import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

const API_BASE = "http://localhost:8000/api";

function ManageSlots() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [venueSports, setVenueSports] = useState([]);
  const [courtName, setCourtName] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [slots, setSlots] = useState([{ startTime: "", endTime: "", price: "" }]);
  const [defaultPrice, setDefaultPrice] = useState("");
  const [courts, setCourts] = useState([]);
  const [editCourtId, setEditCourtId] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("courtOwnerToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const priceToNumber = (p) =>
    p === "" || p == null ? 0 : Number(String(p).replace(/[^\d]/g, ""));

  const sanitizeSlots = (list) =>
    list
      .map((s) => ({
        startTime: s.startTime?.trim() || "",
        endTime: s.endTime?.trim() || "",
        price: priceToNumber(s.price),
      }))
      .filter((s) => s.startTime && s.endTime);

  const timesToMinutes = (t) => {
    const [h, m] = (t || "00:00").split(":").map(Number);
    return h * 60 + m;
  };

  const validateNoOverlap = (list) => {
    const intervals = list.map((s) => ({
      start: timesToMinutes(s.startTime),
      end: timesToMinutes(s.endTime),
    }));
    for (const it of intervals) {
      if (isNaN(it.start) || isNaN(it.end) || it.end <= it.start) return false;
    }
    intervals.sort((a, b) => a.start - b.start);
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i].start < intervals[i - 1].end) return false;
    }
    return true;
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;
  };

  // --- Load only this owner’s venues ---
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

  // --- When venue changes, fetch courts + sports list ---
  useEffect(() => {
    if (!selectedVenue) {
      setVenueSports([]);
      setCourts([]);
      return;
    }
    const venue = venues.find((v) => v._id === selectedVenue);
    setVenueSports(venue?.sports || []);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/slots/${selectedVenue}/courts`, {
          headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error("Failed to load courts");
        const data = await res.json();
        setCourts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        alert("Failed to load courts");
      }
    })();
  }, [selectedVenue, venues]);

  const handleSportToggle = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSlotChange = (idx, field, value) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addSlot = () => {
    setSlots((prev) => [
      ...prev,
      { startTime: "", endTime: "", price: defaultPrice },
    ]);
  };

  const resetForm = () => {
    setCourtName("");
    setSelectedSports([]);
    setSlots([{ startTime: "", endTime: "", price: defaultPrice }]);
    setEditCourtId(null);
  };

  const generateSlots = (period) => {
    let start = "05:00";
    let end = "12:30";
    if (period === "afternoon") {
      start = "12:30";
      end = "16:30";
    } else if (period === "evening") {
      start = "16:30";
      end = "23:59";
    }

    const generated = [];
    let [h, m] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    while (h < eh || (h === eh && m < em)) {
      const s = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      m += 30;
      if (m >= 60) {
        h += 1;
        m -= 60;
      }
      const e = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      generated.push({ startTime: s, endTime: e, price: defaultPrice });
    }

    setSlots((prev) => {
      const combined = [...prev, ...generated];
      const unique = combined.filter(
        (slot, i, arr) =>
          i === arr.findIndex(
            (s) =>
              s.startTime === slot.startTime && s.endTime === slot.endTime
          )
      );
      return unique;
    });
  };

  const refreshCourts = async () => {
    if (!selectedVenue) return;
    const res = await fetch(`${API_BASE}/slots/${selectedVenue}/courts`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to refresh courts");
    const data = await res.json();
    setCourts(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVenue) return alert("Select a venue");
    if (!courtName.trim()) return alert("Enter court name");
    if (selectedSports.length === 0) return alert("Select at least one sport");

    const normalizedSlots = sanitizeSlots(
      slots.map((s) => ({
        ...s,
        price:
          s.price === "" ? priceToNumber(defaultPrice) : priceToNumber(s.price),
      }))
    );

    if (normalizedSlots.length === 0) return alert("Add valid slots");
    if (!validateNoOverlap(normalizedSlots))
      return alert("Slots overlap or have invalid times");

    const body = {
      courtName: courtName.trim(),
      sports: selectedSports,
      slots: normalizedSlots,
    };

    const method = editCourtId ? "PUT" : "POST";
    const url = editCourtId
      ? `${API_BASE}/slots/${selectedVenue}/courts/${editCourtId}`
      : `${API_BASE}/slots/${selectedVenue}/courts`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Error saving court");
      alert(`Court ${editCourtId ? "updated" : "added"} successfully`);
      resetForm();
      await refreshCourts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Network error");
    }
  };

  const handleEdit = (court) => {
    setCourtName(court.courtName || "");
    setSelectedSports(Array.isArray(court.sports) ? court.sports : []);
    setSlots(
      (court.slots || []).map((s) => ({
        startTime: s.startTime || "",
        endTime: s.endTime || "",
        price: s.price ?? "",
      }))
    );
    setEditCourtId(court._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this court?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/slots/${selectedVenue}/courts/${id}`,
        {
          method: "DELETE",
          headers: { ...getAuthHeader() },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to delete court");
      alert("Deleted successfully");
      setCourts((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error(e);
      alert(e.message || "Network error");
    }
  };

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

          <h2 className="text-2xl font-bold mb-6 text-blue-700">🎾 Manage Slots</h2>

          {/* --- Form Section --- */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium">Select Venue</label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  required
                >
                  <option value="">-- Choose --</option>
                  {venues.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Court Name</label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  placeholder="Enter court name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium">Select Sports</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {venueSports.map((sport) => (
                  <label key={sport} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSports.includes(sport)}
                      onChange={() => handleSportToggle(sport)}
                    />
                    <span>{sport}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Default Price for All Slots
              </label>
              <input
                type="number"
                min="0"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
                className="p-2 border rounded w-full max-w-xs"
                placeholder="e.g. 500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Slots</label>
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2"
                >
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleSlotChange(idx, "startTime", e.target.value)
                    }
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleSlotChange(idx, "endTime", e.target.value)
                    }
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    value={slot.price ? `₹ ${slot.price}` : ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      handleSlotChange(idx, "price", val);
                    }}
                    className="p-2 border rounded w-full"
                    placeholder="₹ Price"
                    required
                  />
                </div>
              ))}

              <div className="flex gap-3 flex-wrap mt-3">
                <button
                  type="button"
                  onClick={addSlot}
                  className="text-blue-600 underline"
                >
                  + Add Slot
                </button>
                <button
                  type="button"
                  onClick={() => generateSlots("morning")}
                  className="bg-green-100 px-3 py-1 rounded"
                >
                  Morning
                </button>
                <button
                  type="button"
                  onClick={() => generateSlots("afternoon")}
                  className="bg-yellow-100 px-3 py-1 rounded"
                >
                  Afternoon
                </button>
                <button
                  type="button"
                  onClick={() => generateSlots("evening")}
                  className="bg-indigo-100 px-3 py-1 rounded"
                >
                  Evening
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              {editCourtId ? "Update Court" : "Save Court"}
            </button>
          </form>

          {/* --- Existing Courts Section --- */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">🎯 Existing Courts</h3>
            {courts.length === 0 ? (
              <p className="text-gray-500">No courts available.</p>
            ) : (
              <ul className="space-y-4">
                {courts.map((court) => (
                  <li
                    key={court._id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(court)}
                        className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(court._id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{court.courtName}</p>
                      <p className="text-sm text-gray-600">
                        Sports:{" "}
                        {Array.isArray(court.sports)
                          ? court.sports.join(", ")
                          : "—"}
                      </p>
                      <ul className="mt-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(court.slots || []).map((slot, idx) => (
                          <div
                            key={idx}
                            className="border border-cyan-900 text-black p-3 rounded-md mb-2"
                          >
                            <div className="font-medium">
                              {formatTime(slot.startTime)} -{" "}
                              {formatTime(slot.endTime)}
                            </div>
                            <div className="text-sm text-gray-600">
                              ₹ {slot.price}
                            </div>
                          </div>
                        ))}
                      </ul>
                    </div>
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

export default ManageSlots;
