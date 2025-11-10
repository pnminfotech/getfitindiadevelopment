import mongoose from "mongoose";

// Connect to MongoDB (no extra options needed in driver v4+)
mongoose.connect("mongodb://127.0.0.1:27017/test");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");

  // Remove documents with email null
  const result1 = await db.collection("users").deleteMany({ email: null });
  console.log("Deleted documents with email:null ->", result1.deletedCount);

  // Drop old email index
  try {
    await db.collection("users").dropIndex("email_1");
    console.log("Dropped old email index");
  } catch (err) {
    console.log("No old email index found, skipping drop");
  }

  // Create partial unique index
  await db.collection("users").createIndex(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $exists: true, $ne: null } } }
  );
  console.log("Created partial unique index on email");

  mongoose.connection.close();
});
