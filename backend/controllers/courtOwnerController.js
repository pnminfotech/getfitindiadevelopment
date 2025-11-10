import CourtOwner from "../models/courtOwnerModel.js";
import VenueModel from "../models/VenueModel.js";
import { issueCourtOwnerToken } from "../utils/tokenService.js";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// Register
export const registerCourtOwner = async (req, res) => {
  try {
    const { name, email, phone, password, businessName } = req.body;

    const existing = await CourtOwner.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const owner = await CourtOwner.create({
      name,
      email,
      phone,
      password,
      businessName,
    });

    res.status(201).json({
      success: true,
      token: issueCourtOwnerToken(owner._id),
      owner,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginCourtOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await CourtOwner.findOne({ email });
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const isMatch = await owner.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      success: true,
      token: issueCourtOwnerToken(owner._id),
      owner,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const owner = await CourtOwner.findById(req.user._id).select("-password");
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const updated = await CourtOwner.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Venues for logged-in owner
export const getOwnerVenues = async (req, res) => {
  try {
    // const venues = await VenueModel.find({ ownerId: req.user._id });
    const venues = await VenueModel.find({
  ownerId: req.user._id,
  deleted: { $ne: true },
});

    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update Venue (Court Owner)
export const updateOwnerVenue = async (req, res) => {
  try {
    const venue = await VenueModel.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    if (!venue)
      return res.status(404).json({ message: "Venue not found or unauthorized" });

    const { name, city, location, pricing, description, sports, amenities } = req.body;

    if (location) {
      venue.location = {
        address: location.address || venue.location.address,
        lat: parseFloat(location.lat) || venue.location.lat,
        lng: parseFloat(location.lng) || venue.location.lng,
      };
    }

    venue.name = name || venue.name;
    venue.city = city || venue.city;
    venue.pricing = pricing || venue.pricing;
    venue.description = description || venue.description;
    venue.sports = sports ? sports.split(",").map((s) => s.trim()) : venue.sports;
    venue.amenities = amenities ? amenities.split(",").map((s) => s.trim()) : venue.amenities;

    // ✅ Handle image upload safely
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const newName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
      const output = path.join("uploads", newName);

      try {
        await sharp(req.file.path).toFile(output);
        await fs.unlink(req.file.path); // delete temp file
      } catch (err) {
        console.error("Image processing failed:", err);
      }

      // Delete old image if exists
      if (venue.image) {
        const oldPath = path.join("uploads", venue.image);
        try {
          await fs.unlink(oldPath);
        } catch {
          console.warn("Old image not found or already deleted");
        }
      }

      venue.image = newName;
    }

    const saved = await venue.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update venue" });
  }
};


// Delete Venue (Court Owner)
export const deleteOwnerVenue = async (req, res) => {
  try {
   const venue = await VenueModel.findOne({
  _id: req.params.id,
  ownerId: req.user._id,
});
if (!venue)
  return res.status(404).json({ message: "Venue not found or unauthorized" });

venue.deleted = true;
await venue.save();

res.json({ success: true, message: "Venue marked as deleted" });

    if (!venue) return res.status(404).json({ message: "Venue not found or unauthorized" });

    // delete image
    if (venue.image) {
      const imgPath = path.join("uploads", venue.image);
      try {
        await fs.unlink(imgPath);
      } catch (err) {
        console.warn("Image not found or already deleted:", imgPath);
      }
    }

    res.json({ success: true, message: "Venue deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete venue" });
  }
};


