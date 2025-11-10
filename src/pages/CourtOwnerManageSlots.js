import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

function CourtOwnerManageSlots() {
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

  // Load venues owned by this court owner
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("courtOwnerToken");
        const res = await fetch(`${API_BASE}/venues`, { headers: getAuthHeader() });
        const data = await res.json();
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const owned = data.filter((v) => v.ownerId?._id === decoded.id);
        setVenues(owned);
      } catch {
        alert("Failed to load venues");
      }
    })();
  }, []);

  // Load courts when venue selected
  useEffect(() => {
    if (!selectedVenue) return;
    (async () => {
      const res = await fetch(`${API_BASE}/slots/${selectedVenue}/courts`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setCourts(data);
    })();
  }, [selectedVenue]);

  const addSlot = () =>
    setSlots([...slots, { startTime: "", endTime: "", price: defaultPrice }]);

  const handleSlotChange = (i, key, val) => {
    const copy = [...slots];
    copy[i][key] = val;
    setSlots(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVenue) return alert("Select venue");
    if (!courtName.trim()) return alert("Enter court name");

    const body = {
      courtName,
      sports: selectedSports,
      slots: slots.filter((s) => s.startTime && s.endTime),
    };

    const url = editCourtId
      ? `${API_BASE}/slots/${selectedVenue}/courts/${editCourtId}`
      : `${API_BASE}/slots/${selectedVenue}/courts`;

    const method = editCourtId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      alert("Court saved!");
      setCourtName("");
      setSlots([{ startTime: "", endTime: "", price: "" }]);
      const data = await res.json();
      setCourts((prev) => (editCourtId ? prev.map((c) => (c._id === data._id ? data : c)) : [...prev, data]));
      setEditCourtId(null);
    } else alert("Error saving court");
  };

  const formatTime = (t) => {
    if (!t) return "--";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
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
          <a href="/courtowner/manageslots" className="block py-2 px-3 rounded bg-gray-700">
            Manage Slots
          </a>
          <a href="/courtowner/blockslots" className="block py-2 px-3 rounded hover:bg-gray-700">
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
        <div className="flex gap-3 mb-6">
          <button
            className={`px-5 py-2 rounded font-medium ${
              window.location.pathname.includes("manageslots")
                ? "bg-[#b37400] text-white"
                : "bg-gray-200"
            }`}
          >
            Manage Courts & Slots
          </button>
          <button
            onClick={() => (window.location.href = "/courtowner/blockslots")}
            className="px-5 py-2 rounded font-medium bg-[#009688] text-white"
          >
            Block Slots
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">🎾 Manage Slots</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium">Select Venue</label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
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
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Enter court name"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium">Select Sports</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {venueSports.map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSports.includes(s)}
                      onChange={() =>
                        setSelectedSports((prev) =>
                          prev.includes(s)
                            ? prev.filter((x) => x !== s)
                            : [...prev, s]
                        )
                      }
                    />
                    {s}
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
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
                placeholder="e.g. 500"
                className="border rounded p-2 w-full max-w-xs"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Slots</label>
              {slots.map((slot, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleSlotChange(i, "startTime", e.target.value)}
                    className="border rounded p-2 flex-1"
                  />
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleSlotChange(i, "endTime", e.target.value)}
                    className="border rounded p-2 flex-1"
                  />
                  <input
                    type="number"
                    value={slot.price}
                    onChange={(e) => handleSlotChange(i, "price", e.target.value)}
                    className="border rounded p-2 w-28"
                    placeholder="₹ Price"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSlot}
                className="text-blue-600 underline text-sm"
              >
                + Add Slot
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              {editCourtId ? "Update Court" : "Save Court"}
            </button>
          </form>

          {/* Existing Courts */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">🎯 Existing Courts</h3>
            {courts.length === 0 ? (
              <p className="text-gray-500">No courts available.</p>
            ) : (
              courts.map((court) => (
                <div key={court._id} className="border p-3 rounded mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{court.courtName}</p>
                      <p className="text-sm text-gray-600">
                        {court.sports.join(", ")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditCourtId(court._id)}
                        className="p-2 bg-yellow-400 rounded text-white"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setCourts((prev) =>
                            prev.filter((c) => c._id !== court._id)
                          )
                        }
                        className="p-2 bg-red-600 rounded text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {court.slots.map((s, idx) => (
                      <div
                        key={idx}
                        className="border border-cyan-900 p-2 rounded text-sm"
                      >
                        {formatTime(s.startTime)} - {formatTime(s.endTime)} | ₹
                        {s.price}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourtOwnerManageSlots;
