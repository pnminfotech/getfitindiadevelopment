import React, { useEffect, useState } from "react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/bookings/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching all bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);
const formatTime = (time24) => {
  if (!time24) return "N/A";
  const [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

  return (
    <div className="px-4 py-6 overflow-x-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">📋 All Bookings (Admin View)</h2>

      {loading ? (
        <p className="text-gray-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-red-500">No bookings found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">User</th>
               <th className="px-4 py-3 border-b">Mobile</th>
              <th className="px-4 py-3 border-b">Venue</th>
              <th className="px-4 py-3 border-b">Court</th>
              <th className="px-4 py-3 border-b">Date</th>
              <th className="px-4 py-3 border-b">Time</th>
              <th className="px-4 py-3 border-b">Status</th>
              <th className="px-4 py-3 border-b">City</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{idx + 1}</td>
                   <td className="px-4 py-3 border-b">{booking.userId?.name  || "N/A"}</td>
                <td className="px-4 py-3 border-b">{booking.userId?.mobile  || "N/A"}</td>
                <td className="px-4 py-3 border-b">{booking.venueId?.name || "N/A"}</td>
                <td className="px-4 py-3 border-b">{booking.courtName || "Court"}</td>
                <td className="px-4 py-3 border-b">{booking.date?.split("T")[0]}</td>
             <td className="px-4 py-3 border-b">
  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
</td>

                {/* <td className="px-4 py-3 border-b">{booking.startTime} - {booking.endTime}</td> */}
                <td className="px-4 py-3 border-b capitalize">{booking.status}</td>
                <td className="px-4 py-3 border-b">{booking.userId?.city || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllBookings;
