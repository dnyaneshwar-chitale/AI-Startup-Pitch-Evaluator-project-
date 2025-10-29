import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_CHAT_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent";

export async function getChatResponse(userMessage) {
  try {
    const prompt = `You are a helpful AI chatbot. Reply conversationally to the user.

User: ${userMessage}
AI:`;

    const response = await axios.post(
      GEMINI_CHAT_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a response."
    );
  } catch (error) {
    console.error("❌ Gemini Chat API Error:", error.response?.data || error.message);
    throw new Error("Gemini Chat API request failed");
  }
}