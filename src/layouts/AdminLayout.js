// import React, { useState } from "react";
// import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { FaClipboardList, FaUserTie, FaBars, FaUsers } from "react-icons/fa";
// import { MdSchedule, MdDashboard } from "react-icons/md";
// import { NavLink, Outlet } from "react-router-dom";

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <>
//       {/* Mobile Hamburger Toggle */}
//       <div className="md:hidden fixed top-3 left-3 z-50">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="text-gray-700 bg-white p-2 rounded shadow-md"
//         >
//           <FaBars size={24} />
//         </button>
//       </div>

//       <div className="flex flex-col md:flex-row min-h-screen">
//         {/* Sidebar */}
//         <aside
//           className={`
//             font-bold bg-gray-700 text-white z-40
//             ${sidebarOpen ? "block fixed top-0 left-0 h-full w-64" : "hidden"}
//             md:block md:relative md:w-64
//           `}
//         >
//           {/* Sidebar Header */}
//           <div className="text-2xl font-bold text-center py-4 border-b border-black-600 flex justify-between items-center px-4">
//             <h5 className="mx-auto">Admin</h5>
//             <button
//               className="md:hidden text-white"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ✕
//             </button>
//           </div>

//           {/* Sidebar Nav */}
//           <nav className="p-4 flex md:flex-col flex-wrap justify-around md:justify-start gap-2">
//             <NavItem
//               to="/admin/dashboard"
//               icon={<MdDashboard size={30} />}
//               label="Dashboard"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <NavItem
//               to="/admin/venues"
//               icon={<HiOutlineBuildingOffice2 size={30} />}
//               label="Venues"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <NavItem
//               to="/admin/venues/add"
//               icon={<AiOutlinePlusCircle size={30} />}
//               label="Add Venue"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <NavItem
//               to="/admin/coaches"
//               icon={<FaUserTie size={30} />}
//               label="Coaches"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <NavItem
//               to="/admin/bookings"
//               icon={<FaUsers size={30} />}
//               label="Users"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <NavItem
//               to="/admin/allbookings"
//               icon={<FaClipboardList size={30} />}
//               label="Bookings"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <NavItem
//               to="/admin/manage"
//               icon={<MdSchedule size={30} />}
//               label="Manage Slots"
//               onClick={() => setSidebarOpen(false)}
//             />
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-4 bg-gray-200 min-h-screen">
//           <Outlet />
//         </main>
//       </div>
//     </>
//   );
// };

// // ✅ Reusable NavItem component
// const NavItem = ({ to, icon, label, onClick }) => (
//   <NavLink
//     to={to}
//     end
//     onClick={onClick}
//     className={({ isActive }) =>
//       `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
//       ${isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"}`
//     }
//   >
//     <span>{icon}</span>
//     {label}
//   </NavLink>
// );

// export default AdminLayout;




import React, { useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaClipboardList, FaUserTie, FaBars, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { MdSchedule, MdDashboard } from "react-icons/md";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth token
    localStorage.removeItem("user");  // clear user info if stored
    navigate("/login"); // redirect to login
  };

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 bg-white p-2 rounded shadow-md"
        >
          <FaBars size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            font-bold bg-gray-700 text-white z-40
            ${sidebarOpen ? "block fixed top-0 left-0 h-full w-64" : "hidden"}
            md:block md:relative md:w-64
          `}
        >
          {/* Sidebar Header */}
          <div className="text-2xl font-bold text-center py-4 border-b border-black-600 flex justify-between items-center px-4">
            <h5 className="mx-auto">Admin</h5>
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Sidebar Nav */}
          <nav className="p-4 flex flex-col gap-2 h-[calc(100%-64px)]">
            <div className="flex-1 flex flex-col gap-2">
              <NavItem
                to="/admin/dashboard"
                icon={<MdDashboard size={30} />}
                label="Dashboard"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/admin/venues"
                icon={<HiOutlineBuildingOffice2 size={30} />}
                label="Venues"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/admin/venues/add"
                icon={<AiOutlinePlusCircle size={30} />}
                label="Add Venue"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/admin/coaches"
                icon={<FaUserTie size={30} />}
                label="Coaches"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/admin/bookings"
                icon={<FaUsers size={30} />}
                label="Users"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/admin/allbookings"
                icon={<FaClipboardList size={30} />}
                label="Bookings"
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                to="/admin/manage"
                icon={<MdSchedule size={30} />}
                label="Manage Slots"
                onClick={() => setSidebarOpen(false)}
              />
              {/* 🔒 Locked/Blocked Users */}
  <NavItem
    to="/admin/blocked-users"
    icon={<FaUsers size={30} />}
    label="Locked Users"
    onClick={() => setSidebarOpen(false)}
  />
            </div>

            {/* ✅ Logout button at bottom */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-5 text-sm md:text-xl rounded-lg bg-red-600 hover:bg-red-500 transition-all duration-200"
            >
              <FaSignOutAlt size={30} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-200 min-h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
};

// ✅ Reusable NavItem component
const NavItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    end
    onClick={onClick}
    className={({ isActive }) =>
      `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
      ${isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"}`
    }
  >
    <span>{icon}</span>
    {label}
  </NavLink>
);

export default AdminLayout;
