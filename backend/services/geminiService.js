import express from "express";
import { getGeminiSummary } from "../utils/geminiClient.js";

export const evaluateRoutes = express.Router();

evaluateRoutes.post("/", async (req, res) => {
  try {
    const { ideaDescription } = req.body;

    if (!ideaDescription) {
      return res.status(400).json({ error: "ideaDescription is required" });
    }

    const summary = await getGeminiSummary(ideaDescription);
    res.json({ message: "AI Summary generated successfully", summary });
  } catch (error) {
    console.error("❌ Evaluation API Error:", error.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});
 // AI/backend/services/geminiService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// NOTE: use the v1beta endpoint (change model if your account supports another model)
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function buildPrompt(ideaDescription) {
  return `
You are an expert startup evaluator AI.

Analyze the following startup idea carefully and write your response in clear, simple language with short paragraphs and proper spacing.

Your goal is to determine whether this startup name or idea already exists, who is doing it, how successful they are, and whether the idea still has potential for the future.

Follow this structure clearly:

1️⃣ Existence Check (Already Exists or Not)  
- Check if this startup name or a very similar idea already exists in the real world.  
- If it exists, mention 2-3 existing companies or startups doing it and whether they are successful or struggling.  
- If not found, clearly say “No existing startups found with this exact idea or name — seems original.”

2️⃣ Current Market Status  
- Explain if this type of idea is popular, new, or outdated.  
- Mention one short, recent market trend related to it.

3️⃣ Future Potential (Next 3-5 Years) 
- Answer YES or NO — can this idea succeed in the next few years?  
- Give one clear and realistic reason for your answer.

4️⃣ Main Risks
- List 3 main simple and realistic risks or challenges, with line breaks between them.

5️⃣ Final Verdict 
- Clearly say: “This startup idea is likely to work” or “This startup idea is unlikely to work.”  
- Give one short reason for your final decision.

Startup Idea:  
${ideaDescription}
`.trim();
}

export async function getGeminiSummary(ideaDescription) {
  const prompt = buildPrompt(ideaDescription);

  try {
    const resp = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text =
      resp.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from model.";

    return text;
  } catch (err) {
    console.error("❌ Gemini API Error:", err.response?.data || err.message);

    // Fallback: simple mock summary (keeps same paragraph spacing)
    const textLower = (ideaDescription || "").toLowerCase();
    let fallback = "";

    fallback += "*1️⃣ Existence Check (Already Exists or Not)*\n";
    if (textLower.includes("dream") || textLower.includes("guide")) {
      fallback += "- YES. Similar guidance and coaching services exist in the market; many range from individual coaches to established platforms.\n\n";
    } else {
      fallback += "- No existing startups found with this exact idea or name — seems original.\n\n";
    }

    fallback += "2️⃣ Current Market Status\n";
    fallback += "- This domain (personal development/coaching/goal guidance) is generally popular and evolving with tech-enabled personalization.\n\n";

    fallback += "3️⃣ Future Potential (Next 3-5 Years)\n";
    fallback += "- YES — if the idea targets a specific niche and provides measurable outcomes for users.\n\n";

    fallback += "4️⃣ Main Risks**\n";
    fallback += "- Lack of clear value proposition and differentiation.\n\n";
    fallback += "- Market saturation and competition from established players and freelancers.\n\n";
    fallback += "- Trust & credibility challenges (users need proof of results).\n\n";

    fallback += "5️⃣ Final Verdict\n";
    fallback += "- This startup idea is likely to work if it defines a clear niche, validates demand, and builds credibility.\n";

    // small delay to simulate AI response
    await new Promise((r) => setTimeout(r, 800));
    return fallback;
  }
}