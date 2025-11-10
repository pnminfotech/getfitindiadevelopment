import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminbgimage from "../../assets/adminbg.png";
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role !== "admin") {
          alert("Access denied: This is not an admin account.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "admin");

        alert("Admin login successful");
        navigate("/admin/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      alert("Login request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${adminbgimage})` }}
    >
      {/* Overlay for better readability of content over image */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105 mx-auto md:mx-0">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 md:text-4xl">
          Admin Login
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          className="w-full px-5 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-5 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />

        <button
          onClick={handleAdminLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-indigo-700 transition duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;