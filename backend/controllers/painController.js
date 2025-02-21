import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Fetch pain causes from Gemini & store under the user.
 */
export const getPainCauses = async (req, res) => {
    try {
        const { parts } = req.body;
        const userId = req.userId; // Extract userId from token middleware

        if (!parts) {
            return res.status(400).json({ error: "Body parts are required." });
        }
        console.log({parts});
        const prompt = `What are the possible causes of pain in the ${parts}? Limit the response to 20 words.`;

        const result = await model.generateContent(prompt).catch((err) => {
            console.error("Error generating content from Gemini AI:", err.message); // Log error message
            return res.status(500).json({ error: "Error fetching response from Gemini AI." });
        });

        // Debugging the result structure
        console.log("AI Response Structure:", result);
        const response = await result.response;
        // Ensure you handle result response correctly (it should be a string or object with 'text' method)
        const causes = response.text() || "No data found.";

        // Fetch the user object from DB
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ error: "User not found." });
                }
        console.log(causes);
        res.json({ source: "Gemini AI", causes });
    } catch (error) {
        console.error("Error fetching pain causes:", error);
        res.status(500).json({ error: "Failed to retrieve pain causes. Please try again." });
    }
};
