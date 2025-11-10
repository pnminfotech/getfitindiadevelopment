import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Pagination from "../../components/Pagination";

const VenueList = () => {
  const [venues, setVenues] = useState([]); // Adding Venues
  const [openSportsVenueId, setOpenSportsVenueId] = useState(null);
  const [openAmenitiesVenueId, setOpenAmenitiesVenueId] = useState(null);
  const [editingVenue, setEditingVenue] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    city: "",
    address: "",
    location: {
      address: "",
      lat: "",
      lng: "",
    },
    pricing: "",
    image: null,
    sports: "",
    amenities: "",
  });
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const venuesPerPage = 8;

  //Compute visible venues:
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstPage = indexOfLastVenue - venuesPerPage;
  const curentVenue = venues.slice(indexOfFirstPage, indexOfLastVenue);

  //Calculate total pages:
  const totalPages = Math.ceil(venues.length / venuesPerPage);

  //View All Venues
  const fetchVenues = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/venues");
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

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
      sports: ven.sports,
      amenities: ven.amenities,
    });
  };

  //Update VenueList
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

  if (editForm.image) {
    fd.append("image", editForm.image);
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/api/venues/${editingVenue._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      }
    );

    if (res.ok) {
      alert("Data Updated Successfully");
      fetchVenues();
      setEditingVenue(null);
    } else {
      const errData = await res.json();
      console.error("Update error:", errData);
      alert("Failed To Update Venue");
    }
  } catch (err) {
    console.error("Submit update error:", err);
    alert("Something went wrong during update.");
  }
};


  // Delete Venue List
 const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete?")) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/api/venues/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Venue Deleted Successfully!");
      setVenues((prev) => prev.filter((v) => v._id !== id));
      fetchVenues();
    } else {
      alert("Failed to delete venue.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the venue.");
  }
};


  return (
    <>
      <div className="px-4 sm:px-6 lg:px-10 mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold my-6 sm:my-10">
          All Venues
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {curentVenue.map((venue, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col"
            >
              <img
                src={`http://localhost:8000/uploads/${venue.image}`}
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
                  {/* <div className="flex flex-wrap gap-2 text-xs sm:text-sm mb-2">
                    {venue.sports.map((sport, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-300 px-3 py-1 rounded-full"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm mb-2">
                    {venue.amenities.map((amenities, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-300 px-3 py-1 rounded-full"
                      >
                        {amenities}
                      </span>
                    ))}
                  </div> */}

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
                          openAmenitiesVenueId === venue._id ? null : venue._id
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
        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalItems={venues.length}
          itemsPerPage={venuesPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* To Do for Edit  Form */}
      {editingVenue && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-xl shadow-xl">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              Update Venue
            </h1>
            <div className="grid grid-cols-1 gap-6 sm:gap-6">
              {/* Venue Name */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label
                  htmlFor="name"
                  className="sm:w-40 font-semibold text-nowrap cursor-pointer"
                >
                  Venue Name:
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Venue Name"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>

              {/* City */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label
                  htmlFor="city"
                  className="sm:w-40 text-nowrap cursor-pointer"
                >
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="City"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </div>

              {/* Address */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label htmlFor="address" className="sm:w-40 text-nowrap">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Address"
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

              {/* Latitude */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-40 text-nowrap">Latitude:</label>
                <input
                  type="number"
                  placeholder="Latitude"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.location.lat}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      location: { ...editForm.location, lat: e.target.value },
                    })
                  }
                />
              </div>

              {/* Longitude */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-40 text-nowrap">Longitude:</label>
                <input
                  type="number"
                  placeholder="Longitude"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.location.lng}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      location: { ...editForm.location, lng: e.target.value },
                    })
                  }
                />
              </div>

              {/* Sports */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label htmlFor="sport" className="sm:w-40 text-nowrap">
                  Sports:
                </label>
                <input
                  type="text"
                  id="sport"
                  placeholder="Sports (comma separated)"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.sports}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sports: e.target.value })
                  }
                />
              </div>
              {/* Amenities */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label htmlFor="amenities" className="sm:w-40 text-nowrap">
                  Amenities:
                </label>
                <input
                  type="text"
                  id="amenities"
                  placeholder="amenities (comma separated)"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.amenities}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amenities: e.target.value })
                  }
                />
              </div>

              {/* Pricing */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label htmlFor="price" className="sm:w-40 text-nowrap">
                  Pricing:
                </label>
                <input
                  type="text"
                  id="price"
                  placeholder="Price"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editForm.pricing}
                  onChange={(e) =>
                    setEditForm({ ...editForm, pricing: e.target.value })
                  }
                />
              </div>

              {/* Upload File */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label htmlFor="imageFile" className="sm:w-40 text-nowrap">
                  Upload Image:
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/png, image/jpeg, image/jpg"
                  className="pl-2 h-12 w-full bg-gray-100 border border-gray-300 rounded-lg "
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.files[0] })
                  }
                />
              </div>
              <div className="flex justify-end items-center gap-4">
                <button
                  onClick={() => {
                    setEditingVenue(null);
                    setEditForm({
                      name: "",
                      city: "",
                      address: "",
                      location: {
                        address: "",
                        lat: "",
                        lng: "",
                      },
                      pricing: "",
                      image: null,
                    });
                  }}
                  className="text-gray-600 cursor-pointer  h-10 w-20  rounded-lg border border-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={submitUpdate}
                  className="bg-cyan-700 text-white h-10 w-20 rounded-lg hover:bg-cyan-600 cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueList;
