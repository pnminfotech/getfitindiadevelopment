// import { Link, useLocation } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaBuilding,
//   FaPlusCircle,
//   FaUserFriends,
//   FaChalkboardTeacher,
//   FaCalendarCheck,
//   FaClock,
//   FaLock,
//   FaSignOutAlt,
// } from "react-icons/fa";

// export default function CourtOwnerSidebar() {
//   const { pathname } = useLocation();

//   const active = (path) =>
//     pathname === path
//       ? "bg-[#495057] text-white font-semibold shadow-inner"
//       : "text-gray-300 hover:bg-[#343a40] hover:text-white transition-all duration-200";

//   const logout = () => {
//     localStorage.removeItem("courtOwnerToken");
//     window.location.href = "/courtowner/login";
//   };

//   return (
//     <>


    
//       {/* --- Sidebar --- */}
//       <aside className="fixed top-0 left-0 w-64 bg-[#1c2331] text-white h-screen flex flex-col justify-between shadow-2xl z-50">
//         {/* ---- Header ---- */}
//         <div>
//           <div className="p-5 border-b border-gray-700">
//             <h2 className="text-2xl font-bold text-white tracking-wide">
//               Court Owner
//             </h2>
//           </div>

//           {/* ---- Navigation ---- */}
//           <nav className="flex flex-col mt-4 space-y-1 text-[16px]">
//             <Link
//               to="/courtowner/dashboard"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/dashboard"
//               )}`}
//             >
//               <FaTachometerAlt size={18} /> Dashboard
//             </Link>

//             <Link
//               to="/courtowner/venues"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/venues"
//               )}`}
//             >
//               <FaBuilding size={18} /> Venues
//             </Link>

//             <Link
//               to="/courtowner/add-venue"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/add-venue"
//               )}`}
//             >
//               <FaPlusCircle size={18} /> Add Venue
//             </Link>

//             {/* 
//             <Link
//               to="/courtowner/coaches"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/coaches"
//               )}`}
//             >
//               <FaChalkboardTeacher size={18} /> Coaches
//             </Link>
//             */}

//             <Link
//               to="/courtowner/users"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/users"
//               )}`}
//             >
//               <FaUserFriends size={18} /> Users
//             </Link>

//             <Link
//               to="/courtowner/bookings"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/bookings"
//               )}`}
//             >
//               <FaCalendarCheck size={18} /> Bookings
//             </Link>

//             <Link
//               to="/courtowner/manage-slots"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/manage-slots"
//               )}`}
//             >
//               <FaClock size={18} /> Manage Slots
//             </Link>

//             {/* ✅ New: Block Slots */}
//            <Link
//   to="/courtowner/blockslots"
//   className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//     "/courtowner/blockslots"
//   )}`}
// >
//   <FaLock size={18} /> Block Slots
// </Link>


//             {/* 
//             <Link
//               to="/courtowner/lockedusers"
//               className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
//                 "/courtowner/lockedusers"
//               )}`}
//             >
//               <FaLock size={18} /> Locked Users
//             </Link>
//             */}
//           </nav>
//         </div>

//         {/* ---- Logout ---- */}
//         <div className="p-5 border-t border-gray-700">
//           <button
//             onClick={logout}
//             className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all font-semibold text-lg"
//           >
//             <FaSignOutAlt /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* --- Content Offset Fix --- */}
//       <style>
//         {`
//           body {
//             margin-left: 16rem; /* same as w-64 = 256px */
//           }
//         `}
//       </style>
//     </>
//   );
// }




import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBuilding,
  FaPlusCircle,
  FaUserFriends,
  FaCalendarCheck,
  FaClock,
  FaLock,
  FaSignOutAlt,
  FaChartBar,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function CourtOwnerSidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const active = (path) =>
    pathname === path
      ? "bg-[#495057] text-white font-semibold shadow-inner"
      : "text-gray-300 hover:bg-[#343a40] hover:text-white transition-all duration-200";

  const logout = () => {
    localStorage.removeItem("courtOwnerToken");
    window.location.href = "/courtowner/login";
  };

  return (
    <>
      {/* ---- Toggle Button (Visible on Mobile) ---- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-[#0d2149] text-white p-2 rounded-md lg:hidden"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* ---- Sidebar ---- */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-[#1c2331] text-white h-screen flex flex-col justify-between shadow-2xl transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* ---- Header ---- */}
        <div>
          <div className="p-5 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Court Owner
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* ---- Navigation ---- */}
          <nav className="flex flex-col mt-4 space-y-1 text-[16px]">
            <Link
              to="/courtowner/dashboard"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/dashboard"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaTachometerAlt size={18} /> Dashboard
            </Link>

            <Link
              to="/courtowner/venues"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/venues"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaBuilding size={18} /> Venues
            </Link>

            <Link
              to="/courtowner/add-venue"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/add-venue"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaPlusCircle size={18} /> Add Venue
            </Link>

            <Link
              to="/courtowner/users"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/users"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaUserFriends size={18} /> Users
            </Link>

            <Link
              to="/courtowner/bookings"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/bookings"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaCalendarCheck size={18} /> Bookings
            </Link>

            <Link
              to="/courtowner/manage-slots"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/manage-slots"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaClock size={18} /> Manage Slots
            </Link>

            {/* ✅ Added Block Slots */}
            <Link
              to="/courtowner/blockslots"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/blockslots"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaLock size={18} /> Block Slots
            </Link>

            <Link
              to="/courtowner/reports"
              className={`flex items-center gap-3 px-5 py-2 rounded-md ${active(
                "/courtowner/reports"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              <FaChartBar size={18} /> Reports
            </Link>
          </nav>
        </div>

        {/* ---- Logout ---- */}
        <div className="p-5 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all font-semibold text-lg"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* --- Sidebar Width Offset for Desktop --- */}
      <style>
        {`
          @media (min-width: 1024px) {
            body {
              margin-left: 16rem; /* same as w-64 */
            }
          }
        `}
      </style>
    </>
  );
}
