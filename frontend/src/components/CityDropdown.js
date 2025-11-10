import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

function CityDropdown({ selectedCity, onSelectCity, cities }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (city) => {
    onSelectCity(city);
    setIsOpen(false);
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
      {/* Always show "Select City" on button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-orange-600 bg-white  font-medium shadow-sm hover:bg-gray-50 text-[12px] sm:text-[12px] md:text-[12px] lg:text-sm"
      >
        Select City <FaChevronDown className="ml-2 mt-0.5" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 max-h-72 overflow-y-auto bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            <p className="text-gray-400 text-[10px] sm:text-[10px] md:text-[13px] lg:text-sm font-semibold px-2 pb-2">Choose a City</p>

            {/* All Cities option */}
            <div
              onClick={() => handleSelect("All Cities")}
              className={`px-3 py-2 cursor-pointer rounded hover:bg-gray-100 text-[12px] sm:text-[12px] md:text-[13px] lg:text-sm text-orange-600 font-medium transition-colors ${
                selectedCity === "All Cities" ? "bg-green-50" : ""
              }`}
            >
              All Cities
            </div>

            {/* Dynamic city options */}
            {cities?.filter(Boolean).map((city, index) => (
              <div
                key={index}
                onClick={() => handleSelect(city)}
                className={`px-3 py-2 cursor-pointer rounded hover:bg-gray-100 text-[12px] sm:text-[12px] md:text-[13px] lg:text-sm text-orange-600 font-medium transition-colors ${
                  selectedCity === city ? "bg-green-50" : ""
                }`}
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CityDropdown;
