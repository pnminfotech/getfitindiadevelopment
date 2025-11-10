// import express from 'express';
// import upload from '../middlewares/upload.js';
// const router = express.Router();

// import { createVenue, deleteVenue, getAllVenue, updateVenue, getVenueById } from '../controllers/venueController.js';


// router.post("/", upload.single('image'), createVenue);  // add Venue
// router.get("/", getAllVenue); // Get All Venue
// router.put('/:id', upload.single('image'), updateVenue); //update venue

// router.delete("/:id", deleteVenue); // delete venue
// // routes/venueRoutes.js
// router.get("/:id", getVenueById);

// export default router;




// routes/venueRoutes.js
import express from 'express';
import upload from '../middlewares/upload.js';
import {
  createVenue, deleteVenue, getAllVenue, updateVenue, getVenueById
} from '../controllers/venueController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public reads (if you want them public)
router.get("/", getAllVenue);
router.get("/:id", getVenueById);

// Admin-only mutations
router.post("/",  authMiddleware("admin"), upload.single('image'), createVenue);
router.put("/:id", authMiddleware("admin"), upload.single('image'), updateVenue);
router.delete("/:id", authMiddleware("admin"), deleteVenue);

export default router;
