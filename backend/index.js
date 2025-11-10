// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import { authMiddleware } from "./middlewares/authMiddleware.js";
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { getMe, updateMe, updateUserLocation } from "./controllers/userController.js";

// import venueRoutes from './routes/venueRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import msg91Webhook from "./routes/msg91Webhook.js";

// import ConnectDb from './config/db.js';
// import slotRoutes from './routes/slotRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
// import blockRouter from './routes/blockRouter.js';
// import paymentRouter from './routes/paymentRoutes.js';

// // import adminRoutes from "./routes/adminRoutes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send("Hello From Server");
// });

// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // // HEAD
// // app.use('/api/venues', venueRoutes);  // Routes for venue management
// // app.use("/api/slots", slotRoutes);  // Routes for Slot Management

// // app.use('/api/venues', venueRoutes);
// // app.use('/api/auth', authRoutes);       
// // app.use('/api/users', userRoutes);   
// // app.use("/api/bookings", bookingRoutes); 
// // app.use('/api/block', blockRouter);  
// // app.use("/api/payments", paymentRouter);


// // Public
// app.use('/api/auth', authRoutes);         

// app.use("/", msg91Webhook);
// // 1) User-only “me” endpoints (mounted first)
// app.get("/api/users/me",        authMiddleware("user"), getMe);
// app.put("/api/users/me",        authMiddleware("user"), updateMe);
// app.post("/api/users/location", authMiddleware("user"), updateUserLocation);        // login/otp
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // app.use("/api/admin", adminRoutes);
// // Admin-only groups
// app.use('/api/venues', venueRoutes);  // create/update/delete venue
// app.use('/api/slots',  slotRoutes);   // court CRUD
// app.use('/api/users',   authMiddleware("admin"), userRoutes);   // list users, block/unblock
// app.use('/api/block',   blockRouter);  // block slots/courts
// // If you expose “all bookings” for admins, that route is protected inside bookingRoutes

// // User-only groups
// app.use('/api/bookings', authMiddleware(), bookingRoutes); // create-order, confirm-payment, mybookings, cancel
// app.use('/api/payments', authMiddleware("user"), paymentRouter); // order, verify

// // (Removed the duplicate /api/venues mount)
// //  dc113a7d2ba3c4c9c43a4b6727cc2f3dc19feddd
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ error: "Internal server error" });
// });

// const port = process.env.PORT || 3000;
// app.listen(port, async () => {
//   console.log(`Server is running at http://localhost:${port}`);
//   await ConnectDb();  // Ensure DB connects after server starts
// });





import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { authMiddleware } from "./middlewares/authMiddleware.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMe, updateMe, updateUserLocation } from "./controllers/userController.js";

import venueRoutes from './routes/venueRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import msg91Webhook from "./routes/msg91Webhook.js";

import ConnectDb from './config/db.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import blockRouter from './routes/blockRouter.js';
import paymentRouter from './routes/paymentRoutes.js';

// import adminRoutes from "./routes/adminRoutes.js";


import courtOwnerBookingRoutes from "./routes/courtOwnerBookingRoutes.js";

import courtOwnerRoutes from "./routes/courtOwnerRoutes.js";   // ✅ import here
import courtOwnerUserRoutes from "./routes/courtOwnerUserRoutes.js";

import courtOwnerBlockedSlotRoutes from "./routes/courtOwnerBlockedSlotRoutes.js";
import courtOwnerReportRoutes from "./routes/courtOwnerReportRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello From Server");
});

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // HEAD
// app.use('/api/venues', venueRoutes);  // Routes for venue management
// app.use("/api/slots", slotRoutes);  // Routes for Slot Management

// app.use('/api/venues', venueRoutes);
// app.use('/api/auth', authRoutes);       
// app.use('/api/users', userRoutes);   
// app.use("/api/bookings", bookingRoutes); 
// app.use('/api/block', blockRouter);  
// app.use("/api/payments", paymentRouter);


// Public
app.use('/api/auth', authRoutes);         

app.use("/", msg91Webhook);
// 1) User-only “me” endpoints (mounted first)
app.get("/api/users/me",        authMiddleware("user"), getMe);
app.put("/api/users/me",        authMiddleware("user"), updateMe);
app.post("/api/users/location", authMiddleware("user"), updateUserLocation);        // login/otp
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("/api/admin", adminRoutes);
// Admin-only groups
app.use('/api/venues', venueRoutes);  // create/update/delete venue
app.use('/api/slots',  slotRoutes);   // court CRUD
app.use('/api/users',   authMiddleware("admin"), userRoutes);   // list users, block/unblock
app.use('/api/block',   blockRouter);  // block slots/courts
// If you expose “all bookings” for admins, that route is protected inside bookingRoutes

// User-only groups
app.use('/api/bookings', authMiddleware(), bookingRoutes); // create-order, confirm-payment, mybookings, cancel
app.use('/api/payments', authMiddleware("user"), paymentRouter); // order, verify



app.use("/api/courtowner/bookings", courtOwnerBookingRoutes);

app.use("/api/courtowner", courtOwnerRoutes);   // <-- IMPORTANT

app.use("/api/courtowner", courtOwnerUserRoutes);
app.use("/api/courtowner/blockslots", courtOwnerBlockedSlotRoutes);

app.use("/api/courtowner/reports", courtOwnerReportRoutes);




// (Removed the duplicate /api/venues mount)
//  dc113a7d2ba3c4c9c43a4b6727cc2f3dc19feddd
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await ConnectDb();  // Ensure DB connects after server starts
});
