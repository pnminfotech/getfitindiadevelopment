// const formatMobile = (phone) => {
//   let clean = phone.replace(/\D/g, ""); // remove non-digits
//   if (clean.startsWith("91")) {
//     return clean; // already has country code
//   }
//   return `91${clean}`; // add if missing
// };

// export const sendBookingConfirmationSMS = async (phone, smsData) => {
//   try {
//     const mobile = formatMobile(phone);

//     const response = await fetch("https://control.msg91.com/api/v5/flow/", {
//       method: "POST",
//       headers: {
//         "authkey": process.env.MSG91_AUTH_KEY,
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({
//         flow_id: process.env.MSG91_TEMPLATE_ID,
//         sender: process.env.MSG91_SENDER_ID,
//         mobiles: mobile,  // ✅ fixed here
//         venue: smsData.venue,
//         date: smsData.date,
//         time: smsData.time,
//         time2: smsData.time2,
//         amount: smsData.amount,
//       }),
//     });

//     const result = await response.json();
//     console.log("📩 SMS Sent Response:", result);
//     return result;
//   } catch (err) {
//     console.error("❌ SMS sending failed:", err);
//     return null;
//   }
// };


import fetch from "node-fetch";
import dotenv from "dotenv";
import moment from "moment";   // ⬅️ add this
dotenv.config();

const formatMobile = (phone) => {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("91")) return clean;
  return `91${clean}`;
};

// Helper to format time into AM/PM
const formatTime = (time) => {
  if (!time) return "";
  return moment(time, ["HH:mm", "h:mm"]).format("h:mm A"); 
};

// ✅ Booking Confirmation SMS
export const sendBookingConfirmationSMS = async (phone, smsData) => {
  try {
    const mobile = formatMobile(phone);
    if (!mobile) throw new Error("Invalid phone number");

    // Format slot times before sending
    const time = formatTime(smsData.time);
    const time2 = formatTime(smsData.time2);

    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        flow_id: process.env.MSG91_TEMPLATE_ID,
        sender: process.env.MSG91_SENDER_ID,
        mobiles: mobile,
        venue: smsData.venue,
        date: moment(smsData.date).format("DD MMM YYYY"),
        time,
        time2,
        amount: smsData.amount,
      }),
    });

    const result = await response.json();
    console.log("📩 Confirmation SMS Sent Response:", result);
    return result;
  } catch (err) {
    console.error("❌ Confirmation SMS failed:", err.message || err);
    return null;
  }
};

// ✅ Booking Cancellation SMS
export const sendBookingCancelledSMS = async (phone, smsData) => {
  try {
    const mobile = formatMobile(phone);
    if (!mobile) throw new Error("Invalid phone number");

    const time = formatTime(smsData.time);
    const time1 = formatTime(smsData.time1);

    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        flow_id: process.env.MSG91_CANCEL_TEMPLATE_ID,
        sender: process.env.MSG91_SENDER_ID,
        mobiles: mobile,
        venue: smsData.venue,
        date: moment(smsData.date).format("DD MMM YYYY"),
        time,
        time1,
        amount: smsData.amount,
      }),
    });

    const result = await response.json();
    console.log("📩 Cancellation SMS Sent Response:", result);
    return result;
  } catch (err) {
    console.error("❌ Cancellation SMS failed:", err.message || err);
    return null;
  }
};
