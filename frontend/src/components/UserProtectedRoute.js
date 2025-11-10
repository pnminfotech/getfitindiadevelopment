// components/UserProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';

export default function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!token) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return children;
}
