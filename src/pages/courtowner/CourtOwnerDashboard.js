import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaChartBar, FaPlus, FaSearch } from "react-icons/fa";
import { MdOutlineSportsBasketball } from "react-icons/md";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export default function CourtOwnerDashboard() {
  const [profileName, setProfileName] = useState("Owner");
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [selectedDate, setSelectedDate] = useState("");
  const [warn, setWarn] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("courtOwnerToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [pRes, vRes, bRes] = await Promise.all([
          fetch(`${API_BASE}/courtowner/profile`, { headers }),
          fetch(`${API_BASE}/courtowner/venues`, { headers }),
          fetch(`${API_BASE}/courtowner/bookings`, { headers }),
        ]);

        const profile = await pRes.json();
        const venueData = await vRes.json();
        const bookingData = await bRes.json();

        setProfileName(profile?.name || "Owner");
        setVenues(Array.isArray(venueData) ? venueData : []);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setEarnings(
          Array.isArray(bookingData)
            ? bookingData.reduce((sum, b) => sum + (b.price || 0), 0)
            : 0
        );
        setStatus(profile?.status || "Pending");
      } catch (err) {
        console.error(err);
        setWarn("⚠️ Some data failed to load. Please refresh.");
      }
    };
    loadData();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const sampleBookings = Array.isArray(bookings) && bookings.length
    ? bookings
    : [
        { date: today, userName: "Rakesh Ranjan", time: "02:00 PM" },
        { date: today, userName: "Karan Patel", time: "05:00 PM" },
        { date: today, userName: "Rahma", time: "09:00 PM" },
      ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <CourtOwnerSidebar />

      <main className="flex-1 px-6 sm:px-10 py-8 ml-64">
        {/* ---- Header ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Hello, {profileName}!
            </h2>
            <p className="text-gray-500 text-lg mt-1 font-medium">
              My Dashboard
            </p>
          </div>

          <div className="flex items-center mt-4 sm:mt-0 gap-2 border rounded-full px-4 py-2 bg-white shadow-sm w-full sm:w-96">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search for Venue, Sport..."
              className="flex-1 outline-none text-gray-700 text-sm"
            />
          </div>
        </div>

        {warn && (
          <div className="bg-yellow-100 text-yellow-800 p-3 mb-6 rounded-lg text-center text-sm shadow-sm">
            {warn}
          </div>
        )}

        {/* ---- Cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* My Venues */}
          <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#0c295f] text-white p-3 rounded-xl">
                <MdOutlineSportsBasketball size={22} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">My Venues</h3>
            </div>
            <p className="text-gray-500 text-sm">
              Manage and view your sports venues
            </p>
            <p className="mt-3 font-bold text-xl text-[#0c295f]">
              {venues.length}
            </p>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white p-3 rounded-xl">
                  <FaCalendarAlt size={20} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Bookings
                </h3>
              </div>
              <select
                className="text-sm border rounded-md px-2 py-1 text-gray-600"
                defaultValue="Daily"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <input
              type="date"
              value={selectedDate || today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm text-gray-600 w-full"
            />
          </div>

          {/* Reports */}
          <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-500 text-white p-3 rounded-xl">
                <FaChartBar size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">Reports</h3>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Slot Collection <span className="text-gray-400">Received</span>
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ₹ {earnings.toLocaleString()}
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              Occupancy <span className="text-gray-400">(Court 1)</span>
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-[#0c295f] h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>

          {/* Add Venue */}
          <div className="bg-[#0c295f] text-white rounded-2xl shadow-lg p-5 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaPlus size={20} />
              </div>
              <h3 className="font-semibold text-lg">Add Venue</h3>
            </div>
            <button className="bg-white text-[#0c295f] font-semibold rounded-lg py-2 w-full hover:bg-gray-200">
              + Add Venue
            </button>
            <p className="text-sm text-gray-200 mt-3 text-center">
              Manage Slot
            </p>
          </div>
        </div>

        {/* ---- Calendar Style Upcoming Bookings ---- */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Upcoming Bookings
          </h3>

          {Array.isArray(sampleBookings) && sampleBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sampleBookings.map((b, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(b.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <h4 className="text-gray-800 font-semibold text-base">
                        {b.userName}
                      </h4>
                    </div>
                    <div className="bg-[#0c295f] text-white px-3 py-1 rounded-lg text-sm">
                      {b.time}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Venue: {venues[0]?.name || "Court 1"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No bookings available.</p>
          )}
        </section>
      </main>
    </div>
  );
}
