import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageSlots from "./ManageSlots";
import BlockSlotsAdmin from "./BlockSlotsAdmin";

const ManageAndBlockSlots = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [blockedSlots, setBlockedSlots] = useState([]);

  useEffect(() => {
    fetchBlockedSlots();
  }, []);

  const fetchBlockedSlots = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/block/blocked"
        
      );
      setBlockedSlots(res.data);
    } catch (error) {
      console.error("Error fetching blocked slots:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-1 mt-10">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "manage"
              ? "bg-yellow-700 text-white"
              : " bg-cyan-600 text-white"
          }`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Courts & Slots
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "block"
              ? "bg-yellow-700 text-white"
              : "bg-teal-600 text-white"
          }`}
          onClick={() => setActiveTab("block")}
        >
          Block Slots
        </button>
      </div>

      {/* Content Based on Tab */}
      {activeTab === "manage" && (
        <>
          <ManageSlots />
         
        </>
      )}
      {activeTab === "block" && (
        <BlockSlotsAdmin
          blockedSlots={blockedSlots}
          refreshBlockedSlots={fetchBlockedSlots}
        />
      )}
    </div>
  );
};

export default ManageAndBlockSlots;
