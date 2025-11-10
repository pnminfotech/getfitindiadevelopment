import React, { useEffect, useState } from "react";
import axios from "axios";

const BlockedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Fetch Locked Users
  const fetchLockedUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/auth/locked-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching locked users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Unlock User
  const handleUnlock = async (userId) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/auth/unlock-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      fetchLockedUsers(); // refresh list
    } catch (err) {
      console.error("Error unlocking user:", err);
      setMessage("Failed to unlock user");
    }
  };

  useEffect(() => {
    fetchLockedUsers();
  }, []);

  return (
    <div className="px-4 py-6 overflow-x-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">🚫 Blocked Users (Admin View)</h2>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      {loading ? (
        <p className="text-gray-500">Loading blocked users...</p>
      ) : users.length === 0 ? (
        <p className="text-red-500">No blocked users 🎉</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Mobile</th>
              <th className="px-4 py-3 border-b">Locked Until</th>
              <th className="px-4 py-3 border-b">Last Reason</th>
              <th className="px-4 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => {
              const lastHistory =
                user.lockHistory.length > 0
                  ? user.lockHistory[user.lockHistory.length - 1].reason
                  : "N/A";

              return (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{idx + 1}</td>
                  <td className="px-4 py-3 border-b">{user.name || "N/A"}</td>
                  <td className="px-4 py-3 border-b">{user.mobile}</td>
                  <td className="px-4 py-3 border-b">
                    {user.lockUntil ? new Date(user.lockUntil).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 border-b">{lastHistory}</td>
                  <td className="px-4 py-3 border-b">
                    <button
                      onClick={() => handleUnlock(user._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Unlock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BlockedUsers;
