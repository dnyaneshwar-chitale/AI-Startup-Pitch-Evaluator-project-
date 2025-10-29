import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { evaluateRoutes } from "./routes/evaluateroutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/evaluate", evaluateRoutes); 
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});