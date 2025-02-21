import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date }, // Ensures a proper date format
    gender: { type: String, enum: ["Male", "Female", "Other"] }, // Restricts values to valid gender options
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
