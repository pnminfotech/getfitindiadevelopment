import React, { useEffect, useState, useMemo } from "react";
import logo3 from "../../assets/logo3.jpeg"; // ✅ Updated logo
import SportsGardens from "../../components/SportsGardens";
import DateButtonWithPicker from "../../components/DateButtonWithPicker";
import { FaChevronDown, FaTimes, FaBars } from "react-icons/fa";
import Slider from "react-slick";
import { FiPhone, FiMail, FiMapPin, FiArrowRight } from "react-icons/fi";
import { HiOutlineLightningBolt, HiOutlineGlobeAlt, HiOutlineUsers } from "react-icons/hi";
import { Link,  useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import coachingPromo from "../../assets/coaching.jpeg";
import coachingPromo1 from "../../assets/mobile.jpg";
import coachingPromo3 from "../../assets/stadium.jpg";
// Images
import carouselHero1 from "../../assets/garden1.png";
import carouselHero2 from "../../assets/garden2.png";
import carouselHero3 from "../../assets/garden3.png";
import carouselHero4 from "../../assets/garden4.png";
import carouselHero5 from "../../assets/garden5.png";
import coachPortrait from "../../assets/coach.png";

import carosoule1 from "../../assets/carosoule1.jpeg";
import carosoule2 from "../../assets/carosoule1.png";
import carosoule3 from "../../assets/carosoule4.jpeg";
import carosoule4 from "../../assets/carosoule5.png";
import carosoule5 from "../../assets/carosoule6.jpeg";

const TIME_BUCKETS = [
  { label: "Morning", from: "05:00", to: "12:00" },
  { label: "Afternoon", from: "12:00", to: "17:00" },
  { label: "Evening", from: "17:00", to: "23:59" },
];

function Homepage() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedAmenity, setSelectedAmenity] = useState("All");
  const [selectedTiming, setSelectedTiming] = useState("All");
  const [dateText, setDateText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
const navigate = useNavigate();

  const googleFormUrl = "https://forms.gle/ph5DXNoyDCCqKj6N9";
  const handleOpenForm = () => {
    window.open(googleFormUrl, "_blank");
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/venues")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
        setFilteredVenues(data.slice(0, 8));
      })
      .catch((err) => console.error("Failed to fetch venues:", err));
  }, []);

  const uniqueCities = useMemo(
    () => ["All Cities", ...new Set(venues.map((v) => v.city).filter(Boolean))],
    [venues]
  );

  const uniqueSports = useMemo(
    () => ["All", ...new Set(venues.flatMap((v) => v.sports || []))],
    [venues]
  );

  const uniqueAmenities = useMemo(
    () => ["All", ...new Set(venues.flatMap((v) => v.amenities || []))],
    [venues]
  );

  const filterVenues = () => {
    let result = [...venues];

    if (selectedCity !== "All Cities") {
      result = result.filter((v) => v.city === selectedCity);
    }

    if (selectedSport !== "All") {
      result = result.filter((v) => v.sports?.includes(selectedSport));
    }

    if (selectedAmenity !== "All") {
      result = result.filter((v) => v.amenities?.includes(selectedAmenity));
    }

    if (selectedTiming !== "All") {
      const range = TIME_BUCKETS.find((t) => t.label === selectedTiming);
      result = result.filter((v) =>
        v.courts?.some((c) =>
          c.slots?.some(
            (s) => s.startTime >= range.from && s.startTime < range.to
          )
        )
      );
    }

    setFilteredVenues(result.slice(0, 8));
  };

  useEffect(() => {
    filterVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedSport, selectedAmenity, selectedTiming]);

  return (
    <>
      {/* NavBar */}
      <nav className="bg-gray-50 sticky top-0 z-50">
        <div className="flex justify-between items-center h-[70px] sm:h-[100px] px-4 sm:px-8">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <img
              src="https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/logo3.jpeg?updatedAt=1758175870307"
              alt="Fit India Logo"
              className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full"
            />
            <h1 className="text-[22px] sm:text-[26px] font-bold  cursor-pointer tricolor-heading">
              Get Fit India
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/user/sportsvenue"
              className="text-[18px] sm:text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4 decoration-ornage-500"
            >
              SPORTS VENUES
            </Link>
            <button
              onClick={handleOpenForm}
              className="text-[18px] sm:text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4 decoration-orange-500 bg-transparent"
            >
              COACHING
            </button>

           <button
  onClick={() => navigate("/user/login")}
  className="text-[16px] sm:text-[18px] font-bold px-4 py-2b bg-orange-500 hover:bg-orange-700 text-white rounded-full transition"
>
  Log In
</button>

          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-orange-500">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-3 space-y-3 bg-white shadow-md border-t border-gray-200">
            <Link
              to="/user/sportsvenue"
              className="block text-orange-500 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              SPORTS VENUES
            </Link>
            <button
              onClick={() => {
                handleOpenForm();
                setMenuOpen(false);
              }}
              className="block text-orange-500 font-medium text-left"
            >
              COACHING
            </button>
            <Link
              to="/user/login"
              className="block text-white bg-orange-500 hover:bg-orange-700 text-center py-2 rounded-full font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Log In
            </Link>
          </div>
        )}
      </nav>
<section className="bg-white py-10 px-4 sm:px-8 md:px-16 lg:px-32">
  {/* Social Icons Row */}
  <div className="flex justify-center md:justify-start gap-5 mb-6 text-gray-600 text-lg">
  <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
  <FaInstagram className="hover:text-pink-500 cursor-pointer" />
  <FaLinkedinIn className="hover:text-blue-800 cursor-pointer" />
  <FaYoutube className="hover:text-red-600 cursor-pointer" />
</div>


  {/* Carousel */}
  <Slider
    dots
    infinite
    speed={500}
    slidesToShow={1}
    slidesToScroll={1}
    autoplay
    autoplaySpeed={4000}
  >
    {/* Slide 1 */}
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
            Expert-Led 
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg font-medium max-w-xl">
            Our certified coaches bring years of professional experience to each session.
          </p>
          <Link
            to="/user/sportsvenue"
            className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
          >
            Try Now
          </Link>
        </div>

        {/* Image */}
        <div className="flex-1">
          <img
              src="https://ik.imagekit.io/kgrarhxkv/coaching.png?updatedAt=1757752927536"
   alt="Pro Coaching"
            className="rounded-2xl shadow-lg w-full max-w-md mx-auto h-[320px] object-cover"
          />
        </div>
      </div>
    </div>

    {/* Slide 2 */}
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
            Discover
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg font-medium max-w-xl">
            Easily explore top venues and coaching programs tailored to your sport and location.
          </p>
          <Link
            to="/user/sportsvenue"
            className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
          >
            Try Now
          </Link>
        </div>

        <div className="flex-1">
          <img
            src="https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/mobile.jpg?updatedAt=1758175870482"
            alt="Discover"
            className="rounded-2xl shadow-lg w-full max-w-md mx-auto h-[320px] object-cover"
          />
        </div>
      </div>
    </div>

    {/* Slide 3 */}
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
            Book Instantly
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg font-medium max-w-xl">
            Seamlessly book your slot with real-time availability and secure payment options.
          </p>
          <Link
            to="/user/sportsvenue"
            className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
          >
            Try Now
          </Link>
        </div>

        <div className="flex-1">
          <img
            src="https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/stadium.jpg?updatedAt=1758175873144"
            alt="Book Instantly"
            className="rounded-2xl shadow-lg w-full max-w-md mx-auto h-[320px] object-cover"
          />
        </div>
      </div>
    </div>
  </Slider>
</section>



      {/* Carousel Banner */}
      <section className="px-0 sm:px-[80px] pt-4 pb-6">
        <Slider
          autoplay
          autoplaySpeed={4000}
          dots
          infinite
          speed={800}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={false}
          pauseOnHover
          className="rounded-xl overflow-hidden"
        >
          {[
            {
              url: "https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/carosoule1.png?updatedAt=1758175861057",
              caption: "Elite Coaching Facilities",
            },
            {
              url: "https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/carosoule4.jpeg?updatedAt=1758175859015",
              caption: "Book Sports Venues Instantly",
            },
            {
              url: "https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/carosoule5.png?updatedAt=1758175860827",
              caption: "Train with Top Coaches",
            },
            {
              url: "https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/carosoule6.jpeg?updatedAt=1758175859255",
              caption: "Weekend Sports Events & Tournaments",
            },
            {
              url: "https://ik.imagekit.io/kgrarhxkv/GetFitIndia/assets/carosoule1.jpeg?updatedAt=1758175859037",
              caption: "Top Turf Grounds near you",
            },
          ].map((item, index) => (
            <div key={index} className="relative" style={{borderRadius:20}}>
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-[150px] sm:h-[500px] object-cover " 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-xl sm:text-3xl font-bold drop-shadow-md text-center px-4">
                  {item.caption}
                </h3>
              </div>
            </div>
          ))}
        </Slider>
      </section>

   

   

{/* Filter Section */}
<section className="bg-white text-black px-[13px] sm:px-[80px] pb-16">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-lg font-bold text-black">
      Available Venues <span className="text-gray-500"></span>
    </h2>
    <button className="bg-white border border-gray-300 rounded-full p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-black"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 14.414V20a1 1 0 01-1.447.894l-4-2A1 1 0 019 18v-3.586L3.293 6.707A1 1 0 013 6V4z"
        />
      </svg>
    </button>
  </div>

  {/* Row 1: City Buttons */}
  <div className="flex gap-3 mb-3 overflow-x-auto scrollbar-hide w-full">
    {uniqueCities.map((city) => (
      <button
        key={city}
        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ${
          selectedCity === city
            ? "bg-orange-500 text-white border-orange-500"
            : "bg-white text-black border-gray-300"
        }`}
        onClick={() => setSelectedCity(city)}
      >
        {city}
      </button>
    ))}
  </div>

  {/* Row 2: Other Filters */}
  <div className="overflow-x-auto scrollbar-hide w-full">
    <div className="flex gap-3 w-max">

      {/* Date Button */}
      <DateButtonWithPicker
  buttonClass="flex items-center gap-1 bg-[#1E2A78] text-white px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
  onDateChange={(date) => {
    const formatted = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short", // ensures 'Aug' instead of 'August'
    });
    setDateText(formatted);
  }}
  label={dateText || "Select Date"}
/>


      {/* Sports Buttons */}
      {uniqueSports.slice(0, 3).map((sport) => (
        <button
          key={sport}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ${
            selectedSport === sport
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-black border-gray-300"
          }`}
          onClick={() => setSelectedSport(sport)}
        >
          {sport}
        </button>
      ))}

      {/* Amenities Buttons */}
      {uniqueAmenities.slice(0, 2).map((amenity) => (
        <button
          key={amenity}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ${
            selectedAmenity === amenity
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-black border-gray-300"
          }`}
          onClick={() => setSelectedAmenity(amenity)}
        >
          {amenity}
        </button>
      ))}

      {/* Timings Buttons */}
      {["All", ...TIME_BUCKETS.map((t) => t.label)].slice(0, 2).map((time) => (
        <button
          key={time}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ${
            selectedTiming === time
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-black border-gray-300"
          }`}
          onClick={() => setSelectedTiming(time)}
        >
          {time}
        </button>
      ))}
    </div>
  </div>
</section>






      {/* Venues Preview */}
      <section className="px-[13px] sm:px-[80px] pb-16">
        <h2 className="text-xl font-bold mb-4 mt-3">Popular Sports Venues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {filteredVenues.length === 0 ? (
    <p>No venues found.</p>
  ) : (
    filteredVenues.slice(0, 8).map((venue, index, arr) => (
      <div key={index} className="w-full">
        <SportsGardens
          garden={{
            ...venue,
            image: `http://localhost:8000/uploads/${venue.image}`,
          }}
        />
        {/* Only show separator if not the last item */}
        {index !== arr.length - 1 && (
          <div className="h-[1px] bg-gray-300 my-4 w-full col-span-full" />
        )}
      </div>
    ))
  )}
</div>


        {/* View All Button */}
        <div className="text-center mt-10">
           {/* <Link
            to="/user/sportsvenue"
            className="inline-flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-900 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back group relative overflow-hidden"
          ></Link> */}
          <Link
            to="/user/sportsvenue"
            className="inline-flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-400 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back group relative overflow-hidden"
          >
           
            View All Venues
          </Link>
        </div>
      </section>

      {/* Background Hero with CTA */}
      <section className="relative px-4 sm:px-16 pt-8 pb-12 bg-white overflow-hidden min-h-[650px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Slider
            autoplay
            autoplaySpeed={5500}
            dots={false}
            infinite
            fade={true}
            speed={1200}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            pauseOnHover={false}
            className="w-full h-full"
          >
            {[carouselHero1, carouselHero2, carouselHero3, carouselHero4, carouselHero5].map(
              (imgUrl, index) => (
                <div key={index} className="w-full h-full">
                  <img
                    src={imgUrl}
                    alt={`Sports scene ${index + 1}`}
                    className="w-full h-full object-cover object-center transform scale-110 animate-zoom-in"
                  />
                </div>
              )
            )}
          </Slider>
          <div
            className="absolute inset-0 bg-black/65 backdrop-brightness-75 animate-fade-in"
            style={{ backgroundColor: "#0a0a0a80" }}
          ></div>
        </div>

        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-6 py-10 rounded-2xl bg-white/10 backdrop-blur-xl shadow-3xl border border-white/20 animate-fade-in-up delay-300 transform scale-95">
          <h2 className="text-2xl   sm:text-3xl md:text-3xl font-extrabold mb-6 leading-tight drop-shadow-lg  animate-text-reveal">
            Unleash Your Potential. <br className="hidden sm:inline" />
            <span className="text-yellow-300">Play Beyond Limits.</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-xl text-white opacity-90 max-w-3xl mx-auto mb-12 drop-shadow-md animate-fade-in-up delay-700">
            "Get Fit India" is your premier platform to discover & book top-tier sports
            venues, and connect with certified coaches for an unparalleled fitness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-1000">
            <Link
              to="/user/sportsvenue"
              onClick={() => setMenuOpen(false)}
               className="inline-flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-400 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back group relative overflow-hidden"
        >
              <span className="relative z-10" style={{ fontSize: 14 }}>
                Find a Venue
              </span>
              <FiArrowRight className="ml-3 text-2xl group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-0 transition-opacity duration-300"></span>
            </Link>
            <button
              onClick={handleOpenForm}
              className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 border border-white/30 text-white px-5 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back backdrop-blur-sm group relative overflow-hidden"
            >
              <span className="relative z-10" style={{ fontSize: 14 }}>
                Register as Coach
              </span>
              <FiArrowRight className="ml-3 text-2xl group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-0 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Coach section */}
    <section className="w-[80%] mx-auto bg-gradient-to-br from-orange-500 to-green-300 px-4 sm:px-8 py-20 mt-20 rounded-[30px] shadow-3xl overflow-hidden relative z-10">

        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              fillOpacity="0.1"
              d="M0,160L48,160C96,160,192,160,288,144C384,128,480,96,576,90.7C672,85,768,107,864,138.7C960,171,1056,213,1152,208C1248,203,1344,155,1392,130.7L1440,107L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
            <path
              fill="#ffffff"
              fillOpacity="0.05"
              d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,213.3C672,235,768,245,864,229.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div>

        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 text-white max-w-full">
          <div className="md:w-1/2 md:ps-3 text-center md:text-left animate-fade-in-up delay-200">
            <h2 className="text-2xl   sm:text-3xl md:text-3xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Empower Your Coaching Career
              <br className="hidden sm:inline" />
              <span className="text-yellow-200">Join Our Elite Network!</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 opacity-95 leading-relaxed">
              Are you a passionate, <strong>certified sports coach</strong> aiming to make a bigger
              impact? Partner with Get Fit India to connect with a vast pool of eager students and
              unlock new opportunities across the country.
            </p>
            <button
              onClick={handleOpenForm}
              className="bg-white text-teal-700 hover:bg-gray-100 font-semibold text-lg sm:text-xl px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 duration-300 ease-out"
            >
              Start Coaching Today
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center order-first md:order-last animate-fade-in-up delay-400">
            <img
              src="https://ik.imagekit.io/kgrarhxkv/coaching.png?updatedAt=1757752927536"
              alt="Professional Sports Coach"
              className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] rounded-3xl shadow-2xl object-cover object-top border-4 border-white/30 transition-transform duration-500 hover:scale-105 ease-out"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
   <footer className="bg-gray-900 text-gray-300 mt-24 py-16 px-4 sm:px-16 relative z-0">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left max-w-7xl mx-auto">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5 text-left">About Get Fit India</h3>
            <p className="text-gray-400 text-sm leading-relaxed text-left">
              Get Fit India is dedicated to building a vibrant sports community by connecting
              enthusiasts with premier venues and expert coaches. We make it easy to book, play, and
              stay active, fostering a healthier, fitter India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5 text-left">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm text-left">
              <li>
                <Link
                  to="/user/sportsvenue"
                  className="text-[18px] sm:text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4 decoration-orange-500"
                >
                  Sports Venue
                </Link>
              </li>
              <li>
                <button
                  onClick={handleOpenForm}
                  className="text-[18px] sm:text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4 decoration-orange-500 bg-transparent"
                >
                  Coaching
                </button>
              </li>
              <li>
               <button
  onClick={() => navigate("/user/login")}
  className="text-[16px] sm:text-[18px] font-bold px-4 py-2 bg-orange-500 hover:bg-orange-700 text-white rounded-full transition inline-block"
>
  Log In
</button>

              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5 text-left">Support</h3>
            <ul className="space-y-3 text-gray-400 text-sm text-left">
              {/* <li>
                <a href="#" className="hover:text-orange-500 transition-colors duration-200">
                  FAQ
                </a>
              </li> */}
              {/* Support */}
  <li>
      <Link
        to="/terms-and-conditions"
        className="hover:text-orange-500 transition-colors duration-200"
      >
        Terms of Service
      </Link>
    </li>
    <li>
    <Link
        to="/privacypolicy"
        className="hover:text-orange-500 transition-colors duration-200"
      >   Privacy Policy
      </Link>
    </li>
 

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5 text-left">Connect With Us</h3>
            <div className="flex  justify-flexstart sm:justify-start gap-3 text-gray-400 text-sm mb-2 text-left">
              <FiPhone className="text-orange-500 text-lg" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex  justify-flexstart sm:justify-start gap-3 text-gray-400 text-sm mb-2">
              <FiMail className="text-orange-500 text-lg" />
              <span>getfitindia.in@gmail.com</span>
            </div>
            <div className="flex  justify-flexstart sm:justify-start gap-3 text-gray-400 text-sm">
              <FiMapPin className="text-orange-500 text-lg" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-700 pt-10 text-center text-sm text-gray-500">
          <p>Get Fit India is the product made by Ashvamedh Sports</p> © {new Date().getFullYear()} Get Fit India. All rights reserved.
          <p className="mt-2 text-xs text-gray-600">Built with Passion in India.</p>
        </div>
      </footer>

      {/* --- Global CSS Animations & Custom Easing --- */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-down {
          animation: slideInDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
          opacity: 0;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .ease-out-back {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }

        .active\\:scale-95:active {
          transform: scale(0.95);
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 10px 10px -5px rgba(0, 0, 0, 0.15);
        }
         .tricolor-heading {
  font-size: 25PX;
  font-weight: bold;
background: linear-gradient(177deg, rgb(255 134 0) 0%, rgb(225 122 29 / 98%) 50%, #16a34a 100%);
  -webkit-text-fill-color: transparent;
  background-clip: text; 
  text-fill-color: transparent;
} 
      `}</style>
    </>
  );
}

const Dropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 text-orange-500 border border-gray-300 rounded-full flex items-center text-sm font-medium"
      >
        {label}: {selected} <FaChevronDown className="ml-1" />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded border max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              className={`px-4 py-2 text-sm hover:bg-orange-100 cursor-pointer ${
                selected === opt ? "font-semibold text-orange-500" : ""
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
          {selected !== "All" && (
            <div
              className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer flex items-center"
              onClick={() => {
                onChange("All");
                setOpen(false);
              }}
            >
              <FaTimes className="inline mr-2" />
              Clear
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Homepage;
