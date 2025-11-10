import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import CityDropdown from './CityDropdown';
import logo3 from '../assets/logo3.jpeg';

function Header({ selectedCity, onSelectCity, uniqueCities, onToggleSidebar }) {
  return (
    <nav className="flex justify-between items-center bg-gray-50 h-[100px] px-[10px] shadow-md sticky top-0 z-[100]">
      
      {/* Left box with logo and city dropdown */}
      <div className="flex items-center gap-4 lg:ml-[42px]">
        <img
          src="https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/logo3.jpeg?updatedAt=1758175870307"
             
          alt="Fit India Logo"
          className="h-[40px] w-[40px] rounded-full"
        />
        <CityDropdown
          selectedCity={selectedCity}
          onSelectCity={onSelectCity}
          cities={uniqueCities}
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-5 lg:mr-[42px]">
        {/* <FiSearch className="text-[20px] font-bold text-orange-500 cursor-pointer" /> */}
        <FaUser
          className="text-[20px] font-bold text-orange-500 cursor-pointer me-2"
          onClick={onToggleSidebar}
        />
      </div>
    </nav>
  );
}

export default Header;
