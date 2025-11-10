import express from 'express';
const { loginAdmin, getBookings } = require("../controllers/adminController");
const router = express.Router();

router.post("/login", loginAdmin);
router.get("/bookings", getBookings); // protected

module.exports = router;
