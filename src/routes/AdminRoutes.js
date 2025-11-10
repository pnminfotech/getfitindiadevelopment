import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import VenueList from '../pages/admin/VenueList';
import AddVenue from '../pages/admin/AddVenue';
import CoachList from '../pages/admin/CoachList';
import BookingList from '../pages/admin/BookingList';
import ManageSlots from '../pages/admin/ManageSlots';
import BlockSlotsAdmin from '../pages/admin/BlockSlotsAdmin';
import ManageAddBlockSlots from '../pages/admin/ManageAddBlockSlots';
import AdminLogin from '../pages/admin/AdminLogin';
import AllBookings from '../pages/admin/AllBookings';
import BlockedUsers from '../pages/admin/BlockedUsers';
export default function AdminRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAuthenticated = !!token && role === "admin";
  const location = useLocation();

  return (
    <Routes>
      {/* ✅ Public Login */}
      <Route path="login" element={<AdminLogin />} />

      {/* ✅ Protected Admin Routes */}
      {isAuthenticated ? (
        <>
          {/* If hitting /admin directly → redirect to dashboard */}
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="venues" element={<VenueList />} />
            <Route path="venues/add" element={<AddVenue />} />
            <Route path="coaches" element={<CoachList />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="manage" element={<ManageAddBlockSlots />} />
            <Route path="allbookings" element={<AllBookings />} />
             <Route path="blocked-users" element={<BlockedUsers />} />
          </Route>
          <Route path="blockslot" element={<BlockSlotsAdmin />} />
          <Route path="slots" element={<ManageSlots />} />
         
        </>
      ) : (
        // 🚫 If not authenticated → redirect to login
        <Route
          path="*"
          element={<Navigate to="/admin/login" state={{ from: location }} />}
        />
      )}
    </Routes>
  );
}
