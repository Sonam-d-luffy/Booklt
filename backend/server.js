import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userLogin from "./routes/userRoutes.js";
import admin from "./routes/adminRoutes.js";
import exp from "./routes/expRoutes.js";
import promo from "./routes/promoRoute.js";
import book from "./routes/bookingRoute.js";

dotenv.config();

const app = express();

// ✅ Configure allowed frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // or your deployed URL

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Routes
app.use("/userLogin", userLogin);
app.use("/admin", admin);
app.use("/exp", exp);
app.use("/promo", promo);
app.use("/book", book);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Default route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
