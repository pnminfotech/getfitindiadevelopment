// import User from "../models/User.js";
// import { generateToken } from "../utils/tokenService.js";
// import axios from "axios";

// // ------------------ Admin Register ------------------
// export const register = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!email || !password) return res.status(400).json({ error: "Email and password required" });

//   const existingUser = await User.findOne({ email });
//   if (existingUser) return res.status(400).json({ error: "Email already exists" });

//   const user = await User.create({ name, email, password, role: role || "admin" });
//   const token = generateToken(user._id);
//   res.status(201).json({ token, user });
// };

// // ------------------ Admin Login ------------------
// export const adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email, role: "admin" });
//     if (!user) return res.status(401).json({ error: "Invalid email or password" });

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

//     if (user.blocked) return res.status(403).json({ error: "Your account has been blocked by the admin." });

//     const token = generateToken(user._id);
//     res.json({ token, user });
//   } catch (err) {
//     console.error("Admin login error:", err);
//     res.status(500).json({ error: "Server error during login" });
//   }
// };

// // ------------------ User OTP Request ------------------
// export const requestOtp = async (req, res) => {
//   const { mobile } = req.body;
//   if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

//   let user = await User.findOne({ mobile });

//   if (!user) {
//     user = new User({ mobile, role: "user", name: "" });
//     await user.save();
//   } else if (user.lockUntil && user.lockUntil < Date.now()) {
//     // Reset attempts after lock expires
//     user.otpAttempts = 0;
//     user.lockUntil = null;
//     user.blocked = false;
//     await user.save();
//   }

//   // Generate OTP
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
//   user.otp = otp;
//   user.otpExpires = otpExpires;
//   await user.save();

//   // Send OTP via MSG91
//   try {
//     const msg91AuthKey = process.env.MSG91_OTP_AUTHKEY;
//     const templateId = process.env.MSG91_OTP_TEMPLATE_ID;
//     const url = `https://api.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${mobile}&authkey=${msg91AuthKey}&otp=${otp}`;
//     const response = await axios.get(url);
//     console.log("MSG91 OTP Response:", response.data);

//     res.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("MSG91 OTP Error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// // ------------------ User OTP Verify ------------------
// export const verifyOtp = async (req, res) => {
//   const { mobile, otp } = req.body;
//   if (!mobile || !otp) return res.status(400).json({ error: "Mobile and OTP are required" });

//   const user = await User.findOne({ mobile, role: "user" });
//   if (!user) return res.status(400).json({ error: "User not found" });

//   // Check if account is locked
//   if (user.lockUntil && user.lockUntil > Date.now()) {
//     return res.status(403).json({
//       error: `Account temporarily blocked. Try again after ${new Date(user.lockUntil)}`
//     });
//   }

//   // Check OTP validity
//   if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
//     return res.status(400).json({ error: "OTP expired or not requested" });
//   }

//   if (user.otp.toString() !== otp.toString()) {
//     // Increment invalid attempts
//     user.otpAttempts = (user.otpAttempts || 0) + 1;

//     const maxAttempts = 3;
//     const blockDuration = 15 * 60 * 1000; // 15 mins

//     if (user.otpAttempts >= maxAttempts) {
//       user.blocked = true;
//       user.lockUntil = Date.now() + blockDuration;
//       await user.save();
//       return res.status(403).json({
//         error: `Too many invalid attempts. Account blocked for 15 minutes.`
//       });
//     }

//     await user.save();
//     return res.status(400).json({ error: `Invalid OTP. Attempts left: ${maxAttempts - user.otpAttempts}` });
//   }

//   // ✅ OTP correct → reset attempts and unblock
//   user.otp = null;
//   user.otpExpires = null;
//   user.otpAttempts = 0;
//   user.blocked = false;
//   user.lockUntil = null;
//   await user.save();

//   const token = generateToken(user._id);
//   res.json({ token, user });
// };



import User from "../models/User.js";
import { generateToken } from "../utils/tokenService.js";
import axios from "axios";

// ------------------ Admin Notification Helper ------------------
const notifyAdmin = async (user) => {
  try {
    console.log(`🚨 User ${user.mobile} has been locked at ${new Date().toLocaleString()}`);

    if (process.env.ADMIN_MOBILE && process.env.MSG91_ADMIN_ALERT_TEMPLATE) {
      const msg91AuthKey = process.env.MSG91_OTP_AUTHKEY;
      await axios.get(`https://api.msg91.com/api/v5/flow/`, {
        params: {
          template_id: process.env.MSG91_ADMIN_ALERT_TEMPLATE,
          mobiles: process.env.ADMIN_MOBILE,
          authkey: msg91AuthKey,
          VAR1: user.mobile,
        },
      });
    }
  } catch (err) {
    console.error("Failed to notify admin:", err.message);
  }
};

// ------------------ Admin Register ------------------
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "Email already exists" });

  const user = await User.create({ name, email, password, role: role || "admin" });
  const token = generateToken(user._id, { role: user.role });
  res.status(201).json({ token, user });
};

// ------------------ Admin Login ------------------
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    if (user.blocked) return res.status(403).json({ error: "Your account has been blocked by the admin." });

    const token = generateToken(user._id, { role: user.role });
    res.json({ token, user });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ------------------ User OTP Request ------------------
export const requestOtp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

  let user = await User.findOne({ mobile });

  if (!user) {
    user = new User({ mobile, role: "user", name: "" });
    await user.save();
  } else if (user.lockUntil && user.lockUntil < Date.now()) {
    // Reset attempts after temporary lock expires
    user.otpAttempts = 0;
    user.lockUntil = null;
    await user.save();
  }

  // 🚫 Admin-blocked cannot request OTP
  if (user.blocked) {
    return res.status(403).json({ error: "Your account is blocked by the admin." });
  }

  // 🚫 Temp-locked cannot request OTP until lock window ends
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(423).json({
      error: `Too many invalid OTP attempts. Try again after ${new Date(user.lockUntil).toLocaleString()}`,
      lockUntil: user.lockUntil,
    });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
  user.otp = otp;
  user.otpExpires = otpExpires;
  user.otpRequestCount = (user.otpRequestCount || 0) + 1;
  await user.save();

  try {
    const msg91AuthKey = process.env.MSG91_OTP_AUTHKEY;
    const templateId = process.env.MSG91_OTP_TEMPLATE_ID;
    const url = `https://api.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${mobile}&authkey=${msg91AuthKey}&otp=${otp}`;
    const response = await axios.get(url);
    console.log("MSG91 OTP Response:", response.data);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("MSG91 OTP Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


// ------------------ User OTP Verify ------------------
export const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ error: "Mobile and OTP are required" });

  const user = await User.findOne({ mobile, role: "user" });
  if (!user) return res.status(400).json({ error: "User not found" });

  // 🚫 HARD BLOCK: do not verify OTP for admin-blocked users
  if (user.blocked) {
    return res.status(403).json({ error: "Your account is blocked. Please contact admin." });
  }

  // Temporary lock window check
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({
      error: `Account temporarily blocked. Try again after ${new Date(user.lockUntil)}`
    });
  }

  // Check OTP validity
  if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
    return res.status(400).json({ error: "OTP expired or not requested" });
  }

  if (user.otp.toString() !== otp.toString()) {
    user.otpAttempts = (user.otpAttempts || 0) + 1;

    const maxAttempts = 3;
    const blockDuration = 15 * 60 * 1000; // 15 mins

    if (user.otpAttempts >= maxAttempts) {
      user.lockUntil = Date.now() + blockDuration;

      user.lockHistory.push({
        reason: "Too many invalid OTP attempts",
        lockedAt: new Date(),
        lockDuration: 15,
      });

      await user.save();
      await notifyAdmin(user);

      return res.status(403).json({
        error: `Too many invalid attempts. Account blocked for 15 minutes.`
      });
    }

    await user.save();
    return res.status(400).json({ error: `Invalid OTP. Attempts left: ${maxAttempts - user.otpAttempts}` });
  }

  // ✅ OTP correct → reset attempts and clear only expired temp lock
  user.otp = null;
  user.otpExpires = null;
  user.otpAttempts = 0;
  if (user.lockUntil && user.lockUntil <= Date.now()) {
    user.lockUntil = null;
  }
  await user.save();

  const token = generateToken(user._id, { role: user.role });
  res.json({ token, user });
};

// ------------------ Admin Get Locked Users ------------------
// export const getLockedUsers = async (req, res) => {
//   try {
//     const lockedUsers = await User.find({ blocked: true }).select("name mobile lockUntil lockHistory role");
//     res.json(lockedUsers);
//   } catch (err) {
//     console.error("Error fetching locked users:", err);
//     res.status(500).json({ error: "Failed to fetch locked users" });
//   }
// };
// ------------------ Admin Get Locked Users ------------------
export const getLockedUsers = async (req, res) => {
  try {
    const now = new Date();
    const lockedUsers = await User.find({
      $or: [
        { blocked: true },            // admin-blocked
        { lockUntil: { $gt: now } },  // temporary lock still active
      ],
    }).select("name mobile lockUntil lockHistory role blocked");
    res.json(lockedUsers);
  } catch (err) {
    console.error("Error fetching locked users:", err);
    res.status(500).json({ error: "Failed to fetch locked users" });
  }
};

// ------------------ Admin Unlock User ------------------
export const unlockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.blocked = false;
    user.lockUntil = null;
    user.otpAttempts = 0;

    user.lockHistory.push({
      reason: "Unlocked by admin",
      lockedAt: new Date(),
      lockDuration: 0,
    });

    await user.save();

    res.json({ message: `User ${user.mobile} has been unlocked successfully.`, user });
  } catch (err) {
    console.error("Error unlocking user:", err);
    res.status(500).json({ error: "Failed to unlock user" });
  }
};


export const checkBlock = async (req, res) => {
  const { mobile } = req.query;
  if (!mobile) return res.status(400).json({ error: "mobile required" });

  const user = await User.findOne({ mobile });
  const now = Date.now();

  const blocked = !!user?.blocked;
  const tempLocked = !!(user?.lockUntil && user.lockUntil.getTime() > now);

  return res.json({
    blocked,
    tempLocked,
    lockUntil: user?.lockUntil || null,
  });
};


