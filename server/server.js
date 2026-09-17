const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let lastRequestTime = 0;
const REQUEST_COOLDOWN = 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/ask", async(req, res) => {

    const now = Date.now();

    if (now - lastRequestTime < REQUEST_COOLDOWN) {
        return res.status(429).json({
            error: "Please wait a few seconds before asking again.",
        });
    }

    lastRequestTime = now;
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                error: "Topic is required",
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: `Explain "${topic}" in very simple language for a student.

Use plain text only.
Do not use Markdown symbols.
Do not use asterisks, hashtags, or code fences.
Use short headings and simple examples.
Keep the explanation concise and easy to understand.`,
        });

        res.json({
            answer: response.text,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong while asking Gemini.",
        });
    }
});

app.post("/api/quiz", async(req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                error: "Topic is required",
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: `Create exactly 5 multiple choice questions about "${topic}".

Return ONLY valid JSON in this format:
[
  {
    "question": "Question here",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  }
]

The answer must be the index of the correct option (0, 1, 2, or 3).
Keep questions simple and suitable for students.`,
        });

        const quiz = JSON.parse(response.text);

        res.json({ quiz });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Could not generate quiz.",
        });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`StudyMate backend running on port ${PORT}`);
});