// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   CalendarDays,
//   Clock,
//   MapPin,
//   Hourglass,
//   CheckCircle,
//   XCircle,
//   History,
//   Building,
//   Info,
// } from "lucide-react";
// import moment from "moment";

// const MyBookings = () => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("upcoming");
//   const token = localStorage.getItem("token");

//   // 📌 Fetch bookings on mount
//   useEffect(() => {
//     const fetchBookings = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           "http://localhost:8000/api/bookings/mybookings",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const data = await res.json();

//         if (Array.isArray(data)) {
//           const sortedBookings = data.sort((a, b) => {
//             const dateA = new Date(`${a.date?.slice(0, 10)}T${a.startTime}`);
//             const dateB = new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);
//             return dateA - dateB;
//           });
//           setBookings(sortedBookings);
//         } else {
//           setBookings([]);
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         setBookings([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchBookings();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   // 📌 Cancel booking (with refund check)
//   const cancelBooking = async (booking) => {
//     const confirmCancellation = window.confirm(
//       "Are you sure you want to cancel this booking? This action cannot be undone."
//     );
//     if (!confirmCancellation) return;

//     try {
//       const isPaid = booking.status === "paid" && booking.razorpay_payment_id;

//       const res = await fetch(
//         `http://localhost:8000/api/bookings/cancel/${booking._id}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ refund: isPaid }),
//         }
//       );

//       const result = await res.json();
//       if (!res.ok) {
//         throw new Error(
//           result.message || "Failed to cancel booking. Please try again."
//         );
//       }

//       setBookings((prev) =>
//         prev.map((b) =>
//           b._id === booking._id
//             ? {
//                 ...b,
//                 status: "cancelled",
//                 refundStatus: isPaid ? "processed" : undefined,
//               }
//             : b
//         )
//       );

//       alert(
//         isPaid
//           ? "Booking cancelled and refund initiated successfully."
//           : "Booking cancelled successfully."
//       );
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   // 📌 Helpers
//   const now = new Date();
//   const parseDateTime = (b) =>
//     new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);

//   const upcoming = bookings.filter(
//     (b) =>
//       parseDateTime(b) >= now &&
//       (b.status === "booked" || b.status === "paid")
//   );

//   const past = bookings.filter(
//     (b) =>
//       parseDateTime(b) < now ||
//       b.status === "cancelled" ||
//       b.status === "completed"
//   );

//   // 📌 Booking card component
//   const BookingCard = ({ booking }) => {
//     const formattedDate = moment(booking.date).format("MMM Do, YYYY");
//     const formattedTime = `${moment(booking.startTime, "HH:mm").format(
//       "h:mm A"
//     )} - ${moment(booking.endTime, "HH:mm").format("h:mm A")}`;

//     let statusColor = "text-gray-600";
//     let statusIcon = <Hourglass size={16} />;
//     let statusLabel = "Pending";

//     if (booking.status === "booked") {
//       statusColor = "text-yellow-600";
//       statusIcon = <Hourglass size={16} />;
//       statusLabel = "Awaiting Payment";
//     } else if (booking.status === "paid") {
//       statusColor = "text-green-600";
//       statusIcon = <CheckCircle size={16} />;
//       statusLabel = "Paid & Confirmed";
//     } else if (booking.status === "cancelled") {
//       statusColor = "text-red-500";
//       statusIcon = <XCircle size={16} />;
//       statusLabel = "Cancelled";
//     } else if (booking.status === "completed") {
//       statusColor = "text-blue-500";
//       statusIcon = <History size={16} />;
//       statusLabel = "Completed";
//     }

//     return (
//       <div className="bg-white rounded-xl shadow border p-4 flex flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-semibold text-gray-800">
//           <Building size={18} className="text-orange-600" />
//           {booking.venueId?.name || "Unknown Venue"}
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
//           <div className="flex items-center gap-2">
//             <MapPin size={14} className="text-orange-600" />
//             Court: <span className="font-medium">{booking.courtName}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <CalendarDays size={14} className="text-orange-600" />
//             Date: <span className="font-medium">{formattedDate}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Clock size={14} className="text-orange-600" />
//             Time: <span className="font-medium">{formattedTime}</span>
//           </div>
//         </div>
//         <div className={`mt-2 inline-flex items-center gap-2 ${statusColor}`}>
//           {statusIcon}
//           <span className="font-semibold">{statusLabel}</span>
//         </div>

//         {(booking.status === "booked" || booking.status === "paid") &&
//           parseDateTime(booking) > new Date() && (
//             <div className="flex justify-center">
//               <button
//                 onClick={() => cancelBooking(booking)}
//                 className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-700 font-semibold transition-all"
//               >
//                 Cancel Booking
//               </button>
//             </div>
//           )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Back Button */}
//       <div className="px-4 py-2">
//         <button
//           onClick={() => navigate("/user/sportsvenue")}
//           className="flex items-center text-green-600 hover:underline"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           Back
//         </button>
//       </div>

//       <div className="min-h-screen bg-white p-4 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto font-sans">
//         <h1 className="text-lg font-bold text-center mb-6">MY BOOKINGS</h1>

//         {/* Tabs */}
//         <div className="flex justify-between mb-6 border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab("upcoming")}
//             className={`flex-1 py-2 text-center font-semibold text-sm ${
//               activeTab === "upcoming"
//                 ? "text-green-600 border-b-2 border-green-600"
//                 : "text-gray-500"
//             }`}
//           >
//             UPCOMING
//           </button>
//           <button
//             onClick={() => setActiveTab("previous")}
//             className={`flex-1 py-2 text-center font-semibold text-sm ${
//               activeTab === "previous"
//                 ? "text-green-600 border-b-2 border-green-600"
//                 : "text-gray-500"
//             }`}
//           >
//             PREVIOUS
//           </button>
//         </div>

//         {/* Booking List */}
//         {loading ? (
//           <div className="text-center text-gray-500">Loading bookings...</div>
//         ) : (
//           <div className="space-y-4">
//             {activeTab === "upcoming" && upcoming.length === 0 && (
//               <div className="text-center text-gray-500 py-10">
//                 <Info
//                   size={40}
//                   className="mx-auto text-gray-400 mb-4"
//                 />
//                 <p className="font-semibold text-md">
//                   You’ve no upcoming bookings.
//                 </p>
//                 <button
//                   onClick={() => navigate("/user/sportsvenue")}
//                   className="text-green-600 font-medium mt-2 hover:underline"
//                 >
//                   Start Booking Now
//                 </button>
//               </div>
//             )}

//             {activeTab === "upcoming" &&
//               upcoming.map((b) => <BookingCard key={b._id} booking={b} />)}

//             {activeTab === "previous" && past.length === 0 && (
//               <div className="text-center text-gray-500 py-10">
//                 <Info
//                   size={40}
//                   className="mx-auto text-gray-400 mb-4"
//                 />
//                 <p className="font-semibold text-md">
//                   No past or cancelled bookings.
//                 </p>
//               </div>
//             )}

//             {activeTab === "previous" &&
//               past.map((b) => <BookingCard key={b._id} booking={b} />)}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default MyBookings;



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
  Building,
  Info,
} from "lucide-react";
import moment from "moment";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/bookings/mybookings", {
          headers: { Authorization: `Bearer ${token}` },
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

    if (token) fetchBookings();
    else setLoading(false);
  }, [token]);

  const cancelBooking = async (booking) => {
    const confirmCancellation = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone."
    );
    if (!confirmCancellation) return;

    try {
      const isPaid = booking.status === "paid" && booking.razorpay_payment_id;

      const res = await fetch(`http://localhost:8000/api/bookings/cancel/${booking._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refund: isPaid }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to cancel booking");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? { ...b, status: "cancelled", refundStatus: isPaid ? "processed" : undefined }
            : b
        )
      );

      alert(
        isPaid
          ? "Booking cancelled and refund initiated successfully."
          : "Booking cancelled successfully."
      );
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const now = new Date();
  const parseDateTime = (b) => new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);
  const upcoming = bookings.filter(
    (b) => parseDateTime(b) >= now && (b.status === "booked" || b.status === "paid")
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
      statusColor = "text-yellow-600";
      statusIcon = <Hourglass size={16} />;
      statusLabel = "Awaiting Payment";
    } else if (booking.status === "paid") {
      statusColor = "text-green-600";
      statusIcon = <CheckCircle size={16} />;
      statusLabel = "Paid & Confirmed";
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
            <MapPin size={14} className="text-orange-600" />
            Court: <span className="font-medium">{booking.courtName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-orange-600" />
            Date: <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-orange-600" />
            Time: <span className="font-medium">{formattedTime}</span>
          </div>
        </div>
        <div className={`mt-2 inline-flex items-center gap-2 ${statusColor}`}>
          {statusIcon}
          <span className="font-semibold">{statusLabel}</span>
        </div>

        {(booking.status === "booked" || booking.status === "paid") &&
          parseDateTime(booking) > new Date() && (
            <div className="flex justify-center">
              <button
                onClick={() => cancelBooking(booking)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-700 font-semibold transition-all"
              >
                Cancel Booking
              </button>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Fixed Header with Back Button and Tabs */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/user/sportsvenue")}
            className="flex items-center text-green-600 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-lg font-bold text-gray-800">MY BOOKINGS</h1>
          <div className="w-6" /> {/* Placeholder to center title */}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200">
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
      </div>

      {/* Content */}
      <div className="pt-28 px-4 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading bookings...</div>
        ) : (
          <>
            {activeTab === "upcoming" && upcoming.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <Info size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="font-semibold text-md">You’ve no upcoming bookings.</p>
                <button
                  onClick={() => navigate("/user/sportsvenue")}
                  className="text-green-600 font-medium mt-2 hover:underline"
                >
                  Start Booking Now
                </button>
              </div>
            )}
            {activeTab === "upcoming" && upcoming.map((b) => <BookingCard key={b._id} booking={b} />)}

            {activeTab === "previous" && past.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <Info size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="font-semibold text-md">No past or cancelled bookings.</p>
              </div>
            )}
            {activeTab === "previous" && past.map((b) => <BookingCard key={b._id} booking={b} />)}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
