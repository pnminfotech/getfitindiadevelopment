// routes/msg91Webhook.js
import express from "express";
const r = express.Router();

r.post("/webhooks/msg91/otp", express.json(), async (req, res) => {
  console.log("MSG91 DLR:", req.body);
  // Optionally store to DB with request_id, mobile, status, error_code, desc
  res.sendStatus(200);
});
export default r;
