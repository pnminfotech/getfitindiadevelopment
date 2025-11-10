import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

const API_BASE = "http://localhost:8000/api";

function AddVenue() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
const [isSubmitting, setIsSubmitting] = useState(false);
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
setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", venue.name);
    formData.append("city", venue.city);
    // formData.append("location[address]", venue.location.address);
    // formData.append("location[lat]", venue.location.lat);
    // formData.append("location[lng]", venue.location.lng);
    formData.append("location[address]", venue.location.address || "");
formData.append("location[lat]", venue.location.lat || "");
formData.append("location[lng]", venue.location.lng || "");

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
const res = await fetch(`${API_BASE}/courtowner/venues/owner`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

  // const res = await fetch(`${API_BASE}/venues/owner`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

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
     setIsSubmitting(false);
  };

  return (
    <div className="flex">
      <CourtOwnerSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen p-8">
        <h2 className="font-bold text-3xl mb-8 text-center sm:text-left">
          Add New Venue
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Name */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">Venue Name:</label>
              <input
                type="text"
                placeholder="Venue Name"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
                value={venue.name}
                onChange={(e) => setVenue({ ...venue, name: e.target.value })}
              />
            </div>

            {/* City */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">City:</label>
              <input
                type="text"
                placeholder="City"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
                value={venue.city}
                onChange={(e) => setVenue({ ...venue, city: e.target.value })}
              />
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-3xl flex flex-col gap-2 font-medium text-lg sm:text-xl col-span-2">
              <label>Address:</label>
              <textarea
                placeholder="Full address..."
                className="pl-2 py-2 h-24 w-full bg-gray-200 rounded-lg resize-none"
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
            <div className="bg-white p-6 rounded-3xl flex flex-col gap-2 font-medium text-lg sm:text-xl col-span-2">
              <label>Description:</label>
              <textarea
                placeholder="Enter venue description..."
                className="pl-2 py-2 h-28 w-full bg-gray-200 rounded-lg resize-none"
                value={venue.description}
                onChange={(e) =>
                  setVenue({ ...venue, description: e.target.value })
                }
              />
            </div>

            {/* Latitude */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">Latitude:</label>
              <input
                type="number"
                placeholder="Latitude"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
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
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">Longitude:</label>
              <input
                type="number"
                placeholder="Longitude"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
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
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">Pricing (₹/hour):</label>
              <input
                type="number"
                placeholder="e.g. 800"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
                value={venue.pricing}
                onChange={(e) =>
                  setVenue({ ...venue, pricing: e.target.value })
                }
              />
            </div>

            {/* Sports */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">Sports:</label>
              <input
                type="text"
                placeholder="e.g. Football, Badminton"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
                value={venue.sports}
                onChange={(e) =>
                  setVenue({ ...venue, sports: e.target.value })
                }
              />
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">Amenities:</label>
              <input
                type="text"
                placeholder="e.g. Parking, Changing Room"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
                value={venue.amenities}
                onChange={(e) =>
                  setVenue({ ...venue, amenities: e.target.value })
                }
              />
            </div>

            {/* Image */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 font-medium text-lg sm:text-xl">
              <label className="sm:w-40">Upload Image:</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                ref={fileInputRef}
                className="pl-2 w-full bg-gray-200 rounded-lg"
                onChange={(e) =>
                  setVenue({ ...venue, image: e.target.files[0] })
                }
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center sm:justify-start">
            {/* <button className="mt-8 h-12 w-40 sm:h-14 sm:w-64 bg-cyan-700 hover:text-black hover:bg-cyan-300 transition text-white rounded-full font-bold text-lg sm:text-xl">
              Add Venue
            </button> */}
            <button
  type="submit"
  disabled={isSubmitting}
  className={`mt-8 h-12 w-40 sm:h-14 sm:w-64 rounded-full font-bold text-lg sm:text-xl ${
    isSubmitting
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-cyan-700 hover:text-black hover:bg-cyan-300 text-white transition"
  }`}
>
  {isSubmitting ? "Saving..." : "Add Venue"}
</button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVenue;
