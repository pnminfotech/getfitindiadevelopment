// src/api/courtOwnerApi.js

// ✅ Create React App compatible env variable
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getToken = () => localStorage.getItem("courtOwnerToken");

/** Small helper to keep all requests consistent */
async function request(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  // Try to parse JSON; throw nice errors for non-2xx
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = isJson ? data?.message || JSON.stringify(data) : data || res.statusText;
    throw new Error(message || `HTTP ${res.status}`);
  }

  return data;
}

export const courtOwnerApi = {
  register: (data) => request("/courtowner/register", { method: "POST", body: data }),
  login: (data) => request("/courtowner/login", { method: "POST", body: data }),

  getProfile: () => request("/courtowner/profile", { auth: true }),
  getStats: () => request("/courtowner/bookings/stats", { auth: true }),
  getBookings: () => request("/courtowner/bookings", { auth: true }),
  getVenues: () => request("/courtowner/venues", { auth: true }),
};

export default courtOwnerApi;
