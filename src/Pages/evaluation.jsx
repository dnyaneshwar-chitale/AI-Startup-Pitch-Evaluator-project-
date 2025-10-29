import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Pages/evaluation.css";

const Evaluation = () => {
  const [idea, setIdea] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!idea.trim()) {
      alert("Please describe your startup idea first!");
      return;
    }

    const summary =
      "This startup idea focuses on solving a major user problem with a unique solution and strong market potential.";

    setAiSummary(summary);

    // Navigate and pass data
    navigate("/result", { state: { idea  } });
  };

  return (
    <div className="startup-container">
      <div className="form-card">
        <h2 className="startup">Your Startup Idea</h2>
        <textarea
          className="idea-input"
          placeholder="Describe your innovative startup idea in detail..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <Link to="/result">
        <button className="generate-btn" onClick={handleSubmit}>
          Generate AI Summary
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Evaluation;
