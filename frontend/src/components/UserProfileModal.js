import React, { useState, useEffect } from "react";

const UserProfileModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [sportsPreferences, setSportsPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isOpen) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setName(data.name || "");
        setCity(data.city || "");
        setSportsPreferences(data.sportsPreferences || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          city,
          sportsPreferences,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handlePreferencesChange = (e) => {
    const list = e.target.value.split(",").map((item) => item.trim());
    setSportsPreferences(list);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="fixed z-50 top-1/2 left-1/2 w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">User Profile</h2>
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">City</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Sports Preferences</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={sportsPreferences.join(", ")}
                onChange={handlePreferencesChange}
                placeholder="e.g. Cricket, Football, Badminton"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default UserProfileModal;
