// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaStar,
//   FaMapMarkerAlt,
//   FaFutbol,
//   FaRupeeSign,
//   FaShareAlt,
//   FaDirections, // Added for clarity for directions button
//   FaCheckCircle, // For amenities
//   FaBaseballBall, // Example for other sports if needed
//   FaSwimmer,
//   FaDumbbell,
//   FaBasketballBall, // Specific for basketball
//   FaTableTennis, // Specific for table tennis
//  // Specific for badminton
// } from "react-icons/fa";
// import { GiCricketBat, GiShuttlecock } from "react-icons/gi"; // ✅ Import both correctly

// // import { GiShuttlecock } from "react-icons/gi"; // ✅ Correct shuttlecock icon from Game Icons

// import Sidebar from "./Sidebar"; // ✅ Adjust this path if needed
// import { FaBars } from "react-icons/fa"; // For toggle button

// const VenueDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [venue, setVenue] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar toggle state

//   // Dummy Images for Carousel - Replace with actual venue images if available
//   const carouselImages = [
//     "http://googleusercontent.com/image_generation_content/1", // Modern sports complex - daylight
//     "http://googleusercontent.com/image_generation_content/2", // Sports complex - evening lights
//     "http://googleusercontent.com/image_generation_content/3", // Indoor sports center
//     "http://googleusercontent.com/image_generation_content/4", // Family-friendly garden
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     // Basic auto-carousel functionality
//     const interval = setInterval(() => {
//       setCurrentImageIndex(
//         (prevIndex) => (prevIndex + 1) % carouselImages.length
//       );
//     }, 5000); // Change image every 5 seconds

//     return () => clearInterval(interval);
//   }, [carouselImages.length]);

//   useEffect(() => {
//     fetch(`http://localhost:8000/api/venues/${id}`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setVenue(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch venue", err);
//         setLoading(false);
//         // Optionally navigate to a 404 page or show an error message
//         // navigate('/404');
//       });
//   }, [id, navigate]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <p className="text-xl text-gray-700 animate-pulse">Loading venue details...</p>
//       </div>
//     );
//   if (!venue)
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <p className="text-xl text-red-600">Venue not found or an error occurred.</p>
//       </div>
//     );

//   const sports = Array.isArray(venue?.sports)
//     ? venue.sports
//     : (venue?.sports || "").split(",").map((s) => s.trim()).filter(s => s !== ""); // Ensure trimming and filter empty

//   const amenities = Array.isArray(venue?.amenities)
//     ? venue.amenities
//     : (venue?.amenities || "").split(",").map((a) => a.trim()).filter(a => a !== ""); // Ensure trimming and filter empty


//   // Helper function to get sport icon
//   const getSportIcon = (sportName) => {
//     const lowerCaseSport = sportName.toLowerCase();
//     if (lowerCaseSport.includes("cricket")) return <GiCricketBat />;
//     if (lowerCaseSport.includes("football")) return <FaFutbol />;
//     if (lowerCaseSport.includes("basketball")) return <FaBasketballBall />;
//     if (lowerCaseSport.includes("table tennis") || lowerCaseSport.includes("ping pong")) return <FaTableTennis />;
//  if (lowerCaseSport.includes("badminton")) return <GiShuttlecock />;

//     // Add more icons for other sports as needed
//     return null; // Default if no icon matches
//   };


//   return (
//     // <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
//     //   {/* Sidebar Toggle */}
//     //   <div className="fixed top-4 left-4 z-[1003]">
//     //     <button
//     //       onClick={() => setSidebarOpen(true)}
//     //       className="p-3 bg-white rounded-full shadow-lg text-orange-600 hover:bg-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
//     //       aria-label="Open sidebar"
//     //     >
//     //       <FaBars className="text-xl" />
//     //     </button>
//     //   </div>

//     //   {/* Sidebar */}
//     //   {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

//     //   {/* Back Button */}
//     //   <div className="absolute top-4 right-4 z-[1002] sm:top-6 sm:right-6">
//     //     <button
//     //       onClick={() => navigate(-1)}
//     //       className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg text-orange-600 hover:bg-blue-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
//     //     >
//     //       <svg
//     //         className="w-5 h-5"
//     //         fill="none"
//     //         stroke="currentColor"
//     //         strokeWidth="2"
//     //         viewBox="0 0 24 24"
//     //       >
//     //         <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//     //       </svg>
//     //       Back
//     //     </button>
//     //   </div>
// <div className="min-h-screen bg-white mt-20 md:mt-0 md:pt-20 px-4 sm:px-6 lg:px-8 font-sans">


//       {/* Header with Venue Name and Back Button */}
//      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 px-4 py-3 sm:px-8 flex items-center justify-between">
//   {/* Left: Back Button */}
//   {/* <button
//     onClick={() => navigate(-1)}
//     className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-600 hover:bg-orange-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
//   >
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       viewBox="0 0 24 24"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//     </svg>
   
//   </button> */}

//   {/* Center: Venue Name */}
//    {/* Sidebar Toggle */}
  
// <button
//     onClick={() => navigate(-1)}
//     className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-600 hover:bg-orange-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
//   >
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       viewBox="0 0 24 24"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//     </svg>
//      {/* Center: Venue Name */}
 

//   </button>


//    <h1 className="text-lg sm:text-2xl font-extrabold text-gray-800 text-center flex-grow mx-4">
//     {venue?.name}
//   </h1>
//       {/* Sidebar */}
//       {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />} 

//   {/* Right: Cart Icon */}
//   <button
//           onClick={() => setSidebarOpen(true)}
//           className="p-3 bg-white rounded-full shadow-lg text-orange-600 hover:bg-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
//           aria-label="Open sidebar"
//         >
//           <FaBars className="text-xl" />
//         </button>
// </div>
//       {/* Main Content Area - Full width on all screens */}
//       <div className="w-full max-w-full mx-auto pb-12">
//         {/* Hero Image / Carousel */}
//         <div className="relative h-[200px] sm:h-[200px] md:h-[400px] lg:h-[400px] overflow-hidden shadow-xl border rounded-xl">
//           <img
//             src={
//               venue?.image
//                 ? `http://localhost:8000/uploads/${venue.image}`
//                 : carouselImages[currentImageIndex] // Fallback to carousel images
//             }
//             alt={venue.name}
//             className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
//           />
//           {/* Gradient overlay for text readability */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

//           {/* Venue Info Overlay */}
//           <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
//             {/* <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
//                   {venue.name}
//                 </h1>
//                 <div className="mt-2 flex items-center gap-3 text-lg sm:text-xl text-gray-200 drop-shadow">
//                   <FaMapMarkerAlt className="text-blue-300" />
//                   <p className="font-medium">{venue.location?.address || venue.address}</p>
//                 </div>
//                 <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-yellow-400 mt-2 drop-shadow">
//                   <FaStar />
//                   <span>{venue.rating || "4.5"}</span>
//                   <span className="text-gray-300 text-sm font-normal ml-1">(based on reviews)</span>
//                 </div>
//               </div>
           
//             </div> */}
//           </div>
//         </div>

//         {/* Content Sections */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  sm:p-8 lg:p-12 bg-white">

//           {/* Main Description & Details (Left/Center Column) */}
//           <div className="lg:col-span-2 sm:space-y-3 space-y-4 mt-5">
//             {/* Description */}
//             <section className=" p-6 sm:p-8 rounded-2xl border border-gray-300 ">
//                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1">
//               <div>
//                 <h1 className="text-md sm:text-4sm md:text-sm font-extrabold leading-tight  text-black">
//                   {venue.name}
//                 </h1>
//                 <div className="mt-2 flex items-center gap-3 text-sm sm:text-sm text-gray-500 drop-shadow">
//                   <FaMapMarkerAlt className="text-green-600" />
//                   <p className="font-medium ">{venue.location?.address || venue.address}</p>
//                 </div>
//                 <hr className="my-2"/>
//                 <div className="flex items-center gap-2 text-sm sm:text-2sm font-bold text-yellow-400 mt-2 drop-shadow">
//                   <FaStar />
//                   <span>{venue.rating || "4.5"}</span>
//                   <span className="text-gray-300 text-sm font-normal ml-1">(based on reviews)</span>
//                 </div>
//               </div>
//               {/* <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-green-400 drop-shadow">
//                 <FaRupeeSign />
//                 <span className="text-white">Price:</span> {venue.pricing || "Contact for pricing"}
//               </div> */}
//             </div>
//             </section>
//             {/* Description */}
//             <section className="bg-white p-6 sm:p-8 rounded-2xl  border border-gray-300 ">
//               <h2 className="text-md sm:text-4sm md:text-sm font-extrabold leading-tight  text-black">
//                 About {venue.name}
//               </h2>
//               <p className="text-gray-700 leading-relaxed text-sm md:text-base sm:text-lg mt-1">
//                 {venue.description || "No description provided by venue owner. This premium sports facility offers state-of-the-art equipment and a vibrant atmosphere for all sports enthusiasts."}
//               </p>
//             </section>

//             {/* Sports Available */}
//            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-300">
//   <h2 className="text-md sm:text-4sm md:text-sm font-extrabold leading-tight text-black">
//     Sports Available
//   </h2>
  
//   {sports.length > 0 ? (
//     <div className="flex flex-wrap gap-3 mt-3">
//       {sports.map((sport, i) => (
//         <div
//           key={i}
//           className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm capitalize font-medium shadow-sm hover:bg-green-200 transition"
//         >
//           {sport}
//         </div>
//       ))}
//     </div>
//   ) : (
//     <p className="text-gray-600 italic mt-2">
//       No specific sports listed, please contact the venue.
//     </p>
//   )}
// </section>

//                {/* Amenities */}
//             <section className="bg-white p-6 sm:p-8 rounded-2xl  border border-gray-300 ">
//               <h2 className="text-md sm:text-4sm md:text-sm font-extrabold leading-tight  text-black">
//                 Amenities
//               </h2>
//               {amenities.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 flex gap-4 mt-2">
//                   {amenities.map((a, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center gap-3  text-gray-700 px-2 text-sm  "
//                     >
//                       <FaCheckCircle className="text-gray-600 text-sm" />
//                       <span>{a}</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-600 italic">No specific amenities listed.</p>
//               )}
//             </section>
//           </div>

//           {/* Amenities & Action Buttons (Right Column) */}
//           <div className="lg:col-span-1 space-y-8">
         

//             {/* Share + Direction Buttons */}
//             <section className="bg-white p-6 sm:p-8 rounded-2xl  border border-gray-300 ">
//               <h2 className="text-md sm:text-4sm md:text-sm font-extrabold leading-tight  text-black">
//                 Connect & Locate
//               </h2>
//               <div className="flex gap-1 mt-1">
//            <button
//   onClick={() => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: venue.name,
//           text: `Check out this venue: ${venue.name}`,
//           url: window.location.href,
//         })
//         .then(() => console.log("Successfully shared"))
//         .catch((error) => console.error("Error sharing", error));
//     } else {
//       // Fallback for unsupported browsers
//       navigator.clipboard.writeText(window.location.href)
//         .then(() => alert("Link copied to clipboard!"))
//         .catch(() => alert("Failed to copy the link."));
//     }
//   }}
//   className="flex-1 flex items-center justify-center gap-3  border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
// >
//   <FaShareAlt /> Share
// </button>


//                <button
//   onClick={() => {
//     const lat = venue.location?.lat;
//     const lng = venue.location?.lng;

//     if (lat && lng) {
//       const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
//       window.open(mapsUrl, '_blank');
//     } else {
//       alert("Coordinates not available.");
//     }
//   }}
//   className="flex-1 flex items-center justify-center gap-3 py-3  border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-orange-300 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
// >
//   <FaMapMarkerAlt /> Directions
// </button>


//               </div>
//             </section>

//             {/* Booking Button */}
          
//               {/* <button
//                 onClick={() => navigate(`/user/booking/${id}`)}
//                 className="w-full bg-orange-600 text-white text-sm font-bold px-8 py-4 rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
//               >
//                Select A Sport To Proceed
//               </button> */}
//           <button
//   onClick={() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (!token || role !== "user") {
//       // If not logged in as user, redirect to user login
//       navigate("/user/login", { state: { from: `/user/booking/${id}` } });
//     } else {
//       // If logged in as user, proceed to booking page
//       navigate(`/user/booking/${id}`);
//     }
//   }}
//   className="w-full bg-orange-600 text-white text-sm font-bold px-8 py-4 rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
// >
//   Select A Sport To Proceed
// </button>


//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VenueDetails;





import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaFutbol,
  FaRupeeSign,
  FaShareAlt,
  FaCheckCircle,
  FaBasketballBall,
  FaTableTennis,
  FaBars,
} from "react-icons/fa";
import { GiCricketBat, GiShuttlecock } from "react-icons/gi";
import Sidebar from "./Sidebar";

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const carouselImages = [
    "http://googleusercontent.com/image_generation_content/1",
    "http://googleusercontent.com/image_generation_content/2",
    "http://googleusercontent.com/image_generation_content/3",
    "http://googleusercontent.com/image_generation_content/4",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- parse ?shared=1 from the current URL
  const search = new URLSearchParams(location.search);
  const isSharedVisit = search.get("shared") === "1";

  // OPTIONAL: if user already has a token and arrived via shared link, strip the flag
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isSharedVisit) {
      const params = new URLSearchParams(location.search);
      params.delete("shared");
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSharedVisit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((p) => (p + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/api/venues/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setVenue(data))
      .catch((err) => console.error("Failed to fetch venue", err))
      .finally(() => setLoading(false));
  }, [id]);

  const sports = Array.isArray(venue?.sports)
    ? venue.sports
    : (venue?.sports || "").split(",").map((s) => s.trim()).filter(Boolean);

  const amenities = Array.isArray(venue?.amenities)
    ? venue.amenities
    : (venue?.amenities || "").split(",").map((a) => a.trim()).filter(Boolean);

  const getSportIcon = (sportName = "") => {
    const s = sportName.toLowerCase();
    if (s.includes("cricket")) return <GiCricketBat />;
    if (s.includes("football")) return <FaFutbol />;
    if (s.includes("basketball")) return <FaBasketballBall />;
    if (s.includes("table tennis") || s.includes("ping pong")) return <FaTableTennis />;
    if (s.includes("badminton")) return <GiShuttlecock />;
    return null;
  };

  // ---- ONLY gate on shared links
  const proceedToBooking = () => {
    const token = localStorage.getItem("token");
    const target = `/user/booking/${id}`;
    if (isSharedVisit && !token) {
      navigate("/user/login", { state: { from: target } });
      return;
    }
    navigate(target);
  };

  // Build the share URL from the current URL, adding/overwriting ?shared=1
  const shareUrlObj = new URL(window.location.href);
  shareUrlObj.searchParams.set("shared", "1");
  const sharedUrl = shareUrlObj.toString();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700 animate-pulse">Loading venue details...</p>
      </div>
    );
  }
  if (!venue) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-600">Venue not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-20 md:mt-0 md:pt-20 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 px-4 py-3 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-600 hover:bg-orange-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-lg sm:text-2xl font-extrabold text-gray-800 text-center flex-grow mx-4">
          {venue?.name}
        </h1>

        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-white rounded-full shadow-lg text-orange-600 hover:bg-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          aria-label="Open sidebar"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="w-full max-w-full mx-auto pb-12">
        {/* Hero */}
        <div className="relative h-[200px] sm:h-[200px] md:h-[400px] lg:h-[400px] overflow-hidden shadow-xl border rounded-xl">
          <img
            src={
              venue?.image
                ? `http://localhost:8000/uploads/${venue.image}`
                : carouselImages[currentImageIndex]
            }
            alt={venue?.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:p-8 lg:p-12 bg-white">
          {/* Left / Center */}
          <div className="lg:col-span-2 sm:space-y-3 space-y-4 mt-5">
            <section className="p-6 sm:p-8 rounded-2xl border border-gray-300">
              <div>
                <h1 className="text-md md:text-sm font-extrabold text-black">{venue?.name}</h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <FaMapMarkerAlt className="text-green-600" />
                  <p className="font-medium">
                    {venue?.location?.address || venue?.address || "No address provided"}
                  </p>
                </div>
                <hr className="my-2" />
                <div className="flex items-center gap-2 text-sm font-bold text-yellow-400 mt-2">
                  <FaStar />
                  <span>{venue?.rating || "4.5"}</span>
                  <span className="text-gray-300 text-xs font-normal ml-1">(based on reviews)</span>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-300">
              <h2 className="text-md md:text-sm font-extrabold text-black">About {venue?.name}</h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base mt-1">
                {venue?.description ||
                  "No description provided by venue owner. This premium sports facility offers state-of-the-art equipment and a vibrant atmosphere for all sports enthusiasts."}
              </p>
            </section>

            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-300">
              <h2 className="text-md md:text-sm font-extrabold text-black">Sports Available</h2>
              {sports.length > 0 ? (
                <div className="flex flex-wrap gap-3 mt-3">
                  {sports.map((sport, i) => (
                    <div
                      key={`${sport}-${i}`}
                      className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm capitalize font-medium shadow-sm hover:bg-green-200 transition flex items-center gap-2"
                    >
                      {getSportIcon(sport)}
                      {sport}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic mt-2">No specific sports listed, please contact the venue.</p>
              )}
            </section>

            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-300">
              <h2 className="text-md md:text-sm font-extrabold text-black">Amenities</h2>
              {amenities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  {amenities.map((a, i) => (
                    <div key={`${a}-${i}`} className="flex items-center gap-3 text-gray-700 px-2 text-sm">
                      <FaCheckCircle className="text-gray-600 text-sm" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">No specific amenities listed.</p>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-300">
              <h2 className="text-md md:text-sm font-extrabold text-black">Connect & Locate</h2>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: venue?.name,
                          text: `Check out this venue: ${venue?.name}`,
                          url: sharedUrl, // same page + ?shared=1
                        })
                        .catch((e) => console.error("Share error:", e));
                    } else {
                      navigator.clipboard
                        .writeText(sharedUrl)
                        .then(() => alert("Share link copied!"))
                        .catch(() => alert("Failed to copy the link."));
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-3 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <FaShareAlt /> Share
                </button>

                <button
                  onClick={() => {
                    const lat = venue?.location?.lat;
                    const lng = venue?.location?.lng;
                    if (lat && lng) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
                    } else {
                      alert("Coordinates not available.");
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-orange-300 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <FaMapMarkerAlt /> Directions
                </button>
              </div>
            </section>

            <button
              onClick={proceedToBooking}
              className="w-full bg-orange-600 text-white text-sm font-bold px-8 py-4 rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Select A Sport To Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
