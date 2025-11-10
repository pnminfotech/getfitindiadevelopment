import React, { useState, useRef } from "react";

function AddVenue() {
  const fileInputRef = useRef();
  const [venue, setVenue] = useState({
    name: "",
    city: "",
    location: {
      address: "",
      lat: "",
      lng: "",
    },
    description: "",
    pricing: "",
    image: null,
    sports:"",
    amenities:"",
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
    // ✅ Get token from localStorage
    const token = localStorage.getItem("token"); 

    if (!token) {
      alert("You must be logged in!");
      return;
    }

    const res = await fetch("http://localhost:8000/api/venues", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Attach token here
      },
      body: formData,
    });

    if (res.ok) {
      alert("Venue Added Successfully!");
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

      // ✅ Reset file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      const errorData = await res.json();
      alert(`Failed to add venue: ${errorData.message || "Unknown error"}`);
    }
  } catch (err) {
    alert("Error occurred");
    console.error(err);
  }
};

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 mt-2">
      <h2 className="font-bold text-2xl sm:text-3xl my-5 text-center sm:text-left">
        Add New Venue
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
          {/* Venue Name */}
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label
              htmlFor="name"
              className="sm:w-40 text-nowrap cursor-pointer"
            >
              Venue Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Venue Name"
              className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
              value={venue.name}
              onChange={(e) => setVenue({ ...venue, name: e.target.value })}
            />
          </div>

          {/* City */}
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
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
              className="pl-2 h-12 w-full bg-gray-200 rounded-lg"
              value={venue.city}
              onChange={(e) => setVenue({ ...venue, city: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="bg-white  p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label htmlFor="address" className="sm:w-40 text-nowrap">
              Address:
            </label>
           <textarea
    id="description"
    placeholder="Enter venue description..."
    className="pl-2 py-2 h-28 w-full bg-gray-200 rounded-lg resize-none"
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
<div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
  <label htmlFor="description" className="sm:w-40 text-nowrap">
    Description:
  </label>
  <textarea
    id="description"
    placeholder="Enter venue description..."
    className="pl-2 py-2 h-28 w-full bg-gray-200 rounded-lg resize-none"
    value={venue.description}
    onChange={(e) => setVenue({ ...venue, description: e.target.value })}
  />
</div>
          {/* Latitude */}
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label className="sm:w-40 text-nowrap">Latitude:</label>
            <input
              type="number"
              placeholder="Latitude"
              className="pl-2 h-12 w-full bg-gray-200 rounded-lg"
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
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label className="sm:w-40 text-nowrap">Longitude:</label>
            <input
              type="number"
              placeholder="Longitude"
              className="pl-2 h-12 w-full bg-gray-200 rounded-lg"
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
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label htmlFor="price" className="sm:w-40 text-nowrap">
              Pricing:
            </label>
            <input
              type="text"
              id="price"
              placeholder="Price"
              className="pl-2 h-12 w-full bg-gray-200  rounded-lg"
              value={venue.pricing}
              onChange={(e) => setVenue({ ...venue, pricing: e.target.value })}
            />
          </div>

          {/* Upload File */}
          <div className="bg-white  p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label htmlFor="imageFile" className="sm:w-40 text-nowrap">
              Upload Image:
            </label>
            <input
              type="file"
              id="imageFile"
              accept="image/png, image/jpeg, image/jpg"
              ref={fileInputRef}
              className="pl-2 h-full w-full bg-gray-200  rounded-lg "
              onChange={(e) => setVenue({ ...venue, image: e.target.files[0] })}
            />
          </div>

          {/* Sports */}
          <div className="bg-white  p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label htmlFor="sport" className="sm:w-40 text-nowrap">
              Sports:
            </label>
            <input
              type="text"
              id="sport"
              placeholder="Sports (comma separated)"
              className="pl-2 h-12 w-full bg-gray-200  rounded-lg"
              value={venue.sports}
              onChange={(e) => setVenue({ ...venue, sports: e.target.value })}
            />
          </div>

          {/* amenities */}
          <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label htmlFor="amenities" className="sm:w-40 text-nowrap">
              Amenities:
            </label>
            <input
              type="text"
              id="amenities"
              placeholder="Amenities (comma separated)"
              className="pl-2 h-12 w-full bg-gray-200 rounded-lg"
              value={venue.amenities}
              onChange={(e) =>
                setVenue({ ...venue, amenities: e.target.value })
              }
            />
          </div>

          {/* Timing Slots */}
          {/* <div className="bg-white p-6 rounded-3xl font-medium text-lg sm:text-xl">
            <label className="block mb-2 text-xl">Timing Slots:</label>
            {venue.timingSlots.map((slot, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
              >
                <input
                  type="text"
                  placeholder="Day"
                  className="pl-2 h-12 bg-gray-200 rounded-lg"
                  value={slot.day}
                  onChange={(e) => {
                    const updatedSlots = [...venue.timingSlots];
                    updatedSlots[index].day = e.target.value;
                    setVenue({ ...venue, timingSlots: updatedSlots });
                  }}
                />
                <input
                  type="text"
                  placeholder="Start Time"
                  className="pl-2 h-12 bg-gray-200 rounded-lg"
                  value={slot.startTime}
                  onChange={(e) => {
                    const updatedSlots = [...venue.timingSlots];
                    updatedSlots[index].startTime = e.target.value;
                    setVenue({ ...venue, timingSlots: updatedSlots });
                  }}
                />
                <input
                  type="text"
                  placeholder="End Time"
                  className="pl-2 h-12 bg-gray-200 rounded-lg"
                  value={slot.endTime}
                  onChange={(e) => {
                    const updatedSlots = [...venue.timingSlots];
                    updatedSlots[index].endTime = e.target.value;
                    setVenue({ ...venue, timingSlots: updatedSlots });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setVenue({
                  ...venue,
                  timingSlots: [
                    ...venue.timingSlots,
                    { day: "", startTime: "", endTime: "" },
                  ],
                })
              }
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Add Slot
            </button>
          </div> */}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center sm:justify-start">
          <button className="mt-8 h-12 w-40 sm:h-14 sm:w-64 bg-cyan-700 hover:text-black hover:bg-cyan-300 transition text-white rounded-full font-bold text-lg sm:text-xl">
            Add Venue
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddVenue;
