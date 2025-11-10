// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CheckCircle } from "lucide-react";
// import moment from "moment";

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const bookingData = location.state?.bookingData;
//   const [isConfirming, setIsConfirming] = useState(false);

//   if (!bookingData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="text-center">
//           <h2 className="text-xl font-bold">No booking found</h2>
//           <p className="mt-2 text-sm text-gray-600">Go back and start a booking.</p>
//         </div>
//       </div>
//     );
//   }

//   const { selectedSlots, selectedDate, selectedCourt, venue } = bookingData;
//   const totalPrice = bookingData.totalPrice || 0;

//   const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || window.__RAZORPAY_KEY || "";

//   const loadRazorpay = () =>
//     new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   const handleConfirm = async () => {
//     setIsConfirming(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("User not authenticated");

//       // 1️⃣ Create Razorpay order (no bookings yet)
//       const orderRes = await fetch("http://localhost:8000/api/bookings/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           venueId: venue._id,
//           courtId: selectedCourt._id,
//           courtName: selectedCourt.courtName,
//           date: selectedDate,
//           selectedSlots,
//         }),
//       });

//       const orderData = await orderRes.json();
//       if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

//       const razorpayOrder = orderData.razorpayOrder;
//       if (!razorpayOrder) throw new Error("No Razorpay order returned from server");

//       // 2️⃣ Load Razorpay SDK
//       const sdkLoaded = await loadRazorpay();
//       if (!sdkLoaded) throw new Error("Failed to load Razorpay SDK");

//       if (!RAZORPAY_KEY) {
//         throw new Error("Missing Razorpay key. Add REACT_APP_RAZORPAY_KEY_ID in .env");
//       }

//       // 3️⃣ Razorpay options
//       const options = {
//         key: RAZORPAY_KEY,
//         amount: razorpayOrder.amount, // in paise
//         currency: razorpayOrder.currency || "INR",
//         name: venue?.name || "Venue Booking",
//         description: `Booking at ${venue?.name || ""}`,
//         order_id: razorpayOrder.id,
//        handler: async function (response) {
//   console.log("Payment success:", response);

//   try {
//     const confirmRes = await fetch("http://localhost:8000/api/bookings/confirm-payment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         razorpay_payment_id: response.razorpay_payment_id,
//         razorpay_order_id: response.razorpay_order_id,
//         razorpay_signature: response.razorpay_signature,
//         bookingData: {
//           venueId: venue._id,
//           courtId: selectedCourt._id,
//           courtName: selectedCourt.courtName,
//           date: selectedDate,
//           selectedSlots,
//         },
//       }),
//     });

//     const confirmData = await confirmRes.json();
//     if (!confirmRes.ok) throw new Error(confirmData.message || "Booking confirmation failed");

//     // ✅ Pass all necessary info
//     navigate("/user/payment-success", {
//       state: {
//         bookingData: confirmData.bookings,
//         totalPrice: totalPrice,       // amount paid
//         selectedCourt: selectedCourt,
//         selectedDate: selectedDate,
//         venue: venue,
//         selectedSlots: selectedSlots,

//       },
//     });
//   } catch (err) {
//     console.error("Booking confirm error:", err);
//     alert("Payment done but booking confirmation failed.");
//   }
// }
// ,
//         prefill: {
//           name: localStorage.getItem("username") || "",
//           email: localStorage.getItem("email") || "",
//           contact: localStorage.getItem("phone") || "",
//         },
//         theme: { color: "#f97316" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", function (response) {
//         console.error("Payment failed:", response.error);
//         alert("Payment failed. Please try again.");
//       });
//       rzp.open();
//     } catch (err) {
//       console.error("Error in handleConfirm:", err);
//       alert(err.message || "Something went wrong.");
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white pt-20">
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-bold mb-4">Confirm & Pay</h2>

//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Venue</p>
//               <p className="font-semibold">{venue?.name}</p>
//               <p className="text-sm text-gray-600">{venue?.address}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Date</p>
//               <p className="font-semibold">{moment(selectedDate).format("dddd, MMMM Do YYYY")}</p>
//             </div>
//           </div>

//           <div className="mt-4">
//             <p className="text-sm text-gray-500">Slots</p>
//             <div className="flex gap-2 flex-wrap mt-2">
//               {selectedSlots.map((s) => (
//                 <span key={`${s.startTime}-${s.endTime}`} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
//                   {moment(s.startTime, "HH:mm").format("h:mm A")} - {moment(s.endTime, "HH:mm").format("h:mm A")}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md z-40">
//         <div className="max-w-4xl mx-auto flex justify-between items-center">
//           <div>
//             <div className="text-sm text-gray-600">Total Payable</div>
//             <div className="text-2xl font-extrabold text-orange-600">₹{totalPrice}</div>
//           </div>

//           <button
//             onClick={handleConfirm}
//             disabled={isConfirming}
//             className={`px-6 py-3 rounded-lg font-semibold ${
//               isConfirming
//                 ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                 : "bg-orange-600 text-white hover:bg-orange-700"
//             }`}
//           >
//             {isConfirming ? "Processing..." : "Confirm & Pay"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;






import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import moment from "moment";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [isConfirming, setIsConfirming] = useState(false);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">No booking found</h2>
          <p className="mt-2 text-sm text-gray-600">Go back and start a booking.</p>
        </div>
      </div>
    );
  }

  const { selectedSlots, selectedDate, selectedCourt, venue } = bookingData;
  const totalPrice = bookingData.totalPrice || 0;
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || window.__RAZORPAY_KEY || "";

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const orderRes = await fetch("http://localhost:8000/api/bookings/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueId: venue._id,
          courtId: selectedCourt._id,
          courtName: selectedCourt.courtName,
          date: selectedDate,
          selectedSlots,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      const razorpayOrder = orderData.razorpayOrder;
      if (!razorpayOrder) throw new Error("No Razorpay order returned from server");

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) throw new Error("Failed to load Razorpay SDK");

      if (!RAZORPAY_KEY) throw new Error("Missing Razorpay key. Add REACT_APP_RAZORPAY_KEY_ID in .env");

      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: venue?.name || "Venue Booking",
        description: `Booking at ${venue?.name || ""}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          console.log("Payment success:", response);

          try {
            const confirmRes = await fetch("http://localhost:8000/api/bookings/confirm-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  venueId: venue._id,
                  courtId: selectedCourt._id,
                  courtName: selectedCourt.courtName,
                  date: selectedDate,
                  selectedSlots,
                },
              }),
            });

            const confirmData = await confirmRes.json();
            if (!confirmRes.ok) throw new Error(confirmData.message || "Booking confirmation failed");

            navigate("/user/payment-success", {
              state: {
                bookingData: confirmData.bookings,
                totalPrice,
                selectedCourt,
                selectedDate,
                venue,
                selectedSlots,
              },
            });
          } catch (err) {
            console.error("Booking confirm error:", err);
            alert("Payment done but booking confirmation failed.");
          }
        },
        prefill: {
          name: localStorage.getItem("username") || "",
          email: localStorage.getItem("email") || "",
          contact: localStorage.getItem("phone") || "",
        },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error("Error in handleConfirm:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Fixed Header with Back Button and Venue Name */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-600 hover:bg-orange-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        
        </button>
        <h1 className="text-lg sm:text-2xl font-extrabold text-gray-800 text-center flex-grow mx-4">
          {venue?.name}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 mt-16">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="font-semibold">{venue?.name}</p>
              <p className="text-sm text-gray-600">{venue?.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{moment(selectedDate).format("dddd, MMMM Do YYYY")}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Slots</p>
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedSlots.map((s) => (
                <span key={`${s.startTime}-${s.endTime}`} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {moment(s.startTime, "HH:mm").format("h:mm A")} - {moment(s.endTime, "HH:mm").format("h:mm A")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar for Payment */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Total Payable</div>
            <div className="text-2xl font-extrabold text-orange-600">₹{totalPrice}</div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isConfirming
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
          >
            {isConfirming ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
