import React from "react";
import { FaStar, FaFutbol } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FiTool } from "react-icons/fi";
import { MdSports } from "react-icons/md";
import { MdFastfood } from "react-icons/md";
const SportsGardens = ({ garden }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/venue/${garden._id}`);
  };

  const amenities = Array.isArray(garden?.amenities) ? garden.amenities : [];
  const sports = Array.isArray(garden?.sports)
    ? garden.sports
    : Array.from(new Set(garden?.courts?.flatMap((court) => court.sports || []) || []));

  const tagSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
    pauseOnHover: true,
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl p-4 sm:p-6 md:p-4 mb-6 w-full cursor-pointer transition"
      style={{ borderRadius: 10 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-md sm:text-sm md:text-sm lg:text-base font-bold">
          {garden?.sportsGardenName || garden?.name || "Unnamed Venue"}
        </h3>
        <div className="flex items-center text-green-600 text-sm sm:text-base">
          <FaStar className="mr-1" size={14} />
          {typeof garden?.rating === "number" ? garden.rating.toFixed(1) : "4.0"}
          <span className="ml-1 text-gray-500 text-xs sm:text-sm">{garden?.reviews}</span>
        </div>
      </div>

      <p className="text-gray-600 text-xs sm:text-sm mt-1">
        {garden?.location?.address || `${garden?.city}`}
      </p>

      <div className="relative mt-3">
        <img
          src={garden?.image || "https://via.placeholder.com/450x300"}
          alt="garden"
          className="w-full h-[144px] sm:h-[350px] md:h-[136px] lg:h-[200px] object-cover rounded-xl"
        />

        {garden?.discount && (
          <div className="absolute top-2 left-2  text-gray-600 text-xs sm:text-sm mt-1  font-bold px-2 py-1 rounded">
            {garden.discount}
          </div>
        )}

    {(amenities.length > 0 || sports.length > 0) && (
  <div className="w-full max-w-xs mx-auto mt-3">
    <Slider {...tagSliderSettings}>
      {/* Amenities Slide */}
      {amenities.length > 0 && (
        <div className="flex items-center justify-center px-4   text-gray-600 text-xs sm:text-sm mt-1  font-semibold rounded-full text-center">
          <div className="flex items-center gap-2">
          <MdFastfood className="text-orange-600"/>
            <span>
              {amenities.slice(0, 2).join(", ")}
              {amenities.length > 2 && ", ..."}
            </span>
          </div>
        </div>
      )}

      {/* Sports Slide */}
      {sports.length > 0 && (
        <div className="flex items-center justify-center px-4  text-gray-600 text-xs sm:text-sm mt-1  font-semibold rounded-full text-center">
          <div className="flex items-center gap-2">
           <FaFutbol  className="text-green-800"/>
            <span>
              {sports.slice(0, 2).join(", ")}
              {sports.length > 2 && ", ..."}
            </span>
          </div>
        </div>
      )}
    </Slider>
  </div>
)}



      </div>
    </div>
  );
};

export default SportsGardens;
