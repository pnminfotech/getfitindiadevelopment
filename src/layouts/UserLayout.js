// File: src/layouts/UserLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Fit India</h1>
        <div className="flex space-x-6">
          <Link to="/user/homepage" className="hover:text-yellow-300">Home</Link>
          <Link to="/user/sportsvenue" className="hover:text-yellow-300">Sports Venues</Link>
          <Link to="/user/coaching" className="hover:text-yellow-300">Coaching</Link>
          <Link to="/user/events" className="hover:text-yellow-300">Events</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gray-100">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white text-center py-3">
        <p>© 2025 Fit India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserLayout;
