import React, { useEffect, useState } from 'react';
import { FaUsers, FaCalendarCheck, FaRupeeSign, FaChalkboardTeacher } from 'react-icons/fa';
import { MdOutlineSportsBasketball } from "react-icons/md";

function UserDashboard() {
  const [venuesCount, setVenuesCount] = useState(0);

  //Fetch Total Venues Count
  useEffect(()=>{
    const fetchVenues = async ()=>{
      try {
        const res = await fetch('http://localhost:8000/api/venues');
        const data = await res.json();
        setVenuesCount(data.length);
      } catch (error) {
        console.error("Failed to fetch venue count:", error);
      }
    };
    fetchVenues();
  },[])
  const cards = [
    {
      title: "Total Users",
      icon: <FaUsers className="text-white" size={30} />,
      value: 8
    },
    {
      title: "Total Coaches",
      icon: <FaChalkboardTeacher className="text-white" size={30} />,
      value: 12
    },
    {
      title: "Total Venues",
      icon: <MdOutlineSportsBasketball className="text-white" size={30} />,
      value: venuesCount
    },
    {
      title: "Total Bookings",
      icon: <FaCalendarCheck className="text-white" size={30} />,
      value: 245
    },
    {
      title: "Total Revenue",
      icon: <FaRupeeSign className="text-white" size={30} />,
      value: 44000
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center sm:text-left">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-2xl h-auto sm:h-44 p-4 sm:p-6 flex items-center gap-4 hover:shadow-xl transition duration-300"
          >
            <div className="bg-green-500 h-16 w-16 sm:h-20 sm:w-20 rounded-xl flex justify-center items-center">
              {card.icon}
            </div>
            <div className="flex flex-col">
              <h4 className="text-base sm:text-lg font-semibold text-gray-700">{card.title}</h4>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
