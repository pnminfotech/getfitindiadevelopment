import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../pages/user/Homepage";
import SportsVenue from "../pages/user/SportsVenue";
import Coaching from "../pages/user/Coaching";
import Events from "../pages/user/Events";
import Login from "../pages/user/Login";
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import BookingPage from "../pages/user/BookingPage";
import MyBookings from "../pages/user/MyBookings";
import CoachFormPage from "../pages/user/CoachFormPage";
import VenueDetails from "../pages/user/VenueDetails";
import BookingConfirmationPage from "../pages/user/BookingConfirmationPage";
import PaymentPage from "../pages/user/PaymentPage";
import PaymentSuccessPage from "../pages/user/PaymentSuccessPage";
import Rought from "../pages/user/Rough";
import UserProtectedRoute from "../components/UserProtectedRoute"; // import it

export default function UserRoutes() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* Default redirect to homepage */}
      <Route path="/" element={<Navigate to="/user/homepage" />} />

      {/* Login route */}
      <Route
        path="login"
        element={
          isAuthenticated ? <Navigate to="/user/sportsvenue" /> : <Login />
        }
      />

      {/* Public pages */}
      <Route path="homepage" element={<Homepage />} />
      <Route path="sportsvenue" element={<SportsVenue />} />
      <Route path="coach" element={<CoachFormPage />} />
      <Route path="rough" element={<Rought />} />
      <Route path="venue/:id" element={<VenueDetails />} />

      {/* Protected user routes */}
      <Route
        path="profile"
        element={
          <UserProtectedRoute>
            <UserProfile />
          </UserProtectedRoute>
        }
      />
      <Route
        path="coaching"
        element={
          <UserProtectedRoute>
            <Coaching />
          </UserProtectedRoute>
        }
      />
      <Route
        path="events"
        element={
          <UserProtectedRoute>
            <Events />
          </UserProtectedRoute>
        }
      />
      <Route
        path="userdashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />
      <Route
        path="booking/:venueId"
        element={
          <UserProtectedRoute>
            <BookingPage />
          </UserProtectedRoute>
        }
      />
      <Route
        path="mybookings"
        element={
          <UserProtectedRoute>
            <MyBookings />
          </UserProtectedRoute>
        }
      />
      <Route
        path="booking-confirmation"
        element={
          <UserProtectedRoute>
            <BookingConfirmationPage />
          </UserProtectedRoute>
        }
      />
      <Route
        path="payment"
        element={
          <UserProtectedRoute>
            <PaymentPage />
          </UserProtectedRoute>
        }
      />
      <Route
        path="payment-success"
        element={
          <UserProtectedRoute>
            <PaymentSuccessPage />
          </UserProtectedRoute>
        }
      />
    </Routes>
  );
}
