import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import maleImg from "../../assets/man_13385962.png";
import femaleImg from "../../assets/woman_13330662.png";
import otherImg from "../../assets/profile.png";
import { Save, Globe } from "lucide-react";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sportsPreferences, setSportsPreferences] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setName(data.name || "");
        setCity(data.city || "");
        setGender(data.gender || "");
        setMobile(data.mobile || "");
        setDateOfBirth(data.dateOfBirth?.split("T")[0] || "");
        setSportsPreferences(data.sportsPreferences || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      name,
      city,
      gender,
      dateOfBirth: dateOfBirth || null,   // send null if empty
      sportsPreferences,
    };

    // 1) PUT update
    const res = await fetch("http://localhost:8000/api/users/me", {
      method: "PUT",                       // <-- IMPORTANT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`Update failed: ${res.status} ${msg}`);
    }

    // 2) Re-fetch canonical user (handles null/varied update responses)
    const meRes = await fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) throw new Error(`Reload failed: ${meRes.status}`);

    const me = await meRes.json();

    setName(me?.name || "");
    setCity(me?.city || "");
    setGender(me?.gender || "");
    setMobile(me?.mobile || "");
    setDateOfBirth(me?.dateOfBirth?.split("T")[0] || "");
    setSportsPreferences(me?.sportsPreferences || []);

    setShowUpdateMessage(true);
    setTimeout(() => setShowUpdateMessage(false), 3000);
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile. " + (err?.message || ""));
  }
};



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("http://localhost:8000/api/users/me", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         name,
  //         city,
  //         gender,
  //         dateOfBirth,
  //         sportsPreferences,
  //         mobile,
  //       }),
  //     });
  //     if (!res.ok) throw new Error("Update failed");

  //     setShowUpdateMessage(true);
  //     setTimeout(() => setShowUpdateMessage(false), 3000);
  //   } catch (err) {
  //     console.error("Error updating profile:", err);
  //     alert("Failed to update profile.");
  //   }
  // };

  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });

        try {
          await fetch("http://localhost:8000/api/users/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ latitude, longitude }),
          });
          console.log("User location auto-updated");
        } catch (err) {
          console.error("Failed to auto-update location:", err);
        }
      },
      (error) => {
        console.warn("Location access denied or failed:", error.message);
      }
    );
  } else {
    console.warn("Geolocation is not supported by this browser.");
  }
}, [token]);


  const getGenderImage = () => {
    if (gender === "Male") return maleImg;
    if (gender === "Female") return femaleImg;
    return otherImg;
  };

  const toggleSport = (sport) => {
    setSportsPreferences((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const sportOptions = ["Cricket", "Football", "Badminton", "Tennis", "Basketball"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-green-50 font-sans">
      {/* Fixed Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl text-orange-600 hover:text-green-700 transition duration-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <FaBars />
        </button>
        <h1 className="text-xl font-bold text-orange-600">My Profile</h1>
        <div className="w-8" /> {/* placeholder for alignment */}
      </div>

      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Content */}
      <div className="pt-20 px-4 pb-6 max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-200 animate-fade-in-up">
          {/* <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-orange-600 tracking-tight">
            Your Profile
          </h2> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Profile Card */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl shadow-inner border border-orange-200">
              <img
                src={getGenderImage()}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-green-400 shadow-md"
              />
              <p className="mt-4 text-2xl text-gray-800 font-bold capitalize">{name || "User"}</p>
              <p className="text-md text-green-700 mt-1">
                <Globe size={16} className="inline-block mr-1 text-green-500" /> {city || "Not set"}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {gender || "N/A"}
                </span>
              </p>
              {coords && (
                <p className="mt-2 text-xs text-orange-600">
                  📍 Lat: {coords.latitude.toFixed(4)} | Lng: {coords.longitude.toFixed(4)}
                </p>
              )}
              {/* <button
                onClick={updateLocation}
                className="mt-4 text-sm text-green-600 underline hover:text-green-800"
              >
                📍 Update My Location
              </button> */}
            </div>

            {/* Right Form Card */}
            <div className="md:col-span-2 p-6 bg-white rounded-2xl shadow-lg border border-green-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Your City"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={mobile}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sports Preferences</label>
                  <div className="flex flex-wrap gap-3">
                    {sportOptions.map((sport) => (
                      <label
                        key={sport}
                        className={`px-4 py-2 rounded-full cursor-pointer font-medium transition ${
                          sportsPreferences.includes(sport)
                            ? "bg-green-600 text-white"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sportsPreferences.includes(sport)}
                          onChange={() => toggleSport(sport)}
                          className="hidden"
                        />
                        {sport}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition flex items-center justify-center"
                >
                  <Save size={20} className="inline-block mr-2" />
                  Save Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showUpdateMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Profile updated successfully! 🎉
        </div>
      )}
    </div>
  );
};

export default UserProfile;
