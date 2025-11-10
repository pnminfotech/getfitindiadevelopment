import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

const API = "http://localhost:8000/api";

export default function PlayersBookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]); // multiple bookings
  const [player, setPlayer] = useState({});
  const [bill, setBill] = useState(null);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("courtOwnerToken");

  useEffect(() => {
    if (!bookingId || !token) return;
    fetchAllBookingsOfPlayer();
  }, [bookingId]);

  const fetchAllBookingsOfPlayer = async () => {
    try {
      setLoading(true);

      // 1️⃣ First fetch single booking to get playerId and venue info
      const res1 = await fetch(`${API}/courtowner/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data1 = await res1.json();

      const currentBooking = data1.booking;
      const playerData = data1.player || {};
      setPlayer(playerData);
      setVenue(currentBooking?.venueId || null);

      // 2️⃣ Now fetch all bookings for this player in current month
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const res2 = await fetch(
        `${API}/courtowner/reports/list?from=${firstDay.toISOString()}&to=${lastDay.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data2 = await res2.json();

      // filter only bookings of same player
      const playerBookings = (data2.items || []).filter(
        (b) => b.userId?._id === playerData._id
      );

      setBookings(playerBookings);

      // 3️⃣ Calculate combined bill
      const totalSlotsPrice = playerBookings.reduce(
        (sum, b) => sum + (b.price || 0),
        0
      );

      setBill({
        totalSlotsPrice,
        coupon: currentBooking?.bill?.coupon,
        fee: currentBooking?.bill?.fee || 0,
        subtotal: totalSlotsPrice - (currentBooking?.bill?.coupon?.discount || 0),
        total:
          totalSlotsPrice -
          (currentBooking?.bill?.coupon?.discount || 0) +
          (currentBooking?.bill?.fee || 0),
        amountReceived:
          totalSlotsPrice -
          (currentBooking?.bill?.coupon?.discount || 0) +
          (currentBooking?.bill?.fee || 0),
      });
    } catch (err) {
      console.error("Error fetching all bookings for player:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading booking details...
      </div>
    );

  return (
    <div className="flex-1 p-2 md:p-6 lg:ml-64 bg-gray-50 min-h-screen">
     <div className="hidden lg:block" aria-hidden="true">
  <CourtOwnerSidebar />
</div>

      {/* <CourtOwnerSidebar /> */}

      {/* 🔹 Header */}
      <div className="flex  mb-5">
       


         <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#0d2149] hover:bg-text-[#0d2149] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
       <h2 className="text-xl font-semibold text-gray-800">
          Booking Confirmation
        </h2>
      
      </div>

      {/* 🔹 Venue and Status */}
      <div className="bg-white p-2 rounded-xl shadow-sm mb-5">
        <h3 className="text-lg font-semibold text-gray-800">
          {venue?.name || "Venue"}
        </h3>
        <p className="text-sm text-gray-500">{venue?.city || ""}</p>

        <div className="mt-3 bg-green-600 text-white rounded-lg px-4 py-2  inline-flex items-center gap-2 font-medium w-full lg:w-60">
          <span className="text-xl">✔</span>
          <span>
            Confirmed:{" "}
            {bookings[0]?.bookingCode ||
              (bookings[0]?._id?.slice(-8).toUpperCase() ?? "N/A")}
          </span>
        </div>
      </div>

      {/* 🔹 Slot Details */}
      <section className="bg-white rounded-xl p-4 shadow-sm mb-5">
        <h3 className="font-semibold text-gray-800 mb-3">SLOT DETAILS</h3>

        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings for this player.</p>
        ) : (
          bookings.map((b, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg mb-2 p-3 flex justify-between items-center bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {b.courtName} ({b.courtType || "Court"}) •{" "}
                  {new Date(b.date).toDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {b.startTime} - {b.endTime}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                ₹{b.price || 0}
              </p>
            </div>
          ))
        )}
      </section>

      {/* 🔹 Cancel Booking */}
      <div className="text-center mb-5">
        <button className="text-red-600 font-semibold text-sm">
          CANCEL BOOKING
        </button>
      </div>

      {/* 🔹 Player Details */}
      <section className="bg-white rounded-xl p-4 shadow-sm mb-5">
        <h3 className="font-semibold text-gray-800 mb-3">PLAYER DETAILS</h3>
        <p className="text-sm text-gray-700 mb-1">
          <strong>Name:</strong>{" "}
          <span className="text-blue-600 font-medium">
            {player.name || "N/A"}
          </span>
        </p>
        <p className="text-sm text-gray-700 mb-1">
          <strong>Mobile:</strong> {player.mobile || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Email:</strong> {player.email || "N/A"}
        </p>
      </section>

      {/* 🔹 Bill Details */}
      <section className="bg-white rounded-xl p-4 shadow-sm mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">BILL DETAILS</h3>

        <div className="text-sm text-gray-700 space-y-1">
          <div className="flex justify-between">
            <span>Total Slot(s) Price</span>
            <span>₹{bill?.totalSlotsPrice || 0}</span>
          </div>

          {bill?.coupon && (
            <div className="flex justify-between text-gray-500">
              <span>Coupon ({bill.coupon.code})</span>
              <span>-₹{bill.coupon.discount || 0}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-500">
            <span>Convenience Fees</span>
            <span>₹{bill?.fee || 0}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>₹{bill?.subtotal || 0}</span>
          </div>

          <div className="flex justify-between font-bold text-green-700 text-lg">
            <span>Total</span>
            <span>₹{bill?.total || 0}</span>
          </div>

          <div className="flex justify-between text-green-600 font-medium mt-1">
            <span>Amount Received (online)</span>
            <span>₹{bill?.amountReceived || 0}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
