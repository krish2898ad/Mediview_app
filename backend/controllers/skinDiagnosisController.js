const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;

// Convert Image to Base64
function encodeImageToBase64(filePath) {
    const imageBuffer = fs.readFileSync(filePath);
    return imageBuffer.toString("base64");
}

// Diagnose Skin Disease
exports.analyzeSkinDisease = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });

        const base64Image = encodeImageToBase64(req.file.path);

        const requestData = {
            contents: [
                {
                    parts: [
                        { text: "Analyze this image and detect any possible skin disease." },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
        };

        const response = await axios.post(GEMINI_URL, requestData, {
            headers: { "Content-Type": "application/json" },
        });

        // Remove uploaded file after processing
        fs.unlinkSync(req.file.path);

        res.json({ diagnosis: response.data });
    } catch (error) {
        console.error("Error in diagnosis:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to analyze image" });
    }
};
