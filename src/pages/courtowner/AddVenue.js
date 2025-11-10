import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

const API_BASE = "http://localhost:8000/api";

function AddVenue() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [venue, setVenue] = useState({
    name: "",
    city: "",
    location: { address: "", lat: "", lng: "" },
    description: "",
    pricing: "",
    image: null,
    sports: "",
    amenities: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", venue.name);
    formData.append("city", venue.city);
    formData.append("location[address]", venue.location.address);
    formData.append("location[lat]", venue.location.lat);
    formData.append("location[lng]", venue.location.lng);
    formData.append("pricing", venue.pricing);
    formData.append("description", venue.description);
    formData.append("image", venue.image);
    formData.append("sports", venue.sports);
    formData.append("amenities", venue.amenities);

    try {
      const token = localStorage.getItem("courtOwnerToken");
      if (!token) {
        alert("You must be logged in as a court owner!");
        return;
      }

      const res = await fetch(`${API_BASE}/venues/owner`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("✅ Venue Added Successfully!");
        setVenue({
          name: "",
          city: "",
          location: { address: "", lat: "", lng: "" },
          description: "",
          pricing: "",
          image: null,
          sports: "",
          amenities: "",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        navigate("/courtowner/venues");
      } else {
        const err = await res.json();
        alert(`❌ Failed to add venue: ${err.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CourtOwnerSidebar />

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-8 py-8">
        <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-center sm:text-left text-[#0C295F]">
          Add New Venue
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Grid Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Name */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">Venue Name:</label>
              <input
                type="text"
                placeholder="Venue Name"
                className="pl-3 h-11 bg-gray-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.name}
                onChange={(e) => setVenue({ ...venue, name: e.target.value })}
              />
            </div>

            {/* City */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">City:</label>
              <input
                type="text"
                placeholder="City"
                className="pl-3 h-11 bg-gray-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.city}
                onChange={(e) => setVenue({ ...venue, city: e.target.value })}
              />
            </div>

            {/* Address */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col gap-2 shadow-sm col-span-full">
              <label className="font-medium text-gray-800">Address:</label>
              <textarea
                placeholder="Full address..."
                className="pl-3 py-2 h-24 bg-gray-100 w-full rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.location.address}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    location: { ...venue.location, address: e.target.value },
                  })
                }
              />
            </div>

            {/* Description */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col gap-2 shadow-sm col-span-full">
              <label className="font-medium text-gray-800">Description:</label>
              <textarea
                placeholder="Enter venue description..."
                className="pl-3 py-2 h-28 bg-gray-100 w-full rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.description}
                onChange={(e) => setVenue({ ...venue, description: e.target.value })}
              />
            </div>

            {/* Latitude */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">Latitude:</label>
              <input
                type="number"
                placeholder="Latitude"
                className="pl-3 h-11 bg-gray-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.location.lat}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    location: { ...venue.location, lat: e.target.value },
                  })
                }
              />
            </div>

            {/* Longitude */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">Longitude:</label>
              <input
                type="number"
                placeholder="Longitude"
                className="pl-3 h-11 bg-gray-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.location.lng}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    location: { ...venue.location, lng: e.target.value },
                  })
                }
              />
            </div>

            {/* Pricing */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">Pricing (₹/hour):</label>
              <input
                type="number"
                placeholder="e.g. 800"
                className="pl-3 h-11 bg-gray-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.pricing}
                onChange={(e) => setVenue({ ...venue, pricing: e.target.value })}
              />
            </div>

            {/* Sports */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">Sports:</label>
              <input
                type="text"
                placeholder="e.g. Football, Badminton"
                className="pl-3 h-11 bg-gray-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.sports}
                onChange={(e) => setVenue({ ...venue, sports: e.target.value })}
              />
            </div>

            {/* Amenities */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">Amenities:</label>
              <input
                type="text"
                placeholder="e.g. Parking, Changing Room"
                className="pl-3 h-11 bg-gray-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={venue.amenities}
                onChange={(e) => setVenue({ ...venue, amenities: e.target.value })}
              />
            </div>

            {/* Image */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              <label className="sm:w-40 font-medium text-gray-800">Upload Image:</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                ref={fileInputRef}
                className="pl-2 w-full bg-gray-100 rounded-md focus:outline-none file:py-2 file:px-3 file:rounded-md file:bg-[#0C295F] file:text-white file:border-0 file:cursor-pointer hover:file:bg-[#1E3A8A]"
                onChange={(e) =>
                  setVenue({ ...venue, image: e.target.files[0] })
                }
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center sm:justify-start">
            <button
              type="submit"
              className="mt-8 h-12 w-40 sm:h-14 sm:w-56 bg-[#0C295F] hover:bg-[#1E3A8A] transition text-white rounded-full font-semibold text-lg sm:text-xl shadow-md"
            >
              Add Venue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVenue;
