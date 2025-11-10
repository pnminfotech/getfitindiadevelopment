import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineSportsBasketball } from "react-icons/md";
import { IoBusiness } from "react-icons/io5";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

/** ---- Config ---- */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

/** ---- Helpers ---- */
const safeJSON = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

const fetchWithToken = async (path) => {
  const token = localStorage.getItem("courtOwnerToken");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = await safeJSON(res);
  if (!res.ok)
    throw new Error(body?.error || `${res.status} ${res.statusText}`);
  return body;
};

export default function CourtOwnerDashboard() {
  const [venuesCount, setVenuesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setWarn("");
      try {
        const [venues, bookings, profile] = await Promise.all([
          fetchWithToken("/courtowner/venues"),
          fetchWithToken("/courtowner/bookings"),
          fetchWithToken("/courtowner/profile"),
        ]);
        setVenuesCount(venues?.length || 0);
        setBookingsCount(bookings?.length || 0);
        setEarnings(
          bookings?.reduce((acc, b) => acc + (b.price || 0), 0) || 0
        );
        setStatus(profile?.status || "pending");
      } catch (err) {
        console.error(err);
        setWarn("Some data failed to load. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1100;

  const cards = [
    {
      title: "My Venues",
      icon: <MdOutlineSportsBasketball size={30} color="white" />,
      value: venuesCount,
      color: "linear-gradient(135deg, #2563eb, #1e40af)",
    },
    {
      title: "Total Bookings",
      icon: <FaCalendarCheck size={30} color="white" />,
      value: bookingsCount,
      color: "linear-gradient(135deg, #16a34a, #065f46)",
    },
    {
      title: "Total Earnings (₹)",
      icon: <FaChalkboardTeacher size={30} color="white" />,
      value: earnings,
      color: "linear-gradient(135deg, #eab308, #ca8a04)",
    },
    {
      title: "Account Status",
      icon: <IoBusiness size={30} color="white" />,
      value: status,
      color:
        status === "approved"
          ? "linear-gradient(135deg, #059669, #064e3b)"
          : status === "pending"
          ? "linear-gradient(135deg, #f97316, #b45309)"
          : "linear-gradient(135deg, #dc2626, #7f1d1d)",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        background: "#f5f6fa",
        minHeight: "100vh",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <CourtOwnerSidebar />

      <div
        style={{
          flex: 1,
          padding: isMobile ? "20px" : isTablet ? "30px" : "50px",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "22px" : "28px",
            fontWeight: "700",
            marginBottom: "30px",
            color: "#0c295f",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Dashboard
        </h2>

        {warn && (
          <div
            style={{
              marginBottom: "20px",
              background: "#fff8e1",
              color: "#92400e",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              textAlign: "center",
            }}
          >
            {warn}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(4, 1fr)",
            gap: "25px",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "18px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                padding: isMobile ? "20px" : "25px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                gap: "18px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                textAlign: isMobile ? "center" : "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0px)")
              }
            >
              <div
                style={{
                  background: card.color,
                  height: isMobile ? "60px" : "70px",
                  width: isMobile ? "60px" : "70px",
                  borderRadius: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                {card.icon}
              </div>

              <div>
                <h4
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: "5px",
                  }}
                >
                  {card.title}
                </h4>
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "700",
                    color: "#111",
                  }}
                >
                  {loading ? "—" : card.value}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
