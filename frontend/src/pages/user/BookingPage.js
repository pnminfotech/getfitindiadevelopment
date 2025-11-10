import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, Dribbble, Target, Trophy, Info } from "lucide-react";
import moment from "moment";
import { ShoppingCart } from "lucide-react";

const BookingPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const today = moment().format("YYYY-MM-DD");

  const [venue, setVenue] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  // const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]); // instead of selectedSlot

  const [allSlots, setAllSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  const token = localStorage.getItem("token");

  // Generate date strip for 30 days
  useEffect(() => {
    const today = moment();
    const upcoming = [];
    for (let i = 0; i < 30; i++) {
      upcoming.push(today.clone().add(i, "days"));
    }
    setDates(upcoming);
  }, []);

  // Fetch venue details and set initial selections
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/venues");
        const data = await res.json();
        const found = data.find((v) => v._id === venueId);
        setVenue(found);
        if (found && found.courts.length > 0) {
          setSelectedCourt(found.courts[0]); // Auto-select first court
          if (found.courts[0].sports.length > 0) {
            setSelectedSport(found.courts[0].sports[0]); // Auto-select first sport
          }
        }
        setSelectedDate(moment().format("YYYY-MM-DD")); // Auto-select today's date
      } catch (err) {
        console.error("Failed to fetch venue", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  // Normalize time string for comparison
  const cleanTime = (timeStr) => timeStr?.trim().toLowerCase();

  // Determine if a slot is available (not blocked and not booked)
  const isSlotAvailable = (slot) => {
  const isBlocked = blockedSlots.some(
    (b) =>
      cleanTime(b.startTime) === cleanTime(slot.startTime) &&
      cleanTime(b.endTime) === cleanTime(slot.endTime)
  );

  const isBooked = bookings.some((b) => {
    const bookingDate = new Date(b.date).toISOString().slice(0, 10);
    return (
      bookingDate === selectedDate &&
      cleanTime(b.startTime) === cleanTime(slot.startTime) &&
      cleanTime(b.endTime) === cleanTime(slot.endTime) &&
      ["pending", "paid"].includes(b.status)   // ✅ block both pending & paid
    );
  });

  return !isBlocked && !isBooked;
};


  // Handle court selection change
  const handleCourtChange = (court) => {
    setSelectedCourt(court);
    setSelectedSport(court.sports[0] || ""); // Reset sport for the new court
    setSelectedSlots([]); // Reset selected slot
    setAllSlots([]); // Clear slots
    setBookings([]); // Clear bookings
    setBlockedSlots([]); // Clear blocked slots
    setBookingSuccess(false); // Reset success message
  };

  // Fetch available slots for selected court and date
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedCourt || !selectedDate) return;
      try {
        const res = await fetch(
          `http://localhost:8000/api/slots/${venueId}/${selectedCourt._id}/available?date=${selectedDate}`
        );
        if (!res.ok) throw new Error("Failed to fetch available slots");
        const data = await res.json();
        setAllSlots(data);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setAllSlots([]);
      }
    };
    fetchAvailableSlots();
  }, [selectedCourt?._id, selectedDate, venueId]);

  // Fetch existing bookings for selected court and date
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedCourt || !selectedDate) return;
      try {
        const res = await fetch(
          `http://localhost:8000/api/slots/${venueId}/${selectedCourt._id}/bookings?date=${selectedDate}`
        );
        if (!res.ok) {
          console.error("Booking fetch error status:", res.status);
          return;
        }
        const data = await res.json();
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };
    fetchBookings();
  }, [selectedCourt?._id, selectedDate, venueId]);

  // Fetch blocked slots for selected court and date
  useEffect(() => {
    const fetchBlocked = async () => {
      if (!selectedCourt || !selectedDate) return;
      try {
        const res = await fetch(
          `http://localhost:8000/api/block/${venueId}/${selectedCourt._id}?date=${selectedDate}`
        );
        const data = await res.json();
        setBlockedSlots(data || []);
      } catch (err) {
        console.error("Failed to fetch blocked slots:", err);
      }
    };
    fetchBlocked();
  }, [selectedCourt?._id, selectedDate, venueId]);

  // Handle booking confirmation and navigation
  const handleBookSlot = async () => {
  if (!selectedCourt || selectedSlots.length === 0 || !selectedDate || !selectedSport) {
     alert("Please select a court, sport, date, and time slot to proceed.");
      return;
    }

    // Pass data to confirmation page, actual booking happens there
    navigate("/user/booking-confirmation", {
      state: {
        bookingData: {
          venue,
          selectedDate,
          selectedCourt,
        selectedSlots: selectedSlots,
totalPrice: selectedSlots.reduce((sum, s) => sum + (s.price || 0), 0),

          sports: selectedSport,
        },
      },
    });
    setBookingSuccess(true); // This will only briefly show if navigation is slow
  };
const toggleSlotSelection = (slot) => {
  const exists = selectedSlots.some(
    (s) =>
      s.startTime === slot.startTime &&
      s.endTime === slot.endTime
  );
  if (exists) {
    setSelectedSlots((prev) =>
      prev.filter(
        (s) =>
          !(s.startTime === slot.startTime && s.endTime === slot.endTime)
      )
    );
  } else {
    setSelectedSlots((prev) => [...prev, slot]);
  }
};

  // Loading state UI
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-oran-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading venue details...</p>
      </div>
    );

  // Venue not found UI
  if (!venue)
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full">
          <p className="text-red-600 text-xl font-semibold mb-4">
            <Info size={30} className="inline-block mr-2 text-red-500" /> Venue not found 😔
          </p>
          <p className="text-gray-600 mb-6">
            The venue you are looking for might not exist or is unavailable.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );

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

  {/* Right: Cart Icon */}
  {selectedSlots.length > 0 ? (
    <div
      className="relative cursor-pointer"
      onClick={() => {
        const bookingSection = document.getElementById("booking-summary");
        if (bookingSection)
          bookingSection.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <ShoppingCart size={26} className="text-green-700 hover:text-green-800 transition duration-300" />
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md">
        {selectedSlots.length}
      </span>
    </div>
  ) : (
    <div className="w-[26px] h-[26px]"></div> // Placeholder to maintain spacing
  )}
</div>

      {/* Court Selection Section */}
      <div className="bg-white ">
        <h2 className=" text-sm md:text-md font-bold text-gray-800 mb-5 flex items-center gap-3">
          <Trophy size={20} className="text-green-600" /> Choose Your Arena
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {venue.courts.map((court) => (
            <div
              key={court._id}
              className={`rounded-xl p-3 border-1 cursor-pointer 
                ${
                  selectedCourt?._id === court._id
                    ? "border-orange-600 bg-orange-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-gray-50 hover:border-orange-100 hover:shadow-sm"
                }`}
              onClick={() => handleCourtChange(court)}
            >
              <h3 className="sm:text-sm lg:text:xl font-semibold text-gray-900 mb-2">
                {court.courtName}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Suitable for:{" "}
                <span className="font-medium text-gray-500">
                  {court.sports.join(", ")}
                </span>
              </p>
              {selectedCourt?._id === court._id && (
                <div className="mt-3 pt-0 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                    <Dribbble size={15} className="text-green-500 text-sm" /> Select a Sport:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {court.sports.map((sport) => (
                      <label
                        key={sport}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer
                          ${
                            selectedSport === sport
                              ? " border border-green-600 text-green-600 shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`sport-${court._id}`}
                          value={sport}
                          checked={selectedSport === sport}
                          onChange={() => setSelectedSport(sport)}
                          className="hidden"
                        />
                        <span>{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    {/* Calendar Strip */}
{/* Calendar Strip */}
{selectedCourt && selectedSport && (
  <>
    <div className="border-t border-gray-200 my-6" /> {/* subtle line */}

    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-6 border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">Select a Date</h2>

      {/* Dates Scroll */}
      <div className="flex overflow-x-auto space-x-2 pb-2 custom-scrollbar " style={{fontSize:10}}>
        {dates.map((dateObj, index) => {
          const formattedDate = dateObj.format("YYYY-MM-DD");
          const isToday = formattedDate === today;
          const isSelected = formattedDate === selectedDate;
          const isFirstOfMonth = dateObj.date() === 1;

          const dateBookings = (bookings || []).filter(
            (b) => moment(b.date).format("YYYY-MM-DD") === formattedDate
          );
          const dateBlocked = (blockedSlots || []).filter(
            (b) => moment(b.date).format("YYYY-MM-DD") === formattedDate
          );
          const totalSlots = selectedCourt?.slots?.length || 0;
          const isDateFullyBooked =
            totalSlots > 0 && (dateBookings.length + dateBlocked.length) >= totalSlots;

          return (
            <React.Fragment key={index}>
              {isFirstOfMonth && (
                <div className="flex flex-col items-center justify-center min-w-[50px] text-center text-sm text-green-700 font-bold">
                  <span>{dateObj.format("MMM")}</span>
                  <span>{dateObj.format("YYYY")}</span>
                </div>
              )}

              <button
                onClick={() => {
                  if (isDateFullyBooked) return;
                  setSelectedDate(formattedDate);
                  setSelectedSlots([]);
                  setBookingSuccess(false);
                }}
                className={`flex flex-col items-center justify-center min-w-[40px] sm:min-w-[60px] h-16 sm:h-20 px-2 py-1 
                  ${
                    isDateFullyBooked
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed rounded-lg border"
                      : isSelected
                      ? "bg-green-200 text-gray border-green-600 rounded-lg border"
                      : "bg-white text-gray-800 border-gray-300 hover:border-green-400"
                  }`}
              >
                <span className="text-xs font-medium">
                  {dateObj.format("ddd")}
                </span>
                <span className="text-lg font-semibold">
                  {dateObj.format("D")}
                </span>

                {isDateFullyBooked && (
                  <span className="text-[10px] text-red-400 mt-1">Full</span>
                )}

                {isToday && !isDateFullyBooked && (
                  <span className="text-[10px] text-gray-500 mt-1">Today</span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </>
)}



      {/* Slot Selection Section */}
      {selectedCourt && selectedSport && selectedDate && (
        <div className="bg-white rounded-2xl shadow-xl p-1 sm:p-7 mb-8 border border-orange-100">
          <h2 className="text-sm md:text-md  lg:text-lg text-md  font-bold text-gray-800 mb-5 mt-2 flex items-center gap-3">
            <Clock size={20} className="text-green-600" /> Select Your Time Slot
          </h2>
          {/* Changed grid-cols-2 to grid-cols-1 for small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 pb-32 custom-scrollbar">
  {allSlots
  .filter(isSlotAvailable)
  .filter((slot) => {
    if (selectedDate === today) {
      const now = moment(); // current time
      const slotEnd = moment(slot.endTime, "HH:mm");
      return slotEnd.isAfter(now); // keep only future slots
    }
    return true; // for future dates, keep all slots
  })
  // ✅ Sort slots by start time
  .sort((a, b) => moment(a.startTime, "HH:mm").diff(moment(b.startTime, "HH:mm")))
  .map((slot, index) => {
    const isSelected = selectedSlots.some(
      (s) =>
        s.startTime === slot.startTime &&
        s.endTime === slot.endTime
    );

    return (
      <button
        key={index}
        onClick={() => toggleSlotSelection(slot)}
        className={`w-full rounded-xl border flex items-center justify-between ml-1 p-4 transition-all duration-200 ease-in-out
          ${
            isSelected
              ? "bg-green-50 text-black border-green-700 shadow-md scale-[1.01]"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:shadow-sm"
          }`}
      >
        {/* Left: Time and Price */}
        <div className="flex flex-col items-start">
          <div className="flex flex">
            <div className="font-medium text-sm sm:text-base mx-1">
              {moment(slot.startTime, "HH:mm").format("h:mm A")} -{" "}
              {moment(slot.endTime, "HH:mm").format("h:mm A")}
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700 mx-1">
              ₹{slot.price || 0}
            </div>
          </div>
          <div className="text-[11px] mt-1 text-gray-500">
            {isSelected ? "Selected" : "Available"}
          </div>
        </div>

        {/* Right: + or - Icon */}
        <div
          className={`text-xl font-bold ${
            isSelected
              ? "text-red-600 border border-red-600"
              : "text-green-600 bg-green-100"
          } rounded-full w-5 h-5 flex items-center justify-center`}
        >
          {isSelected ? "-" : "+"}
        </div>
      </button>
    );
  })}


          </div>
        </div>
      )}

      {/* Fixed Bottom Bar for Booking Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 sm:p-6 border-t border-gray-200 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="text-center sm:text-left">
         {selectedSlots.length > 0 ? (
  <p className="text-lg sm:text-xl font-bold text-gray-900">
    Total: ₹{selectedSlots.reduce((sum, s) => sum + (s.price || 0), 0)}{" "}
    <span className="text-sm font-normal text-gray-600">
      ({selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""} selected)
    </span>
  </p>
) : (
  <p className="text-lg sm:text-xl font-bold text-gray-700">
    Select slot(s) to see price
  </p>
)}

          </div>
          <button
            onClick={handleBookSlot}
          disabled={selectedSlots.length === 0}

            className={`w-full sm:w-auto px-8 py-3 rounded-lg shadow-lg font-semibold text-base sm:text-lg transition duration-300 ease-in-out transform active:scale-95
              ${
                selectedSlots
                  ? "bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            PROCEED TO BOOK
          </button>
        </div>
      </div>

      {/* Booking Success Message (optional, consider a toast library for better UX) */}
      {bookingSuccess && (
        <div className="fixed bottom-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl animate-fade-in-up">
          ✅ Booking process initiated!
        </div>
      )}

      {/* Global Scrollbar Style (add this to your main CSS file or index.css) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px; /* For horizontal scrollbars */
          width: 8px; /* For vertical scrollbars */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @keyframes fadeInMoveUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInMoveUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BookingPage;