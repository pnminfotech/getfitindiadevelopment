// // middlewares/authMiddleware.js
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } = process.env;

// if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
// if (!JWT_ISSUER) throw new Error("JWT_ISSUER is not set");
// if (!JWT_AUDIENCE) throw new Error("JWT_AUDIENCE is not set");

// const AUDIENCE = JWT_AUDIENCE.split(",").map(s => s.trim()).filter(Boolean);

// export const authMiddleware = (requiredRole = null) => {
//   return async (req, res, next) => {
//     const authHeader = req.headers.authorization || "";
//     if (!authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "No token provided" });
//     }
//     const token = authHeader.slice(7);

//     try {
//       const decoded = jwt.verify(token, JWT_SECRET, {
//         algorithms: ["HS256"],
//         issuer: JWT_ISSUER,
//         audience: AUDIENCE.length === 1 ? AUDIENCE[0] : AUDIENCE,
//         clockTolerance: 5,
//       });

//       const user = await User.findById(decoded.id);
//       if (!user) return res.status(401).json({ error: "User not found" });
//       if (user.blocked) return res.status(403).json({ error: "Your account is blocked" });

//       if (decoded.role && decoded.role !== user.role) {
//         return res.status(403).json({ error: "Role mismatch" });
//       }

//       if (requiredRole) {
//         if (requiredRole === "user" && !["user", "admin"].includes(user.role)) {
//           return res.status(403).json({ error: "Forbidden" });
//         }
//         if (requiredRole === "admin" && user.role !== "admin") {
//           return res.status(403).json({ error: "Forbidden" });
//         }
//       }

//       req.user = user;
//       req.auth = decoded;
//       next();
//     } catch (err) {
//       console.error("JWT verify error:", err.message);
//       return res.status(401).json({ error: "Invalid token" });
//     }
//   };
// };



// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import CourtOwner from "../models/courtOwnerModel.js";

const { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } = process.env;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
if (!JWT_ISSUER) throw new Error("JWT_ISSUER is not set");
if (!JWT_AUDIENCE) throw new Error("JWT_AUDIENCE is not set");

const AUDIENCE = JWT_AUDIENCE.split(",").map(s => s.trim()).filter(Boolean);

/**
 * Universal Auth Middleware
 * Supports: user / admin / court_owner
 * @param {string|null} requiredRole - e.g. "user", "admin", "court_owner" or null
 */
export const authMiddleware = (requiredRole = null) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: JWT_ISSUER,
        audience: AUDIENCE.length === 1 ? AUDIENCE[0] : AUDIENCE,
        clockTolerance: 5,
      });

      // Identify role
      const role = decoded.role || "user";
      let actor = null;

      if (role === "court_owner") {
        actor = await CourtOwner.findById(decoded.id);
      } else {
        actor = await User.findById(decoded.id);
      }

      if (!actor) {
        return res.status(401).json({ error: "Account not found" });
      }

      // Blocked user check (only in User model)
      if (role !== "court_owner" && actor.blocked) {
        return res.status(403).json({ error: "Your account is blocked" });
      }

      // Role consistency check
      if (decoded.role && decoded.role !== role) {
        return res.status(403).json({ error: "Role mismatch" });
      }

      // Required role enforcement
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];

        if (!allowedRoles.includes(role)) {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      // Attach to request
      req.user = actor;
req.user.role = role; // ✅ attach the role from decoded token
req.auth = decoded;

      next();
    } catch (err) {
      console.error("JWT verify error:", err.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};