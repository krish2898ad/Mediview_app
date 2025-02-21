import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("API Key is missing in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Fetch pain causes from Gemini & store under the user.
 */
export const getUserDiagnosis = async (req, res) => {
    try {
        const { symptoms } = req.body;  // ✅ Extract symptoms correctly
        const userId = req.userId;      // ✅ Extract userId from token middleware

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ error: "Symptoms are required." });
        }

        const prompt = `give me the diagnosis and ${symptoms} in short and cure in next line? `;

        // Try to generate content from Gemini AI
        const result = await model.generateContent(prompt).catch((err) => {
            console.error("Error generating content from Gemini AI:", err);
            return res.status(500).json({ error: "Error fetching response from Gemini AI." });
        });

        // Debugging the result structure
        console.log("AI Response Structure:", result);

        const response = result?.response;

        if (!response) {
            return res.status(500).json({ error: "No response from Gemini AI." });
        }

        // The response.text is actually a function, so we need to call it to get the actual response
        const causes = response.text ? response.text().trim() : "No data found.";

        // Fetch the user object from DB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Return the generated causes to the client
        res.json({ source: "Gemini AI", causes });
    } catch (error) {
        console.error("Error fetching pain causes:", error);
        res.status(500).json({ error: "Failed to retrieve pain causes. Please try again." });
    }
};
