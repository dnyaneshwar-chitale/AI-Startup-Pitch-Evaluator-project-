import express from "express";
import { getChatResponse } from "../utils/geminiChat.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiReply = await getChatResponse(message);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ Chat API Error:", error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

export default router;