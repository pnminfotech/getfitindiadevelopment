import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "../../components/Header";
import SportsGardenCard from "../../components/SportsGardenCard";
import DateButtonWithPicker from "../../components/DateButtonWithPicker";
import Sidebar from "./Sidebar";
import { FaChevronDown, FaFilter, FaTimes } from "react-icons/fa";
import SportsGardens from "../../components/SportsGardens";

/* Time-of-day buckets */
const TIME_BUCKETS = [
  { label: "Morning", from: "05:00", to: "12:00" },
  { label: "Afternoon", from: "12:00", to: "17:00" },
  { label: "Evening", from: "17:00", to: "23:59" },
];

function SportsVenue() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedAmenity, setSelectedAmenity] = useState("All");
  const [selectedTiming, setSelectedTiming] = useState("All");
  const [dateText, setDateText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Track which dropdown/date picker is open
  const [openFilter, setOpenFilter] = useState(null); // "date" | "amenity" | "sport" | "timing" | null
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/venues");
      const data = await res.json();
      setVenues(data);
      setFilteredVenues(data);
    } catch (err) {
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCities = useMemo(
    () => ["All Cities", ...new Set(venues.map((v) => v.city).filter(Boolean))],
    [venues]
  );

  const uniqueSports = useMemo(
    () => ["All", ...new Set(venues.flatMap((v) => v.sports || []))],
    [venues]
  );

  const uniqueAmenities = useMemo(
    () => ["All", ...new Set(venues.flatMap((v) => v.amenities || []))],
    [venues]
  );

  const filterVenues = () => {
    let result = [...venues];

    if (selectedCity !== "All Cities") {
      result = result.filter((v) => v.city === selectedCity);
    }

    if (selectedSport !== "All") {
      result = result.filter((v) => v.sports?.includes(selectedSport));
    }

    if (selectedAmenity !== "All") {
      result = result.filter((v) => v.amenities?.includes(selectedAmenity));
    }

    if (selectedTiming !== "All") {
      const range = TIME_BUCKETS.find((t) => t.label === selectedTiming);
      result = result.filter((v) =>
        v.courts?.some((c) =>
          c.slots?.some(
            (s) => s.startTime >= range.from && s.startTime < range.to
          )
        )
      );
    }

    setFilteredVenues(result);
  };

  useEffect(() => {
    filterVenues();
  }, [selectedCity, selectedSport, selectedAmenity, selectedTiming]);

  // Close open dropdown/date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="relative">
      {/* Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        uniqueCities={uniqueCities.slice(1)}
        onToggleSidebar={() => setShowSidebar(true)}
      />

      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}

      {/* Filters Section */}
      <section
        className="pt-5 lg:pt-10 px-[1px] sm:px-[70px] mx-3"
       
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xs font-bold">
            AVAILABLE VENUES{" "}
            <span className="text-gray-500">({filteredVenues.length})</span>
          </h1>
          <button className="text-gray-400 font-semibold text-sm border-none flex items-center gap-2">
            <FaFilter />
            FILTER
          </button>
        </div>

        <div
          className="flex items-center gap-4 pt-2 lg:pt-6 flex-wrap"
          ref={wrapperRef}
        >
          {/* Date Picker */}
          <DateButtonWithPicker
            className="text-orange-500"
            isOpen={openFilter === "date"}
            setIsOpen={() => setOpenFilter(openFilter === "date" ? null : "date")}
            onOpen={() => setOpenFilter("date")}
            onDateChange={(date) => {
              const formatted = date.toLocaleDateString("default", {
                month: "long",
                weekday: "short",
                day: "numeric",
              });
              setDateText(formatted);
              setOpenFilter(null); // close after selection
            }}
          />
          {dateText && <p className="text-sm text-gray-600">Selected Date: {dateText}</p>}

          <hr className="h-[40px] border-l border-gray-300" />

          {/* Amenities */}
          <Dropdown
            label="Amenities"
            options={uniqueAmenities}
            selected={selectedAmenity}
            onChange={(val) => {
              setSelectedAmenity(val);
              setOpenFilter(null);
            }}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            id="amenity"
          />

          {/* Sports */}
          <Dropdown
            label="Sports"
            options={uniqueSports}
            selected={selectedSport}
            onChange={(val) => {
              setSelectedSport(val);
              setOpenFilter(null);
            }}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            id="sport"
          />

          {/* Timings */}
          <Dropdown
            label="Timings"
            options={["All", ...TIME_BUCKETS.map((t) => t.label)]}
            selected={selectedTiming}
            onChange={(val) => {
              setSelectedTiming(val);
              setOpenFilter(null);
            }}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            id="timing"
          />
        </div>
      </section>

      {/* Venue Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-[13px] sm:px-[100px] py-5">
        {loading ? (
          <p>Loading venues...</p>
        ) : filteredVenues.length === 0 ? (
          <p>No venues found.</p>
        ) : (
          filteredVenues.map((venue, index, arr) => (
  <div key={index} className="w-full">
    <SportsGardens
      garden={{
        ...venue,
        image: `http://localhost:8000/uploads/${venue.image}`,
      }}
    />
    {index !== arr.length - 1 && (
      <div className="h-[1px] bg-gray-300 my-4 w-full col-span-full" />
    )}
  </div>
))

        )}
      </section>
    </main>
  );
}

// Dropdown Component with auto-close behavior
const Dropdown = ({ label, options, selected, onChange, openFilter, setOpenFilter, id }) => {
  const isOpen = openFilter === id;

  return (
    <div className="relative mx-1">
      <button
        onClick={() => setOpenFilter(isOpen ? null : id)}
        className="px-4 py-2 text-blue-800 border border-gray-300 rounded-full flex items-center text-sm font-medium"
      >
        {label}: {selected} <FaChevronDown className="ml-1" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-39 bg-white shadow-lg rounded border max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              className={`px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer ${
                selected === opt ? "font-semibold text-blue-800" : ""
              }`}
              onClick={() => onChange(opt)}
            >
              {opt}
            </div>
          ))}
          {selected !== "All" && (
            <div
              className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer"
              onClick={() => onChange("All")}
            >
              <FaTimes className="inline mr-2" />
              Clear
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SportsVenue;
