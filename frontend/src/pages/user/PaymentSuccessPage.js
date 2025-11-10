import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, Building, IndianRupee, XCircle } from "lucide-react";
import moment from "moment";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [venueName, setVenueName] = useState("Loading...");
  
  // Get booking data from state
  const bookingData = location.state?.bookingData || [];
  const firstBooking = Array.isArray(bookingData) ? bookingData[0] : bookingData;

  // Hooks must always run
  useEffect(() => {
    if (!firstBooking) return; // early exit inside hook
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [firstBooking]);

  useEffect(() => {
    if (!firstBooking) return;
    if (location.state?.venue?.name) setVenueName(location.state.venue.name);
    else if (firstBooking?.venue?.name) setVenueName(firstBooking.venue.name);
    else setVenueName("Unknown Venue");
  }, [firstBooking, location.state]);

  // Early return for missing booking **after hooks**
  if (!firstBooking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
        <div className="bg-white p-10 rounded-xl shadow text-center max-w-lg w-full border border-gray-200">
          <XCircle size={60} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Details Not Found</h2>
          <p className="text-sm text-gray-600 mb-8">
            It seems there was an issue retrieving your booking information.
          </p>
          <button
            onClick={() => navigate("/user/mybookings")}
            className="inline-flex items-center justify-center px-8 py-4 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-all"
          >
            <Home size={22} className="mr-3" /> Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = location.state?.totalPrice ?? firstBooking?.totalPrice ?? 0;
  const courtName = location.state?.selectedCourt?.courtName || firstBooking?.courtName || "N/A";
  const selectedDate = location.state?.selectedDate || firstBooking?.date;
  const slots = Array.isArray(firstBooking?.selectedSlots) ? firstBooking.selectedSlots : [];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-6 relative">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Card */}
      <div className="relative z-10 bg-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-xl w-full text-center border border-gray-400">
        <CheckCircle size={40} className="text-green-500 mx-auto mb-5" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
          Payment Successful!
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your booking for <strong>{venueName}</strong> has been confirmed.
        </p>

        {/* Booking details */}
        <div className="bg-gray-200 rounded-xl p-5 sm:p-6 mb-6 border border-gray-100 text-left">
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-3 border-gray-300 flex items-center gap-3">
            <Building size={22} className="text-orange-500" /> Booking Details
          </h3>
          <div className="space-y-3 text-gray-700">
            <p className="flex">
              <span className="font-semibold w-28">Venue:</span> <span>{venueName}</span>
            </p>
            <p className="flex">
              <span className="font-semibold w-28">Court:</span> <span>{courtName}</span>
            </p>
            <p className="flex">
              <span className="font-semibold w-28">Date:</span>{" "}
              <span>{selectedDate ? moment(selectedDate).format("dddd, MMMM Do YYYY") : "N/A"}</span>
            </p>
            {/* <p className="flex items-start">
              <span className="font-semibold w-28">Time Slot(s):</span>
              <span className="flex flex-wrap gap-2">
                {slots.length ? (
                  slots.map((slot, idx) => (
                    <span
                      key={idx}
                      className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-2 py-1 rounded-full font-medium"
                    >
                      {moment(slot.startTime, "HH:mm").format("h:mm A")} -{" "}
                      {moment(slot.endTime, "HH:mm").format("h:mm A")}
                    </span>
                  ))
                ) : (
                  "N/A"
                )}
              </span>
            </p> */}
            <p className="flex items-center text-sm font-bold text-gray-900 pt-4 border-t border-gray-200">
              <IndianRupee size={18} className="mr-2 text-green-600" />
              <span className="w-28 flex-shrink-0">Amount Paid:</span>
              <span className="text-green-600">₹{totalPrice}</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/user/mybookings")}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100"
          >
            My Bookings
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          from {
            transform: translateY(-100px) rotateZ(0deg);
            opacity: 0;
          }
          to {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 1;
          }
        }
        .confetti {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: fall 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;
