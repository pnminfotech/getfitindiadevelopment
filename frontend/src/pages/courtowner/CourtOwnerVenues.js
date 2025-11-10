import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";
import Pagination from "../../components/Pagination";

const CourtOwnerVenues = () => {
  const [venues, setVenues] = useState([]);
  const [openSportsVenueId, setOpenSportsVenueId] = useState(null);
  const [openAmenitiesVenueId, setOpenAmenitiesVenueId] = useState(null);
  const [editingVenue, setEditingVenue] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    city: "",
    location: { address: "", lat: "", lng: "" },
    pricing: "",
    image: null,
    sports: "",
    amenities: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 8;

  // Pagination logic
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = venues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(venues.length / venuesPerPage);

  // 🔹 Fetch owner's venues
  const fetchVenues = async () => {
    try {
      const token = localStorage.getItem("courtOwnerToken");
      const res = await fetch("http://localhost:8000/api/courtowner/venues", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch venues");
      const data = await res.json();
      setVenues(data);
    } catch (err) {
      console.error("Error loading venues:", err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // 🔹 Open edit modal with venue data
  const handleUpdate = (ven) => {
    setEditingVenue(ven);
    setEditForm({
      name: ven.name,
      city: ven.city,
      location: {
        address: ven.location?.address || "",
        lat: ven.location?.lat || "",
        lng: ven.location?.lng || "",
      },
      pricing: ven.pricing,
      image: null,
      sports: Array.isArray(ven.sports) ? ven.sports.join(", ") : ven.sports,
      amenities: Array.isArray(ven.amenities)
        ? ven.amenities.join(", ")
        : ven.amenities,
    });
  };

  // 🔹 Submit Update
  const submitUpdate = async () => {
    const fd = new FormData();
    fd.append("name", editForm.name);
    fd.append("city", editForm.city);
    fd.append("pricing", editForm.pricing);
    fd.append("location[address]", editForm.location.address);
    fd.append("location[lat]", editForm.location.lat);
    fd.append("location[lng]", editForm.location.lng);
    fd.append("sports", editForm.sports);
    fd.append("amenities", editForm.amenities);
    if (editForm.image) fd.append("image", editForm.image);

    try {
      const token = localStorage.getItem("courtOwnerToken");
      const res = await fetch(
        `http://localhost:8000/api/courtowner/venues/${editingVenue._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (res.ok) {
        alert("✅ Venue updated successfully!");
        setEditingVenue(null);
        fetchVenues();
      } else {
        const errData = await res.json();
        console.error("Update error:", errData);
        alert("❌ Failed to update venue");
      }
    } catch (err) {
      console.error("Submit update error:", err);
      alert("Something went wrong during update.");
    }
  };

  // 🔹 Delete Venue
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      const token = localStorage.getItem("courtOwnerToken");
      const res = await fetch(
        `http://localhost:8000/api/courtowner/venues/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("✅ Venue deleted successfully!");
        setVenues((prev) => prev.filter((v) => v._id !== id));
      } else {
        alert("❌ Failed to delete venue.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting venue.");
    }
  };

  return (
    <div className="flex">
      <CourtOwnerSidebar />
      <div className="flex-1 p-6 sm:p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl sm:text-3xl font-bold my-6 sm:my-8">
          My Venues
        </h2>

        {/* Venue Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {currentVenues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col"
            >
            <img
  src={`http://localhost:8000/uploads/${venue.image}?t=${Date.now()}`}
  alt={venue.name}
  className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-t-2xl"
/>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">{venue.name}</h3>
                  <p className="text-sm mb-2">
                    {venue.city},{" "}
                    {venue.location?.address || "Address not available"}
                  </p>
                  <h4 className="text-base mb-2 font-semibold">
                    Price: <span className="font-normal">{venue.pricing}</span>
                  </h4>

                  {/* Sports Dropdown */}
                  <div className="mb-2">
                    <button
                      className="text-md border border-gray-600 p-2 rounded-lg"
                      onClick={() =>
                        setOpenSportsVenueId(
                          openSportsVenueId === venue._id ? null : venue._id
                        )
                      }
                    >
                      {openSportsVenueId === venue._id
                        ? "Hide Sports"
                        : "View Sports"}
                    </button>

                    {openSportsVenueId === venue._id && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                        {Array.isArray(venue.sports) &&
                        venue.sports.length > 0 ? (
                          venue.sports.map((sport, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-300 px-3 py-1 rounded-full"
                            >
                              {sport}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">
                            No sports listed
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Amenities Dropdown */}
                  <div className="mb-2">
                    <button
                      className="text-md border border-gray-600 p-2 rounded-lg"
                      onClick={() =>
                        setOpenAmenitiesVenueId(
                          openAmenitiesVenueId === venue._id
                            ? null
                            : venue._id
                        )
                      }
                    >
                      {openAmenitiesVenueId === venue._id
                        ? "Hide Amenities"
                        : "View Amenities"}
                    </button>

                    {openAmenitiesVenueId === venue._id && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                        {Array.isArray(venue.amenities) &&
                        venue.amenities.length > 0 ? (
                          venue.amenities.map((item, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-300 px-3 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">
                            No amenities listed
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleUpdate(venue)}
                    className="border border-gray-500 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(venue._id)}
                    className="border border-gray-500 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={venues.length}
          itemsPerPage={venuesPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* 🔹 Edit Modal */}
      {editingVenue && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Update Venue
            </h1>

            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div>
                <label className="font-semibold block mb-1">Venue Name:</label>
                <input
                  type="text"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>

              {/* City */}
              <div>
                <label className="font-semibold block mb-1">City:</label>
                <input
                  type="text"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </div>

              {/* Address */}
              <div>
                <label className="font-semibold block mb-1">Address:</label>
                <input
                  type="text"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.location.address}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      location: {
                        ...editForm.location,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* Latitude / Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Latitude:</label>
                  <input
                    type="number"
                    className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                    value={editForm.location.lat}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        location: {
                          ...editForm.location,
                          lat: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Longitude:</label>
                  <input
                    type="number"
                    className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                    value={editForm.location.lng}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        location: {
                          ...editForm.location,
                          lng: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Sports / Amenities / Price */}
              <div>
                <label className="font-semibold block mb-1">Sports:</label>
                <input
                  type="text"
                  placeholder="e.g. Football, Cricket"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.sports}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sports: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Amenities:</label>
                <input
                  type="text"
                  placeholder="e.g. Parking, Washroom"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.amenities}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amenities: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Pricing (₹/hour):
                </label>
                <input
                  type="number"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.pricing}
                  onChange={(e) =>
                    setEditForm({ ...editForm, pricing: e.target.value })
                  }
                />
              </div>

              {/* Upload Image */}
              <div>
                <label className="font-semibold block mb-1">Upload Image:</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.files[0] })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end items-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setEditingVenue(null);
                    setEditForm({
                      name: "",
                      city: "",
                      location: { address: "", lat: "", lng: "" },
                      pricing: "",
                      image: null,
                      sports: "",
                      amenities: "",
                    });
                  }}
                  className="text-gray-600 border border-gray-400 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={submitUpdate}
                  className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtOwnerVenues;
