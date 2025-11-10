// components/SportsGardenCard.js
import React from "react";
import { FaStar, FaFutbol } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const SportsGardenCard = ({ garden }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/venue/${garden._id}`);
  };

  const extractedSports = garden.sports?.length
    ? garden.sports
    : Array.from(new Set(garden?.courts?.flatMap((court) => court.sports || []) || []));

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-xl mb-6 w-full cursor-pointer hover:shadow-2xl transition"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg sm:text-sm md:text-xl font-bold">
          {garden?.sportsGardenName || garden?.name || "Unnamed Venue"}
        </h3>
        <div className="flex items-center text-green-600 text-sm sm:text-base">
          <FaStar className="mr-1" size={14} />
          {typeof garden?.rating === "number" ? garden.rating.toFixed(1) : "4.0"}
          <span className="ml-1 text-gray-500 text-xs sm:text-sm">
            ({garden?.reviews || 0})
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm sm:text-base mt-1">
        {garden?.location?.address || `${garden?.city || ""}, ${garden?.address || ""}`}
      </p>

      <div className="relative mt-3">
        <img
          src={garden?.image || "https://via.placeholder.com/450x300"}
          alt="garden"
          className="w-full h-[250px] sm:h-[350px] md:h-[136px] object-cover rounded-xl"
        />
        {/* <img
  src={garden?.image ? `http://localhost:8000/uploads/${garden.image}` : "https://via.placeholder.com/450x300"}
  alt={garden?.name}
  style={{ height: "100%", width: "100%", borderRadius: "12px", objectFit: "cover" }}
/> */}

        {garden?.discount && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded">
            {garden.discount}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-sm sm:text-base text-gray-800">
        {(extractedSports || []).map((sport, index) => (
          <span key={index} className="flex items-center gap-1 capitalize">
            {sport.toLowerCase().includes("cricket") && <GiCricketBat />}
            {sport.toLowerCase().includes("football") && <FaFutbol />}
            {sport}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SportsGardenCard;
