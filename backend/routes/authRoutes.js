// // routes/authRoutes.js

// import express from "express";
// import { sendOtp, verifyOtp } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);

// export default router;











import express from "express";
import { register, adminLogin, requestOtp, verifyOtp, getLockedUsers, unlockUser, checkBlock } from "../controllers/authController.js";

const router = express.Router();

// Admin routes
router.post("/admin/register", register);   // optional, can remove if not needed
router.post("/admin/login", adminLogin);

// User OTP routes
router.post("/otp/request", requestOtp);
router.post("/otp/verify", verifyOtp);

// Admin APIs
router.get("/locked-users", getLockedUsers);
router.put("/unlock-user/:userId", unlockUser);
router.get("/check-block", checkBlock);

export default router;



// // login by email

// // // routes/authRoutes.js
// import express from "express";
// import { register, login } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;




// for admin email login and 
// for user mobile otp login 

// import express from "express";
// import {
//   registerAdminCoach,
//   loginAdminCoach,
//   sendOtp,
//   verifyOtp,
// } from "../controllers/authController.js";

// const router = express.Router();

// /* ✅ Admin / Coach */
// router.post("/register", registerAdminCoach);   // register admin/coach
// router.post("/login", loginAdminCoach);         // login admin/coach

// /* ✅ User (mobile + OTP) */
// router.post("/send-otp", sendOtp);              // send OTP to user
// router.post("/verify-otp", verifyOtp);          // verify OTP & login user

// export default router;
