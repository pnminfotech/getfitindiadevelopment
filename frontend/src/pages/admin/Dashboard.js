import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineSportsBasketball } from "react-icons/md";

/** ---- Config ---- */
const API_BASE = "http://localhost:8000";
const COACH_SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNmPDTOG-F_ExRksptSy5SiUeqXkDnGTSvKXu5eEX9b3LVb_oQdhR-ihBYG4Fm8yrcFfZ_hUJKWZ0q/pub?output=csv";

/** ---- Helpers ---- */
const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload?.users && Array.isArray(payload.users)) return payload.users;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  return [];
};

const safeJSON = async (res) => {
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
};

const fetchWithToken = async (path) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = await safeJSON(res);
  if (!res.ok) throw new Error(body?.error || `${res.status} ${res.statusText}`);
  return body;
};

/** Parse CSV quickly to count non-empty rows (excluding header) */
const countCsvRows = (csvText) => {
  if (!csvText?.trim()) return 0;
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) return 0;
  // ignore header (line 0) and blank lines
  let cnt = 0;
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].trim();
    if (row && row.replace(/,/g, "").trim().length > 0) cnt++;
  }
  return cnt;
};

function Dashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [coachesCount, setCoachesCount] = useState(0);
  const [venuesCount, setVenuesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setWarn("");

      const tasks = {
        users: fetchWithToken("/api/users").then(toArray),
        bookings: fetchWithToken("/api/bookings/all").then(toArray),
        venues: fetch(`${API_BASE}/api/venues`).then(safeJSON).then(toArray),
        coaches: fetch(COACH_SHEET_CSV).then((r) => r.text()).then(countCsvRows),
      };

      const [usersRes, bookingsRes, venuesRes, coachesRes] = await Promise.allSettled([
        tasks.users,
        tasks.bookings,
        tasks.venues,
        tasks.coaches,
      ]);

      const anyFail = [usersRes, bookingsRes, venuesRes, coachesRes].some((r) => r.status === "rejected");
      if (anyFail) setWarn("Some stats failed to load. Showing what we could fetch.");

      setUsersCount(usersRes.status === "fulfilled" ? usersRes.value.length : 0);
      setBookingsCount(bookingsRes.status === "fulfilled" ? bookingsRes.value.length : 0);
      setVenuesCount(venuesRes.status === "fulfilled" ? venuesRes.value.length : 0);
      setCoachesCount(coachesRes.status === "fulfilled" ? Number(coachesRes.value) : 0);

      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { title: "Total Users", icon: <FaUsers className="text-white" size={30} />, value: usersCount },
    { title: "Total Coaches", icon: <FaChalkboardTeacher className="text-white" size={30} />, value: coachesCount },
    { title: "Total Venues", icon: <MdOutlineSportsBasketball className="text-white" size={30} />, value: venuesCount },
    { title: "Total Bookings", icon: <FaCalendarCheck className="text-white" size={30} />, value: bookingsCount },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Dashboard</h2>

      {!!warn && (
        <div className="mb-6 rounded-lg bg-yellow-50 text-yellow-800 px-4 py-3">{warn}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-2xl h-auto sm:h-44 p-4 sm:p-6 flex items-center gap-4 hover:shadow-xl transition duration-300"
          >
            <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl flex justify-center items-center ${loading ? "bg-gray-300 animate-pulse" : "bg-green-500"}`}>
              {card.icon}
            </div>
            <div className="flex flex-col">
              <h4 className="text-base sm:text-lg font-semibold text-gray-700">{card.title}</h4>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {loading ? "—" : card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
