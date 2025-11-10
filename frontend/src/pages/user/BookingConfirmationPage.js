import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, Calendar, Clock, MapPin, Tag } from "lucide-react"; // Added more icons for visual appeal

import { ShoppingCart } from "lucide-react";
const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);

  const bookingData = location.state?.bookingData;

  // Handle cases where no booking data is available
  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full">
          <p className="text-gray-700 text-xl font-semibold mb-4">
            Oops! No booking details found.
          </p>
          <p className="text-gray-500 mb-6">
            It looks like you landed here without booking information.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Explore Venues
          </button>
        </div>
      </div>
    );
  }

  const { venue, selectedDate, selectedCourt, selectedSlots, totalPrice, sports } = bookingData;
const handleProceedToPay = () => {
  navigate('/user/payment', {
    state: {
      bookingData: {
        venue,
        selectedDate,
        selectedCourt,
        selectedSlots,
        totalPrice,
        sports,
      },
    },
  });
};

  return (
<div className="min-h-screen bg-white mt-20 md:mt-0 md:pt-20 px-4 sm:px-6 lg:px-8 font-sans">


      {/* Header with Venue Name and Back Button */}
     <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 px-4 py-3 sm:px-8 flex items-center justify-between">
  {/* Left: Back Button */}
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-600 hover:bg-orange-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
   
  </button>

  {/* Center: Venue Name */}
  <h1 className="text-lg sm:text-2xl font-extrabold text-gray-800 text-center flex-grow mx-4">
    {venue?.name}
  </h1>

 
</div>

      {/* Slot Details Section */}
      <div className="bg-gray-200 rounded-2xl shadow-xl p-5 sm:p-7 mb-8 border border-gray-100 lg:ms-8 lg:me-8">
        <h3 className="text-sm sm:text-sm font-bold text-gray-800 mb-3 flex items-center gap-3">
          <Calendar size={18} className="text-orange-500" /> Slot Details ({selectedSlots.length})
        </h3>
        <p className="text-md sm:text-lg text-gray-600 mb-5 flex items-center gap-2">
          <Clock size={18} className="text-gray-500" /> {selectedDate}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {selectedSlots.map((slot, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm sm:text-sm text-gray-800">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{selectedCourt.courtName}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Tag size={14} className="text-blue-400" /> {sports} • <span className="font-semibold text-gray-800">₹{slot.price}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Summary Section */}
      <div className="bg-gray-200 rounded-2xl shadow-xl p-5 sm:p-7 mb-8 border border-gray-100 lg:ms-8 lg:me-8">
        <h3 className="text-sm sm:text-sm font-bold text-gray-800 mb-5">
          Booking Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-base text-gray-700">
            <span>Sports</span>
            <span className="font-medium text-gray-900">{sports}</span>
          </div>
          <div className="flex justify-between items-center text-base text-gray-700">
            <span>Total Slot(s) Base Price</span>
            <span className="font-medium text-gray-900">₹{totalPrice}</span>
          </div>
          {/* Example of additional charges, currently commented out but styled for future use */}
          {/*
          <div className="flex justify-between items-center text-sm text-gray-700">
            <span>Convenience Fee</span> <span>+₹30</span>
          </div>
          <div className="flex items-center text-sm text-green-700 gap-2 mt-2">
            <input type="checkbox" checked readOnly className="form-checkbox text-blue-800 rounded" />
            <span>Sports Injury Cover (+₹10)</span>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Play safe by adding Sports Injury Cover (Benefits up to ₹25,000)
          </p>
          */}
        </div>
        <hr className="my-5 border-gray-500" />
        <div className="font-bold text-sm sm:text-sm flex justify-between items-center text-gray-900">
          <span>To Pay Now</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="px-2 mb-28">
        <label className="inline-flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="form-checkbox h-5 w-5 text-orange-800 rounded-md border-gray-300 focus:ring-orange-500 mt-1"
          />
          <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
            I agree to the{" "}
            <button
              onClick={() => setShowRules(true)}
              className="text-orange-800 hover:text-orange-800 underline font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Terms & Conditions
            </button>{" "}
            of GetFitIndia and{" "}
            <span className="font-medium text-gray-900">{venue.name}</span>
          </span>
        </label>
      </div>

      {/* Fixed Bottom Bar for Payment */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-3 sm:p-4 border-t border-gray-200 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-sm sm:text-sm font-bold text-gray-900">
             Final Price : ₹{totalPrice}
            </span>{" "}
            <span className="text-sm sm:text-base font-normal text-gray-600">
              Incl. Taxes
            </span>
          </div>
          <button onClick={handleProceedToPay} className="bg-orange-600 text-white px-8 py-3 text-sm rounded-lg shadow-lg hover:bg-orange-700 transition duration-300 ease-in-out font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75 transform active:scale-95">
            PROCEED TO PAY
          </button>
        </div>
      </div>

      {/* Venue Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-2xl relative animate-fade-in-up">
            <button
              onClick={() => setShowRules(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
              aria-label="Close rules"
            >
              <XCircle size={28} />
            </button>
            <h4 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
              Venue Rules & Guidelines
            </h4>
            <ul className="list-disc pl-5 text-base text-gray-700 space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <li>No Smoking or Drinking allowed at the venue.</li>
              <li>Wear proper sports attire and non-marking shoes while playing.</li>
              <li>Reach the venue at least 10 minutes before your booked slot.</li>
              <li>Respect the facility and follow the venue staff’s instructions.</li>
              <li>Avoid causing damage to any property at the venue.</li>
              <li>Keep the area clean – dispose of bottles and waste properly.</li>
              <li>Management is not responsible for loss of personal belongings or injuries.</li>
              <li>Only booked players are allowed during the reserved time.</li>
              <li>Play responsibly and maintain fair sportsmanship.</li>
              <li>Any cancellation must be done X hours prior to the slot time.</li>
              <li>Refunds for cancellations will be processed within Y business days.</li>
              <li>The venue reserves the right to cancel bookings in unforeseen circumstances.</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowRules(false)}
                className="px-6 py-2 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmationPage;