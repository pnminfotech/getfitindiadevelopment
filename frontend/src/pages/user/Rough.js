import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Hourglass,
  CheckCircle,
  XCircle,
  History,
  Activity,
  Building,
  Info,
} from "lucide-react";
import moment from "moment";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookingType, setBookingType] = useState("venue");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/bookings/mybookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          const sortedBookings = data.sort((a, b) => {
            const dateA = new Date(`${a.date?.slice(0, 10)}T${a.startTime}`);
            const dateB = new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);
            return dateA - dateB;
          });
          setBookings(sortedBookings);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [token]);

const cancelBooking = async (id) => {
  const confirmCancellation = window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
  if (!confirmCancellation) return;

  try {
      const res = await fetch(`http://localhost:8000/api/bookings/cancel/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to cancel booking. Please try again.");

    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
    );
    alert("Booking cancelled successfully.");
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
};


  const now = new Date();
  const parseDateTime = (b) => new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);

  const upcoming = bookings.filter(
    (b) => parseDateTime(b) >= now && b.status === "booked"
  );
  const past = bookings.filter(
    (b) => parseDateTime(b) < now || b.status === "cancelled" || b.status === "completed"
  );

  const BookingCard = ({ booking }) => {
    const formattedDate = moment(booking.date).format("MMM Do, YYYY");
    const formattedTime = `${moment(booking.startTime, "HH:mm").format("h:mm A")} - ${moment(
      booking.endTime,
      "HH:mm"
    ).format("h:mm A")}`;

    let statusColor = "text-gray-600";
    let statusIcon = <Hourglass size={16} />;
    let statusLabel = "Pending";

    if (booking.status === "booked") {
      statusColor = "text-green-600";
      statusIcon = <CheckCircle size={16} />;
      statusLabel = "Confirmed";
    } else if (booking.status === "cancelled") {
      statusColor = "text-red-500";
      statusIcon = <XCircle size={16} />;
      statusLabel = "Cancelled";
    } else if (booking.status === "completed") {
      statusColor = "text-blue-500";
      statusIcon = <History size={16} />;
      statusLabel = "Completed";
    }

    return (
      <div className="bg-white rounded-xl shadow border p-4 flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Building size={18} className="text-orange-600" />
          {booking.venueId?.name || "Unknown Venue"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-orange-600" />
            Court: <span className="font-medium">{booking.courtName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-orange-600" />
            Date: <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-orange-600" />
            Time: <span className="font-medium">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-orange-600" />
            Sport: <span className="font-medium capitalize">{booking.sports}</span>
          </div>
        </div>
        <div className={`mt-2 inline-flex items-center gap-2 ${statusColor}`}>
          {statusIcon}
          <span className="font-semibold">{statusLabel}</span>
        </div>

        {/* Cancel Button */}
        {booking.status === "booked" && (
          <button
            onClick={() => cancelBooking(booking._id)}
            className="mt-3 self-start px-4 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
          >
            Cancel Booking
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto font-sans">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-green-600 mb-4 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-lg font-bold text-center mb-6">MY BOOKINGS</h1>

      {/* Booking Type Switch */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setBookingType("venue")}
          className={`px-4 py-2 rounded-full border font-semibold text-sm transition-all ${
            bookingType === "venue"
              ? "bg-green-100 text-green-700 border-green-500"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          Venue Bookings
        </button>
        <button
          onClick={() => setBookingType("coaching")}
          className={`px-4 py-2 rounded-full border font-semibold text-sm transition-all ${
            bookingType === "coaching"
              ? "bg-green-100 text-green-700 border-green-500"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          Coaching Bookings
        </button>
      </div>

      {/* Tabs (Upcoming / Previous) */}
      <div className="flex justify-between mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 text-center font-semibold text-sm ${
            activeTab === "upcoming"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          UPCOMING
        </button>
        <button
          onClick={() => setActiveTab("previous")}
          className={`flex-1 py-2 text-center font-semibold text-sm ${
            activeTab === "previous"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          PREVIOUS
        </button>
      </div>

      {/* Booking List */}
      {loading ? (
        <div className="text-center text-gray-500">Loading bookings...</div>
      ) : (
        <div className="space-y-4">
          {activeTab === "upcoming" && upcoming.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              <Info size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="font-semibold text-md">You’ve no upcoming bookings.</p>
              <button
                onClick={() => navigate("/venues")}
                className="text-green-600 font-medium mt-2 hover:underline"
              >
                Start Booking Now
              </button>
            </div>
          )}

          {activeTab === "upcoming" &&
            upcoming.map((b) => <BookingCard key={b._id} booking={b} />)}

          {activeTab === "previous" && past.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              <Info size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="font-semibold text-md">No past or cancelled bookings.</p>
            </div>
          )}

          {activeTab === "previous" &&
            past.map((b) => <BookingCard key={b._id} booking={b} />)}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
