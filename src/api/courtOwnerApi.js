// // src/api/courtOwnerApi.js
// // ✅ Create React App compatible env variable
// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";


// const getToken = () => localStorage.getItem("courtOwnerToken");

// export const courtOwnerApi = {
//   register: async (data) => {
//     const res = await fetch(`${API_BASE}/courtowner/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     return res.json();
//   },

//   login: async (data) => {
//     const res = await fetch(`${API_BASE}/courtowner/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     return res.json();
//   },

//   getProfile: async () => {
//     const res = await fetch(`${API_BASE}/courtowner/profile`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     return res.json();
//   },

//   getStats: async () => {
//     const res = await fetch(`${API_BASE}/courtowner/bookings/stats`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     return res.json();
//   },

//   getBookings: async () => {
//     const res = await fetch(`${API_BASE}/courtowner/bookings`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     return res.json();
//   },

//   getVenues: async () => {
//     const res = await fetch(`${API_BASE}/courtowner/venues`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     return res.json();
//   },
// };


// src/api/courtOwnerApi.js

// ✅ Base API URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getToken = () => localStorage.getItem("courtOwnerToken");

export const courtOwnerApi = {
  // ---------- AUTH ----------
  register: async (data) => {
    const res = await fetch(`${API_BASE}/courtowner/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${API_BASE}/courtowner/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ---------- PROFILE ----------
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/courtowner/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ---------- DASHBOARD STATS ----------
  getStats: async () => {
    const res = await fetch(`${API_BASE}/courtowner/bookings/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ---------- BOOKINGS ----------
  getBookings: async () => {
    const res = await fetch(`${API_BASE}/courtowner/bookings`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ---------- VENUES ----------
  getVenues: async () => {
    const res = await fetch(`${API_BASE}/courtowner/venues`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ---------- COURTS (for a Venue) ----------
  getAllCourts: async (venueId) => {
    const res = await fetch(`${API_BASE}/slots/${venueId}/courts`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch courts");
    return res.json();
  },

  // ---------- BOOKINGS (for a specific Court) ----------
  getCourtBookings: async (venueId, courtId) => {
    const res = await fetch(`${API_BASE}/slots/${venueId}/${courtId}/bookings`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  // ---------- ✅ NEW: BLOCK SLOT ----------
  blockSlots: async (data) => {
    const res = await fetch(`${API_BASE}/courtowner/block-slot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to block slot");
    return res.json();
  },
};
