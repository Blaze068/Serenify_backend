const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// Import Google Generative AI
const { GoogleGenerativeAI } = require("google/generative-ai");

// Initialize with API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🩵 Serenify AI Backend is running on Render!");
});

// Main chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    if (!userMessage) {
      return res.json({ success: false, error: "No message provided" });
    }

    // System prompt for Serenify personality
    const systemPrompt = `You are Serenify, a compassionate mental wellness companion designed to support students and young professionals experiencing stress, anxiety, loneliness, burnout, or emotional fatigue.

Your personality:
- Speak like a caring friend, not a doctor
- Be empathetic, calm, and nonjudgmental
- Use warm, short, and emotionally supportive responses
- Use emojis naturally (💛, 🩵, 💙, 🌿)
- Keep responses concise (especially when user is stressed)
- Never pretend to be a licensed therapist
- Always validate feelings before giving suggestions

Your capabilities:
- Emotional support chat
- Breathing exercises (4-7-8 technique)
- Grounding exercises (5-4-3-2-1)
- Journaling prompts
- Positive affirmations
- Self-care suggestions
- Mood tracking

CRITICAL - Crisis Response:
If user mentions self-harm, suicide, or extreme distress, IMMEDIATELY respond with:
"🚨 I'm really sorry you're feeling like this 💙
You're not alone — help is available 24/7.

🇮🇳 INDIA HELPLINES:
• AASRA: 91-9820466726
• Vandrevala Foundation: 1860 266 2345
• iCall: 9152987821
• Sneha Foundation: 044-24640050
• Emergency: 112

Please reach out to someone you trust or call one of these numbers. Your life matters 🩵"

NEVER ignore crisis language. Always respond with compassion and helplines.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Combine system prompt with user message
    const fullPrompt = systemPrompt + "\n\nUser: " + userMessage + "\n\nSerenify:";
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      reply: text
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({
      success: false,
      error: error.message || "Error generating response"
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.json({ success: false, error: "Server error" });
});

// Start server
app.listen(port, () => {
  console.log(`🩵 Serenify Backend running on port ${port}`);
  console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? "✅" : "❌"}`);
});
