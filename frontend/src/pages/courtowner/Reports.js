import React, { useEffect, useState , useRef } from "react";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";
import DatePickerinCourtOwner from "../../components/DatePickerinCourtOwner";

import { useNavigate } from "react-router-dom";




const API = "http://localhost:8000/api";

const rangePresets = [
  { key: "lastWeek", label: "Last Week" },
  { key: "lastMonth", label: "Last Month" },
  { key: "mtd", label: "MTD" },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("reports");
  const [range, setRange] = useState("mtd");
  const [summary, setSummary] = useState(null);
  const [list, setList] = useState({ items: [], total: 0, page: 1, limit: 20 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayOccupancy, setDayOccupancy] = useState([]);
  const navigate = useNavigate();
  // ✅ Add this line here

  const scrollRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
useEffect(() => {
  if (showFilter) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "auto";
}, [showFilter]);
const presetsRef = useRef(null);
  // ✅ Venues and filter
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("all");
const [futureBookings, setFutureBookings] = useState([]);
  // ✅ Range filter (All Slots)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());

  const token = localStorage.getItem("courtOwnerToken");



  // 🔹 Fetch all venues owned by this court owner
  const fetchVenues = async () => {
    try {
      const res = await fetch(`${API}/courtowner/venues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVenues(data);
    } catch (err) {
      console.error("Error fetching venues:", err);
    }
  };

  // ✅ Fetch summary (daily)
  const fetchSummary = async (date) => {
    try {
      let url = `${API}/courtowner/reports/summary?date=${date.toISOString()}`;
      if (selectedVenue !== "all") url += `&venueId=${selectedVenue}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Summary fetch error:", err);
    }
  };

  // ✅ Fetch summary by range (From–To)
  const fetchSummaryRange = async (from, to) => {
    try {
      let url = `${API}/courtowner/reports/summary?from=${from.toISOString()}&to=${to.toISOString()}`;
      if (selectedVenue !== "all") url += `&venueId=${selectedVenue}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Summary (range) fetch error:", err);
    }
  };

  // ✅ Fetch summary by preset
  const fetchSummaryPreset = async (presetKey) => {
    try {
      let url = `${API}/courtowner/reports/summary?range=${presetKey}`;
      if (selectedVenue !== "all") url += `&venueId=${selectedVenue}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Summary (preset) fetch error:", err);
    }
  };

  // ✅ Fetch bookings list (filtered)
  const fetchListFiltered = async (options = {}) => {
    try {
      let url = `${API}/courtowner/reports/list?limit=20`;
      if (options.range) url += `&range=${options.range}`;
      else if (options.from && options.to)
        url += `&from=${options.from.toISOString()}&to=${options.to.toISOString()}`;
      if (selectedVenue !== "all") url += `&venueId=${selectedVenue}`;

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setList(data);
    } catch (err) {
      console.error("List fetch error:", err);
    }
  };

  // ✅ Fetch occupancy (daily, by venue)
  const fetchOccupancyByDate = async (date) => {
    try {
      let url = `${API}/courtowner/reports/bydate?date=${date.toISOString()}`;
      if (selectedVenue !== "all") url += `&venueId=${selectedVenue}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDayOccupancy(data.courts || []);
    } catch (err) {
      console.error("Occupancy fetch error:", err);
    }
  };

  // ✅ Export PDF / Excel
  const handleExport = async (type) => {
    setShowDropdown(false);
    let endpoint =
      type === "pdf"
        ? `${API}/courtowner/reports/export/pdf?range=${range}`
        : `${API}/courtowner/reports/export/excel?range=${range}`;
    if (selectedVenue !== "all") endpoint += `&venueId=${selectedVenue}`;

    try {
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "pdf" ? "CourtReport.pdf" : "CourtReport.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to download report");
    }
  };
const fetchFutureBookings = async () => {
  try {
    const today = new Date();
    const url = `${API}/courtowner/reports/list?from=${today.toISOString()}&to=${new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setFutureBookings(data.items || []);
  } catch (err) {
    console.error("Future bookings fetch error:", err);
  }
};
useEffect(() => {
  if (activeTab === "reports" && token) {
    fetchSummary(selectedDate);
    fetchOccupancyByDate(selectedDate);
    fetchFutureBookings();
  }
}, [activeTab, selectedVenue, selectedDate, token]);


  // 🔹 Load venues initially
  useEffect(() => {
    if (token) fetchVenues();
  }, [token]);

  // 🔹 Load Reports tab data
 useEffect(() => {
  if (!token) return;

  if (activeTab === "reports") {
    // Daily report
    fetchSummary(selectedDate);
    fetchOccupancyByDate(selectedDate);
    // fetchListFiltered({ range });
fetchListFiltered({ range: "mtd" }); // month-to-date, includes upcoming bookings

  } else if (activeTab === "allSlots") {
    // Range report
    fetchSummaryRange(startDate, endDate);
    fetchListFiltered({ from: startDate, to: endDate });
  }
}, [activeTab, selectedVenue, selectedDate, startDate, endDate, token]);

  // 🔹 Load All Slots tab data
  // useEffect(() => {
  //   if (activeTab === "allSlots" && token) {
  //     fetchSummaryRange(startDate, endDate);
  //     fetchListFiltered({ from: startDate, to: endDate });
  //   }
  // }, [activeTab, startDate, endDate, token, selectedVenue]);
// 🔸 Filter occupancy locally if backend returns multiple venues
const filteredOccupancy =
  selectedVenue === "all"
    ? dayOccupancy
    : dayOccupancy.filter(
        (c) =>
          c.venueId === selectedVenue ||
          c.venue === venues.find((v) => v._id === selectedVenue)?.name
      );

// 🔸 Filter bookings locally if backend doesn't filter
const filteredBookings =
  selectedVenue === "all"
    ? list.items
    : list.items.filter(
        (b) =>
          b.venueId?._id === selectedVenue ||
          b.venueId === selectedVenue ||
          b.venueId?.name === venues.find((v) => v._id === selectedVenue)?.name
      );
// 🔹 Today's date reference (midnight, no time component)
const today = new Date();
today.setHours(0, 0, 0, 0);
// 🔹 Compare each booking date to the selected report date (not system date)
const isFuture = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const ref = new Date(selectedDate);
  ref.setHours(0, 0, 0, 0);

  return d.getTime() > ref.getTime(); // future bookings are those after selected date
};

// 🔹 Calculate Advanced Bookings (future bookings)
const advancedBookings = futureBookings.filter((b) => isFuture(b.date));



// 🔹 Totals
const totalAdvancedRevenue = advancedBookings.reduce(
  (sum, b) => sum + (b.price || 0),
  0
);

const onlineAdvancedRevenue = advancedBookings
  .filter((b) => !!b.razorpay_payment_id)
  .reduce((sum, b) => sum + (b.price || 0), 0);
// 🧩 Create a portal container dynamically (only if it doesn’t exist)
useEffect(() => {
  let portalRoot = document.getElementById("filter-date-picker");
  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.id = "filter-date-picker";
    document.body.appendChild(portalRoot);
  }
  return () => {
    // optional cleanup if needed
    // document.body.removeChild(portalRoot);
  };
}, []);
const handleRangeClick = async (rKey) => {
  setRange(rKey);
  await Promise.all([
    fetchSummaryPreset(rKey),
    fetchListFiltered({ range: rKey })
  ]);
};

 return (
  <div className="flex-1 p-4 md:p-6  lg:ml-64">
    <CourtOwnerSidebar />

    {/* 🔹 Sticky Header Section */}
<div className="sticky top-0  shadow-sm bg-white z-10">

      {/* 🔹 Title + Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-3">
        <h2 className="sm:text-sm md:text-xl lg:text-2xl font-semibold text-gray-800 text-center mainheading">
          {selectedVenue === "all"
            ? "Reports"
            : venues.find((v) => v._id === selectedVenue)?.name || "Reports"}
        </h2>

        {/* Tabs */}
        <div className="flex bg-white rounded-full p-1 shadow-md w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-sm font-medium ${
              activeTab === "reports"
                ? "bg-[#0d2149] text-white"
                : "text-gray-700"
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab("allSlots")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-sm font-medium ${
              activeTab === "allSlots"
                ? "bg-[#0d2149] text-white"
                : "text-gray-700"
            }`}
          >
            All Slots
          </button>
        </div>
      </div>

      {/* 🔹 Venue Dropdown */}
      <div className="flex  mb-3">
        <select
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
          className="border border-gray-400 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          <option value="all" className="">All Venues</option>
          {venues.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Dynamic Controls for each tab */}
      {activeTab === "reports" && (
        <div className="flex justify-center mb-2 transition-all duration-300">
          <DatePickerinCourtOwner
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      )}

      {activeTab === "allSlots" && (
        <div className="flex flex-col items-center gap-2 mb-3">
          {/* Preset Filters */}
          {/* <div className="flex justify-center gap-2 flex-wrap">
            {rangePresets.map((r) => (
              <button
                key={r.key}
                onClick={() => {
                  setRange(r.key);
                  fetchSummaryPreset(r.key);
                  fetchListFiltered({ range: r.key });
                }}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  range === r.key
                    ? "bg-[#0d2149] text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div> */}

          {/* Date Range + Apply */}
         {/* Filter + Presets Row */}
{/* Filter + Presets Row (horizontal scroll) */}
<div className="relative w-full group">
  {/* Scrollable strip */}
  <div
    ref={presetsRef}
    className="flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar px-1 py-1 scroll-smooth"
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    <button
      onClick={() => setShowFilter(true)}
      className="shrink-0 whitespace-nowrap flex items-center gap-1 bg-white border rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
    >
      <span>⚙️ Filter</span>
    </button>

    {rangePresets.map((r) => (
      <button
        key={r.key}
        onClick={() => handleRangeClick(r.key)}

        className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full border text-sm transition ${
          range === r.key ? "bg-[#0d2149] text-white" : "bg-white text-gray-700"
        }`}
      >
        {r.label}
      </button>
    ))}
  </div>

  {/* Optional: arrows (show on md+) */}
  <button
    onClick={() => presetsRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow w-8 h-8 items-center justify-center hover:bg-gray-100 opacity-0 group-hover:opacity-100"
  >
    ‹
  </button>
  <button
    onClick={() => presetsRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow w-8 h-8 items-center justify-center hover:bg-gray-100 opacity-0 group-hover:opacity-100"
  >
    ›
  </button>
</div>

{/* 🔹 Show selected range + label in one line */}
{startDate && endDate && (
  <div className="flex justify-left items-center flex-wrap gap-2 text-gray-600 text-sm mt-2 mb-2">
    <span>
      {startDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}{" "}
      to{" "}
      {endDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </span>
    <span className="text-gray-400">•</span>
    <span className="text-gray-500 font-medium">
      Showing{" "}
      {range
        ? rangePresets.find((r) => r.key === range)?.label
        : "Custom Range"}
    </span>
  </div>
)}

{summary && (
  <>
    {/* ✅ Horizontal Scroll Section with Left/Right Buttons */}
    <div className="relative w-full mb-0 group">
      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar space-x-3 pb-3 px-1 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {[
          { title: "Total Revenue", value: `₹${summary.totalRevenue || 0}` },
          { title: "Online Revenue", value: `₹${summary.onlineRevenue || 0}` },
          { title: "Total Bookings", value: summary.totalBookings || 0 },
          { title: "Online Bookings", value: summary.onlineBookings || 0 },
          { title: "Total Slots", value: summary.totalSlots || 0 },
          {
            title: "Cancellations",
            value: summary.cancellations || 0,
            color: "text-[#e11d48]",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] flex-shrink-0 snap-start"
          >
            <SummaryCard
              title={card.title}
              value={card.value}
              color={card.color}
            />
          </div>
        ))}
      </div>

      {/* Left Arrow Button */}
      <button
        onClick={() => {
          const container = scrollRef.current;
          container.scrollBy({ left: -200, behavior: "smooth" });
        }}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md w-8 h-8 items-center justify-center hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        ‹
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={() => {
          const container = scrollRef.current;
          container.scrollBy({ left: 200, behavior: "smooth" });
        }}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md w-8 h-8 items-center justify-center hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        ›
      </button>
    </div>
  </>
)}





        </div>
      )}
    </div>

    {/* 🔹 Scrollable Content Section */}
    <div
      className={`overflow-y-auto ${
        activeTab === "reports"
          ? "max-h-[calc(100vh-280px)]"
          : "max-h-[calc(100vh-330px)]"
      } `}
    >
      {/* -------- REPORTS TAB -------- */}
      {activeTab === "reports" && summary && (
        <div className="space-y-5">
          {/* Slot Collection */}
          <section className="bg-white rounded-2xl p-4 shadow-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Slot Collection</h3>
            <p className="text-sm text-gray-500 mb-1">
              Received ₹{summary.totalRevenue || 0}
            </p>
            <ProgressBar value={100} />
            <p className="text-sm text-gray-500 mt-2">
              • Online ₹{summary.onlineRevenue || 0}
            </p>
          </section>

          {/* Advanced Slot Booking */}
          <section className="bg-white rounded-2xl p-4 shadow-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">
              Advanced Slot Booking (Future Bookings)
            </h3>
            {advancedBookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming bookings found.</p>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-1">
                  Total ₹{totalAdvancedRevenue.toLocaleString()} —{" "}
                  {advancedBookings.length} bookings
                </p>
                <ProgressBar value={100} />
                <p className="text-sm text-gray-500 mt-2">
                  • Online ₹{onlineAdvancedRevenue.toLocaleString()}
                </p>
              </>
            )}
          </section>

          {/* Occupancy */}
          <section className="bg-white rounded-2xl p-4 shadow-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">
              Occupancy{" "}
              {selectedVenue !== "all" &&
                `(${venues.find((v) => v._id === selectedVenue)?.name || ""})`}
            </h3>
            {filteredOccupancy.length === 0 ? (
              <p className="text-gray-500 text-sm mt-3">
                No bookings for this venue/date.
              </p>
            ) : (
              filteredOccupancy.map((c, idx) => (
                <div key={idx} className="mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    {c.court}
                    <span className="float-right text-sm text-gray-600">
                      {c.bookedHours}/{c.totalHours} hrs
                    </span>
                  </p>
                  <ProgressBar value={(c.bookedHours / c.totalHours) * 100} />
                </div>
              ))
            )}
          </section>
        </div>
      )}

      {/* -------- ALL SLOTS TAB -------- */}
      {activeTab === "allSlots" && (
        <div className="space-y-4">
          {/* Summary Cards */}
          {/* {summary && (
            <>
              <div className="text-center text-gray-500 text-sm mb-2">
                Showing{" "}
                {range
                  ? rangePresets.find((r) => r.key === range)?.label
                  : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 text-center">
                <SummaryCard
                  title="Total Revenue"
                  value={`₹${summary.totalRevenue || 0}`}
                />
                <SummaryCard
                  title="Online Revenue"
                  value={`₹${summary.onlineRevenue || 0}`}
                />
                <SummaryCard
                  title="Total Bookings"
                  value={summary.totalBookings || 0}
                />
                <SummaryCard
                  title="Online Bookings"
                  value={summary.onlineBookings || 0}
                />
                <SummaryCard
                  title="Total Slots"
                  value={summary.totalSlots || 0}
                />
                <SummaryCard
                  title="Cancellations"
                  value={summary.cancellations || 0}
                  color="text-[#e11d48]"
                />
              </div>
            </>
          )} */}

          {/* Booking List */}
         {filteredBookings.length === 0 ? (
  <p className="text-gray-500 text-center">
    No bookings found for this venue.
  </p>
) : (
  <div className="overflow-y-auto no-scrollbar max-h-[70vh] pr-1">
    {filteredBookings.map((b) => (
      // <div
      //   key={b._id}
      //   className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      // >
      <div
  key={b._id}
  onClick={() => navigate(`/courtowner/booking/${b._id}`)}
  className="bg-[#e9e9e9] rounded-2xl p-4 mb-3 shadow-sm border border-[#ccc] cursor-pointer hover:shadow-md transition"
>
<div className="flex justify-between items-center mb-2">
  <div className="flex gap-2">
    {b.status?.toLowerCase() === "paid" ? (
      <Badge text="CONFIRMED" color="green" />
    ) : (
      <Badge text="CANCELLED" color="orange" />
    )}

    {/* Add border-black only for this one */}
    <Badge
      text={b.razorpay_payment_id ? "ONLINE" : "OFFLINE"}
      color="gray"
      bordered
    />
  </div>

  <p className="text-xs text-gray-500 font-semibold">
    ID: {(b._id || "").slice(-8).toUpperCase()}
  </p>
</div>



        <p className="font-medium text-gray-800 mb-1">
          {b.venueId?.name || "Venue"}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(b.date).toDateString()} • {b.startTime} - {b.endTime}
        </p>
        <p className="text-sm text-gray-500">Court {b.courtName}</p>
<hr className="my-2 border-gray-300" />
        <div className="mt-3 flex justify-between items-center ">
          <p className="text-sm font-medium text-gray-700">
            {b.userId?.name || "User"}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            ₹ {b.price}
          </p>
        </div>
      </div>
    ))}
  </div>
)}

        </div>
      )}
    </div>

    {/* ✅ Sticky GET REPORT Button */}
    <div className="fixed bottom-5 right-5 ">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-[#0d2149] text-white font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          GET REPORT
          <span className="text-sm">▼</span>
        </button>

        {showDropdown && (
          <div className="absolute bottom-14 right-0 bg-white border rounded-lg shadow-lg overflow-hidden animate-fadeIn">
            <button
              onClick={() => handleExport("pdf")}
              className="block px-4 py-2 w-full text-left text-sm hover:bg-gray-100"
            >
              📄 Export as PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="block px-4 py-2 w-full text-left text-sm hover:bg-gray-100"
            >
              📊 Export as Excel
            </button>
          </div>
        )}
      </div>
    </div>
{/* Filter Drawer Modal */}
{showFilter && (
  <div
    className="fixed inset-0 flex justify-end bg-black bg-opacity-40 z-[9998]"
    style={{ pointerEvents: "auto" }}
  >
   <div
  className={`bg-white sm:mt-40 mt-0 w-full sm:w-[400px] h-full sm:h-auto sm:rounded-l-2xl shadow-xl flex flex-col transform transition-transform duration-300 ease-out filtersidebar ${
    window.innerWidth < 640 ? "translate-y-0" : "translate-x-0"
  } relative z-[10000]`}
>


      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Filter</h3>
        <button
          onClick={() => setShowFilter(false)}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Start Date</p>
          <DatePickerinCourtOwner
  date={startDate}
  onDateChange={setStartDate}
  popperContainer={({ children }) => <div className="z-[10010]">{children}</div>}
  portalId="filter-date-picker"
/>



        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">End Date</p>
         <DatePickerinCourtOwner
  date={endDate}
  onDateChange={setEndDate}
  popperContainer={({ children }) => <div className="z-[10010]">{children}</div>}
  portalId="filter-date-picker"
/>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex justify-between gap-3 filterbtn">
        <button
          onClick={() => {
            setStartDate(new Date());
            setEndDate(new Date());
          }}
          className="flex-1 border border-[#0d2149] text-[#0d2149] font-semibold py-1 text-sm rounded-full"
        >
          RESET FILTER
        </button>
        <button
          onClick={() => {
            setShowFilter(false);
            fetchSummaryRange(startDate, endDate);
            fetchListFiltered({ from: startDate, to: endDate });
          }}
          className="flex-1 bg-[#0d2149] text-white font-semibold py-1 rounded-full"
        >
          APPLY
        </button>
      </div>
    </div>
  </div>
)}


  </div>
);

}

/* ---------- Sub Components ---------- */
function Badge({ text, color = "gray", bordered = false }) {
  const colors = {
    green: "bg-green-700 text-white",
    orange: "bg-orange-700 text-white",
    gray: "bg-gray-200 text-black",
  };

  return (
    <span
      className={`px-2 py-0.5 font-semibold rounded-full border ${
        colors[color] || colors.gray
      } ${bordered ? "border-black" : "border-transparent"}
      text-[0.65rem] sm:text-xs`}   // 👈 mobile = 0.65rem, tablet/desktop = text-xs
    >
      {text}
    </span>
  );
}




function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <div className="h-2 bg-[#0d2149] transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function SummaryCard({ title, value, color = "text-[#0d2149]" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 border">
      <h4 className="text-xs text-gray-500">{title}</h4>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}
