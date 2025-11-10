// import jwt from "jsonwebtoken";

// const need = (k) => {
//   const v = process.env[k];
//   if (!v) throw new Error(`${k} is not set`);
//   return v;
// };

// export const generateToken = (userId, opts = {}) => {     // default {}
//   const { role = "user", extra = {} } = opts;              // default "user"

//   const JWT_SECRET   = need("JWT_SECRET");
//   const JWT_ISSUER   = need("JWT_ISSUER");
//   const JWT_AUDIENCE = need("JWT_AUDIENCE");

//   return jwt.sign(
//     { id: userId, role, ...extra },
//     JWT_SECRET,
//     {
//       algorithm: "HS256",
//       expiresIn: "7d",
//       issuer: JWT_ISSUER,
//       audience: JWT_AUDIENCE,
//     }
//   );
// };








// tokenService.js
import jwt from "jsonwebtoken";

const need = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`${k} is not set`);
  return v;
};

const parseAudience = (aud) => {
  if (Array.isArray(aud)) return aud.filter(Boolean);
  if (typeof aud === "string") return aud.split(",").map(s => s.trim()).filter(Boolean);
  return [];
};

// Default expiries by role (override with opts.expiresIn)
const DEFAULT_EXP_BY_ROLE = {
  user: "7d",
  coach: "7d",
  court_owner: "7d",
  admin: "1d",
};

/**
 * Generate a signed JWT.
 * @param {string} subjectId - Mongo _id of the actor
 * @param {{ role?: "user"|"coach"|"court_owner"|"admin", extra?: object, expiresIn?: string, audience?: string|string[], algorithm?: string, jti?: string }} opts
 */
export const generateToken = (subjectId, opts = {}) => {
  const {
    role = "user",
    extra = {},
    expiresIn,
    audience,                // optional override; can be CSV or array
    algorithm = "HS256",
    jti,                     // optional token id
  } = opts;

  const JWT_SECRET   = need("JWT_SECRET");
  const JWT_ISSUER   = need("JWT_ISSUER");
  const JWT_AUDIENCE = need("JWT_AUDIENCE");

  const aud = parseAudience(audience ?? JWT_AUDIENCE);

  const payload = { id: subjectId, role, ...extra };
  const signOpts = {
    algorithm,
    expiresIn: expiresIn || DEFAULT_EXP_BY_ROLE[role] || "7d",
    issuer: JWT_ISSUER,
    audience: aud.length === 1 ? aud[0] : aud,
    subject: String(subjectId),
  };
  if (jti) signOpts.jwtid = jti;

  return jwt.sign(payload, JWT_SECRET, signOpts);
};

/**
 * Verify a JWT using the same constraints as authMiddleware.
 * Returns { valid: boolean, decoded?: object, error?: string }
 */
export const verifyToken = (token) => {
  const JWT_SECRET   = need("JWT_SECRET");
  const JWT_ISSUER   = need("JWT_ISSUER");
  const JWT_AUDIENCE = need("JWT_AUDIENCE");

  const aud = parseAudience(JWT_AUDIENCE);

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: aud.length === 1 ? aud[0] : aud,
      clockTolerance: 5,
    });
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

// Optional convenience wrappers
export const issueUserToken        = (id, extra = {}) => generateToken(id, { role: "user",        extra });
export const issueCoachToken       = (id, extra = {}) => generateToken(id, { role: "coach",       extra });
export const issueCourtOwnerToken  = (id, extra = {}) => generateToken(id, { role: "court_owner", extra });
export const issueAdminToken       = (id, extra = {}) => generateToken(id, { role: "admin",       extra });
