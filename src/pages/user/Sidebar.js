import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaHome, FaPlus, FaClipboardList, FaTimes } from "react-icons/fa";
import profileimg from "../../assets/profile.png";

const Sidebar = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    onClose();
    navigate("/user/login");
  };

  const menuItemClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-orange-50 text-gray-700";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-[1001]"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-[1002] overflow-y-auto rounded-tr-3xl rounded-br-3xl">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 px-4 border-b border-gray-200 bg-gradient-to-b from-orange-50 to-white relative rounded-tr-3xl">
          <img
            src={profileimg}
            alt="profile"
            className="w-16 h-16 rounded-full mb-2 border-2 border-orange-400 shadow"
          />
          {user ? (
            <p className="text-sm font-semibold">{user.name}</p>
          ) : (
            <p className="text-sm text-gray-500">Not logged in</p>
          )}
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-orange-500 absolute top-3 right-3"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu List */}
        <ul className="p-4 space-y-2">
          <li
            className={menuItemClass}
            onClick={() => {
              onClose();
              navigate("/user/homepage");
            }}
          >
            <FaHome className="text-orange-500" /> Homepage
          </li>

          <li
            className={menuItemClass}
            onClick={() => {
              onClose();
              navigate("/user/profile");
            }}
          >
            <FaUser className="text-orange-500" /> Profile
          </li>

          <li
            className={menuItemClass}
            onClick={() => {
              onClose();
              navigate("/user/sportsvenue");
            }}
          >
            <FaPlus className="text-orange-500" /> Venues
          </li>

          <li
            className={menuItemClass}
            onClick={() => {
              onClose();
              navigate("/user/mybookings");
            }}
          >
            <FaClipboardList className="text-orange-500" /> My Bookings
          </li>

          {!user && (
            <li
              className="flex items-center gap-3 px-4 py-3 bg-orange-100 text-orange-600 rounded-lg shadow cursor-pointer hover:bg-orange-200 transition"
              onClick={() => {
                onClose();
                navigate("/user/login");
              }}
            >
              <FaUser /> Log In
            </li>
          )}
        </ul>

        {/* Logout Button */}
        {user && (
          <div className="px-4 py-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
            >
              <FaTimes /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
