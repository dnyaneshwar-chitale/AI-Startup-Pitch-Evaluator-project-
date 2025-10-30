import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

export async function getGeminiSummary(ideaDescription) {
  try {
    const prompt = `
You are an expert **Startup Evaluation AI**.

Analyze the following startup idea and return **only valid JSON** in this format (no extra text, markdown, or commentary):

{
  "summary": [
    "Existence Check: (Does a similar startup already exist? Give 1–2 examples if known, else say 'Not found')",
    "Current Market Status: (Is this industry growing, stable, or declining?)",
    "Future Potential (3–5 years): (YES/NO + short reason)",
    "Major Risks: (List 2–3 realistic risks)",
    "Key to Success: (1–2 main success factors)",
    "Common Mistakes or Failures: (1–2 frequent mistakes in such startups)"
  ],
  "scores": {
    "Innovation": number (0–100),
    "Market Potential": number (0–100),
    "Feasibility": number (0–100),
    "Team Strength": number (0–100),
    "Monetization Strategy": number (0–100),
    "Sustainability Impact": number (0–100)
  }
}

Rules:
- Be analytical and realistic.
- Use factual, logic-based numbers (not random).
- Keep JSON **strictly valid**.
- All scores between 0 and 100.

Startup Idea:
"${ideaDescription}"
`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const resultText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!resultText) throw new Error("No response from Gemini API");

    // 🧩 Extract and clean JSON part only
    const start = resultText.indexOf("{");
    const end = resultText.lastIndexOf("}") + 1;
    const jsonText = resultText.slice(start, end);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("⚠️ Failed to parse Gemini JSON:", jsonText);
      throw new Error("Invalid JSON returned by Gemini");
    }

    return parsed;
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    throw new Error("Gemini API request failed");
  }
}