import mongoose from "mongoose";

const painQuerySchema = new mongoose.Schema({
    bodyParts: [String], // Example: ["knee", "shoulder"]
    response: String, // AI-generated response
    timestamp: { type: Date, default: Date.now } // Timestamp of query
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    painQueries: [painQuerySchema] // Stores multiple pain queries for each user
});

const User = mongoose.model("User", userSchema);
export default User;
