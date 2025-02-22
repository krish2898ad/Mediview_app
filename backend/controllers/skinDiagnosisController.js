import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import axios from "axios";
import fs from "fs";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



const encodeImageToBase64=(filePath)=> {
    const imageBuffer = fs.readFileSync(filePath);
    return imageBuffer.toString("base64");
}



/**
 * Diagnose skin disease using Gemini AI
 */
export const analyzeSkinDisease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        // Get base64 encoded image
        const base64Image = encodeImageToBase64(req.file.path);

        // Prepare request for Gemini API
        const prompt = `Analyze this image and detect any possible skin disease: ${base64Image}`;

        // Generate response from Gemini
        const result = await model.generateContent(prompt).catch((err) => {
            console.error("Error generating content from Gemini AI:", err.message);
            return res.status(500).json({ error: "Error fetching response from Gemini AI." });
        });

        // Extract and process the result
        const response = result.response;
        const diagnosis = response ? response.text() : "No diagnosis available.";

        // Store the diagnosis in the user's profile if needed
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        user.skinDiagnosis = diagnosis;
        await user.save();

        // Remove uploaded file after processing
        fs.unlinkSync(req.file.path);

        res.json({ source: "Gemini AI", diagnosis });
    } catch (error) {
        console.error("Error in diagnosis:", error);
        res.status(500).json({ error: "Failed to analyze skin disease. Please try again." });
    }
};
