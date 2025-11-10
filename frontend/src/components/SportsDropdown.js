import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const sportsList = [
  "Cricket Nets", "Table Tennis", "Tennis", "Basketball", "Cricket",
  "Billiards", "Bouldering", "Bowling Machine", "Skating", "Snooker",
  "Tennis Wall", "Carrom", "Chess", "Futsal", "Hockey", "Padel",
  "Swimming", "Trampoline Park", "Volleyball",
];

function SportsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport)
        ? prev.filter((item) => item !== sport)
        : [...prev, sport]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-orange-500 bg-white text-sm font-medium shadow-sm hover:bg-gray-50"
      >
        Sports <FaChevronDown className="ml-2 mt-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-60 max-h-80 overflow-y-auto bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            <p className="text-gray-400 text-sm font-semibold px-2 pb-2">Sports</p>
            {sportsList.map((sport, index) => (
              <label
                key={index}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded hover:bg-gray-100 transition-colors ${
                  selectedSports.includes(sport) ? "bg-green-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport)}
                  onChange={() => handleSelect(sport)}
                  className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <span className="text-sm text-orange-500 font-medium">{sport}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SportsDropdown;
