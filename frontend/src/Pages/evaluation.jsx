import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./evaluation.css";

function Evaluation() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEvaluate = async () => {
    if (!idea.trim()) {
      alert("Please enter a startup idea!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://ai-startup-pitch.onrender.com/api/evaluate", {
        ideaDescription: idea,
      });

      const result = res.data;
      navigate("/result", {
        state: {
          summaryText: result.summary,
          scores: result.scores,
        },
      });
    } catch (error) {
      console.error("❌ Evaluation failed:", error);
      alert("Error evaluating idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evaluation-page">
      <div className="evaluation-container">
        <h1 className="evaluation-title"> Startup Evaluator 🚀</h1>
        <p className="evaluation-subtitle">
          Share your startup vision and discover how far it can go.
        </p>

        <textarea
          placeholder="Describe your startup idea here..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="evaluation-input"
        />

              <button
  onClick={handleEvaluate}
  disabled={loading}
  className={`evaluation-btn ${loading ? "loading" : ""}`}
>
  {loading ? (
    <span className="btn-loading">
      <span className="spinner"></span>
      Generating...
    </span>
  ) : (
    "Generate Evaluation"
  )}
</button>
      </div>
    </div>
  );
}

export default Evaluation;
