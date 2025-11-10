import mongoose from "mongoose";
import User from "./models/User.js"; // adjust path to your User model

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://pnminfotech24:W8rOx9nWFbgq10Td@fitindia.dgwsqtk.mongodb.net/?retryWrites=true&w=majority&appName=FitIndia";
async function fixIndexes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get current indexes
    const indexes = await User.collection.getIndexes();
    console.log("📌 Current indexes:", indexes);

    // If old email_1 index exists, drop it
    if (indexes.email_1) {
      console.log("⚠️ Dropping old email_1 index...");
      await User.collection.dropIndex("email_1");
      console.log("✅ Dropped old email_1 index");
    }

    // Create correct partial unique index for email
    console.log("🔄 Creating new partial index for email...");
    await User.collection.createIndex(
      { email: 1 },
      {
        unique: true,
        partialFilterExpression: { email: { $type: "string" } }
      }
    );
    console.log("✅ Created partial unique index for email");

    // Ensure other indexes (like mobile) are in sync with schema
    await User.syncIndexes();
    console.log("✅ Synced all indexes from schema");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing indexes:", err);
    process.exit(1);
  }
}

fixIndexes();
