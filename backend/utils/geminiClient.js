import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ✅ Use correct model and API version
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const API_KEY = process.env.GEMINI_API_KEY;

export async function getGeminiSummary(ideaDescription) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an expert startup evaluator AI.

Your task is to check and analyze the following startup idea in clear, simple, and well-spaced text (not paragraph form).

Before analysis, first verify if this startup name or concept already exists anywhere (companies, apps, or websites). Be factual and honest — if you are unsure, say “unclear” instead of guessing.

Output in the following format with clean spacing between each point:

1️⃣ Existence Check (Already Exists or Not)**  
- Check whether a startup with this name or similar idea already exists.  
- Mention 2-3 examples (if found) and their current status (successful, moderate, struggling).  
- If not found, clearly say: “No existing startups found with this name or concept.”

2️⃣ Current Market Status 
- Explain if this idea or industry is currently trending, growing, or declining.  
- Mention one recent market pattern or consumer trend related to it.

3️⃣ Future Potential (Next 3-5 Years) 
- Answer clearly: YES or NO — can this idea succeed?  
- Give one short, practical reason for your answer.

4️⃣ Main Risks  
- Risk 1: (simple, realistic)  
- Risk 2: (simple, realistic)  
- Risk 3: (simple, realistic)

5️⃣ Final Verdict 
- Clearly say: “This startup idea is likely to work” OR “This startup idea is unlikely to work.”  
- Add one line explaining why you reached this conclusion.

Startup Idea:  
{{ideaDescription}}



Idea: ${ideaDescription}`,
              },
            ],
          },
        ],
      }
    );

    // ✅ Correct path to extract the model response
    const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) throw new Error("No summary returned by Gemini");

    return summary;
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    throw new Error("Gemini API request failed");
  }
}