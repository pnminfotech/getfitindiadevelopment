// utils/msg91Service.js
import axios from "axios";

// ✅ Send OTP through MSG91 OTP API
export const sendOtp = async (mobile, otp) => {
  try {
    const url = `https://api.msg91.com/api/v5/otp`;

    const response = await axios.get(url, {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,   // from .env
        mobile: mobile,                        // must be with country code, e.g., 91XXXXXXXXXX
        sender: process.env.MSG91_SENDER_ID,   // approved sender ID
        otp: otp                               // generated OTP
      },
      headers: {
        "Content-Type": "application/json"
      }
    });

    return { type: "success", data: response.data };
  } catch (error) {
    console.error("MSG91 OTP Send Error:", error.response?.data || error.message);
    return { type: "error", error: error.message };
  }
};

// (Optional) verify OTP directly with MSG91 API
export const verifyOtpWithMsg91 = async (mobile, otp) => {
  try {
    const url = `https://api.msg91.com/api/v5/otp/verify`;

    const response = await axios.get(url, {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobile: mobile,
        otp: otp
      }
    });

    return { type: "success", data: response.data };
  } catch (error) {
    console.error("MSG91 OTP Verify Error:", error.response?.data || error.message);
    return { type: "error", error: error.message };
  }
};
