// // rateLimits.js
// import rateLimit from "express-rate-limit";

// // Global safety net: 120 req/min per IP
// export const globalLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   limit: 120,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Per-route: OTP request — 5/min per IP
// export const otpRequestIpLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   limit: 5,
//   message: { error: "Too many OTP requests from this IP. Please wait a minute." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Per-route: OTP verify — 30/min per IP
// export const otpVerifyIpLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   limit: 30,
//   message: { error: "Too many attempts from this IP. Please try again later." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });



// rateLimits.js
import rateLimit from 'express-rate-limit';

// Global: 300 req / 5 min / IP
export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP request: IP guard (user-level guard is in controller)
export const otpRequestIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP verify: IP guard
export const otpVerifyIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
