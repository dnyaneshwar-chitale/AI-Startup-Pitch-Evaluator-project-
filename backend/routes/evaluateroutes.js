import express from "express";
import { getGeminiSummary } from "../utils/geminiClient.js";

export const evaluateRoutes = express.Router();

evaluateRoutes.post("/", async (req, res) => {
  try {
    const { ideaDescription } = req.body;

    if (!ideaDescription) {
      return res.status(400).json({ error: "ideaDescription is required" });
    }

    const result = await getGeminiSummary(ideaDescription);
    res.json(result); // ✅ sends summary + scores
  } catch (error) {
    console.error("❌ Evaluation API Error:", error.message);
    res.status(500).json({ error: "Failed to generate evaluation" });
  }
});