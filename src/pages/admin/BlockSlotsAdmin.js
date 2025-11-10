import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const BlockSlotsAdmin = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [selectedSlotsToBlock, setSelectedSlotsToBlock] = useState([]);
  const [monthlyBlockedSlots, setMonthlyBlockedSlots] = useState([]);
  const [dailyBlockedSlots, setDailyBlockedSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
const [selectedMonth, setSelectedMonth] = useState("");



  useEffect(() => {
    fetch("http://localhost:8000/api/venues")
      .then((res) => res.json())
      .then(setVenues)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const venue = venues.find((v) => v._id === selectedVenue);
    setCourts(venue?.courts || []);
    if (selectedCourt && !venue?.courts.some((c) => c._id === selectedCourt._id)) {
      setSelectedCourt(null);
    }
  }, [selectedVenue, venues]);

  useEffect(() => {
    if (!selectedCourt || !selectedDate) return;
    const fetchSlots = async () => {
      try {
        const slotRes = await fetch(`http://localhost:8000/api/slots/${selectedVenue}/${selectedCourt._id}/slots`);
        const slotsData = await slotRes.json();
        setAvailableSlots(slotsData || []);

        const blockedRes = await fetch(`http://localhost:8000/api/block/${selectedVenue}/${selectedCourt._id}?date=${selectedDate}`);
        const blockedData = await blockedRes.json();
        setBlockedSlots(blockedData || []);
      } catch (err) {
        console.error("Error fetching slots/block info", err);
      }
    };
    fetchSlots();
  }, [selectedCourt, selectedDate, selectedVenue]);

const fetchGlobalBlockedSlots = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/block/blocked");

    // Destructure response expecting object with dailyBlocked and monthlyBlocked arrays
    const { dailyBlocked = [], monthlyBlocked = [] } = await res.json();

    // Debug logs to verify data received
    console.log("✅ Monthly Blocked Slots:", monthlyBlocked);
    console.log("✅ Daily Blocked Slots:", dailyBlocked);

    // Set state
    setMonthlyBlockedSlots(monthlyBlocked);
    setDailyBlockedSlots(dailyBlocked);
  } catch (err) {
    console.error("❌ Error fetching blocked slots", err);
  }
};




  useEffect(() => {
    fetchGlobalBlockedSlots();
  }, []);

  const handleSlotToggle = (slot) => {
    const exists = selectedSlotsToBlock.some(
      (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
    );
    setSelectedSlotsToBlock((prev) =>
      exists
        ? prev.filter((s) => s.startTime !== slot.startTime || s.endTime !== slot.endTime)
        : [...prev, slot]
    );
  };

  const handleBlock = async () => {
    if (!selectedCourt || !selectedDate || selectedSlotsToBlock.length === 0) {
      return alert("Please select court, date, and slots to block.");
    }
    try {
      const res = await fetch("http://localhost:8000/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueId: selectedVenue,
          courtId: selectedCourt._id,
          date: selectedDate,
          slots: selectedSlotsToBlock,
        }),
      });

      if (res.ok) {
        alert("Slots blocked successfully");
        setSelectedSlotsToBlock([]);
        fetchGlobalBlockedSlots();
        setSelectedDate((prev) => prev);
      } else {
        const err = await res.json();
        alert("Error: " + (err.message || "Failed to block slots"));
      }
    } catch (err) {
      alert("Block error");
      console.error(err);
    }
  };

  const handleMonthlyBlock = async () => {
    const confirm = window.confirm("Block selected slots for the entire month?");
    if (!confirm) return;
    const year = new Date(selectedDate).getFullYear();
    const month = new Date(selectedDate).getMonth() + 1;

    try {
      const res = await fetch("http://localhost:8000/api/block/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueId: selectedVenue,
          courtId: selectedCourt._id,
          year,
          month,
          slots: selectedSlotsToBlock,
        }),
      });

      if (res.ok) {
        alert("Month blocked!");
        setSelectedSlotsToBlock([]);
        fetchGlobalBlockedSlots();
      } else {
        const err = await res.json();
        alert("Error: " + (err.message || "Failed to block for month"));
      }
    } catch (err) {
      alert("Request failed");
      console.error(err);
    }
  };
const handleUnblockFullMonth = async () => {
  if (!selectedMonth || !selectedVenue || !selectedCourt) return;

  const [year, month] = selectedMonth.split("-").map(Number);

  const confirm = window.confirm(`Unblock all slots for ${selectedMonth}?`);
  if (!confirm) return;

  try {
    const res = await fetch("http://localhost:8000/api/block/unblock-month", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        venueId: selectedVenue,
        courtId: selectedCourt._id,
        year,
        month,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      alert(`✅ ${result.deletedCount} slots unblocked for ${selectedMonth}`);
      fetchGlobalBlockedSlots(); // Refresh
    } else {
      alert("❌ " + result.message);
    }
  } catch (error) {
    console.error("Unblock month failed:", error);
    alert("Failed to unblock slots");
  }
};
 

  const handleUnblock = async (slotId) => {
    const confirm = window.confirm("Unblock this slot?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8000/api/block/${slotId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchGlobalBlockedSlots();
      } else {
        alert("Failed to unblock slot.");
      }
    } catch (err) {
      alert("Error unblocking slot.");
      console.error(err);
    }
  };

  const isBlocked = (slot) =>
    blockedSlots.some((b) => b.startTime === slot.startTime && b.endTime === slot.endTime);
  const isSelected = (slot) =>
    selectedSlotsToBlock.some((s) => s.startTime === slot.startTime && s.endTime === slot.endTime);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto bg-white rounded-xl shadow">
      {/* LEFT */}
      <div className="w-full lg:w-1/2 space-y-4 border-r pr-4">
        <h2 className="text-2xl font-bold text-blue-700">⛔ Block Slots</h2>

        <select className="w-full p-2 border rounded" value={selectedVenue} onChange={(e) => setSelectedVenue(e.target.value)}>
          <option value="">Select Venue</option>
          {venues.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}
        </select>

        {courts.length > 0 && (
          <select className="w-full p-2 border rounded" value={selectedCourt?._id || ""} onChange={(e) => setSelectedCourt(courts.find((c) => c._id === e.target.value))}>
            <option value="">Select Court</option>
            {courts.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courtName} ({(c.sports || []).join(", ")})
              </option>
            ))}
          </select>
        )}

        <input type="date" className="w-full p-2 border rounded" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} disabled={!selectedCourt} />

        {availableSlots.length > 0 && (
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  const unblocked = availableSlots.filter((slot) => !isBlocked(slot));
                  setSelectedSlotsToBlock(unblocked);
                } else {
                  setSelectedSlotsToBlock([]);
                }
              }}
              checked={
                selectedSlotsToBlock.length > 0 &&
                selectedSlotsToBlock.length === availableSlots.filter((slot) => !isBlocked(slot)).length
              }
            />
            Select All Slots
          </label>
        )}

        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {availableSlots.map((slot, idx) => {
            const blocked = isBlocked(slot);
            const selected = isSelected(slot);
            return (
              <div
                key={idx}
                className={`p-2 text-sm rounded border flex justify-between items-center ${
                  blocked ? "bg-red-100 text-red-600" : selected ? "bg-yellow-100" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => !blocked && handleSlotToggle(slot)}
              >
                {slot.startTime} - {slot.endTime}
                {blocked && <span className="text-xs">Blocked</span>}
                {selected && !blocked && <span className="text-xs text-yellow-700">To Block</span>}
              </div>
            );
          })}
        </div>

        {selectedSlotsToBlock.length > 0 && (
          <div className="flex gap-3">
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleBlock}>
              Block Selected
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleMonthlyBlock}>
              Block for Month
            </button>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2">
        <input
          type="text"
          placeholder="Search by Garden Name"
          className="w-full mb-4 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />

        <h3 className="text-lg font-bold text-purple-700 mb-2">📅 Monthly Blocked Slots</h3>
      <div className="space-y-2 max-h-[30vh] overflow-y-auto">
  {monthlyBlockedSlots
    .filter((s) => s.venueName?.toLowerCase().includes(searchTerm))
    .map((slot) => (
      <div
        key={slot._id}
        className="flex justify-between items-center bg-purple-100 border border-purple-400 p-2 rounded text-sm"
      >
        <div>
          <div className="font-semibold">{slot.venueName}</div>
          <div>{slot.courtName}</div>
          <div>{slot.startTime} - {slot.endTime}</div>
          <div className="text-gray-700">
            From:{" "}
            {slot.startDate
              ? new Date(slot.startDate).toLocaleDateString()
              : "N/A"}
            {" "}to{" "}
            {slot.endDate
              ? new Date(slot.endDate).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      </div>
    ))}
</div>


        <h3 className="text-lg font-bold text-red-700 mt-6 mb-2">🧱 Daily Blocked Slots</h3>
        <div className="space-y-2 max-h-[40vh] overflow-y-auto">
          {dailyBlockedSlots
            .filter((s) => s.venueName?.toLowerCase().includes(searchTerm))
            .map((slot) => (
              <div key={slot._id} className="flex justify-between items-center bg-red-100 border border-red-400 p-2 rounded text-sm">
                <div>
                  <div className="font-semibold">{slot.venueName}</div>
                  <div>{slot.courtName}</div>
                  <div>{new Date(slot.date).toLocaleDateString()} | {slot.startTime} - {slot.endTime}</div>
                </div>
                <button onClick={() => handleUnblock(slot._id)} className="text-red-700 hover:text-red-900">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
        </div>



       <div className="bg-white shadow p-4 rounded-lg mt-6 border border-red-200">
  <h3 className="text-lg font-bold text-red-700 mb-2">🗓️ Unblock Full Month</h3>

  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
    {/* Venue select */}
    <select
      className="p-2 border rounded flex-1 min-w-[150px]"
      value={selectedVenue}
      onChange={(e) => setSelectedVenue(e.target.value)}
    >
      <option value="">Select Venue</option>
      {venues.map((v) => (
        <option key={v._id} value={v._id}>{v.name}</option>
      ))}
    </select>

    {/* Court select */}
    {courts.length > 0 && (
      <select
        className="p-2 border rounded flex-1 min-w-[150px]"
        value={selectedCourt?._id || ""}
        onChange={(e) =>
          setSelectedCourt(courts.find((c) => c._id === e.target.value))
        }
      >
        <option value="">Select Court</option>
        {courts.map((c) => (
          <option key={c._id} value={c._id}>
            {c.courtName}
          </option>
        ))}
      </select>
    )}

    {/* Month input */}
    <input
      type="month"
      className="p-2 border rounded flex-1 min-w-[150px]"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    />

    {/* Unblock button */}
    <button
      onClick={handleUnblockFullMonth}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-shrink-0"
      disabled={!selectedVenue || !selectedCourt || !selectedMonth}
    >
      🔓 Unblock Full Month
    </button>
  </div>
</div>


      </div>
    </div>
  );
};

export default BlockSlotsAdmin;
