import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; // Import the auth routes
import painRoutes from "./routes/PainRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Use the imported routes with a base path
app.use("/api/auth", authRoutes);
app.use("/api/pain", painRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
