import { useEffect, useState } from "react";
import { courtOwnerApi } from "../../api/courtOwnerApi";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

export default function CourtOwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      const data = await courtOwnerApi.getBookings();
      setBookings(data.bookings || []);
      setLoading(false);
    };
    loadBookings();
  }, []);

  return (
    <div className="flex">
      {/* <CourtOwnerSidebar /> */}
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Bookings</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <table className="w-full border-collapse bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Venue</th>
                <th className="p-3 border text-left">User</th>
                <th className="p-3 border text-left">Date</th>
                <th className="p-3 border text-left">Time</th>
                <th className="p-3 border text-left">Amount</th>
                <th className="p-3 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="p-3 border">{b.venueId?.name}</td>
                  <td className="p-3 border">{b.userId?.name}</td>
                  <td className="p-3 border">
                    {new Date(b.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">{b.startTime} - {b.endTime}</td>
                  <td className="p-3 border">₹{b.price}</td>
                  <td className="p-3 border">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
