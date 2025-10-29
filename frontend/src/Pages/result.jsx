import React from "react";
import "../Pages/result.css";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import data from "../Pages/result.json";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data1 = {
  labels: [
    "Innovation",
    "Market Potential",
    "Feasibility",
    "Team Strength",
    "Monetization Strategy",
    "Sustainability Impact",
  ],
  datasets: [
    {
      label: "",
      data: [22, 30, 34, 53, 29, 30],
      backgroundColor: "rgba(102, 140, 221, 0.4)",
      borderColor: "rgba(102, 140, 221, 1)",
      pointRadius: 3,
      borderWidth: 2,
    },
  ],
};

const options = {
  layout: { padding: 30 },
  scales: {
    r: {
      angleLines: { color: "rgba(0, 0, 0, 0.1)" },
      grid: { color: "rgba(0, 0, 0, 0.05)" },
      pointLabels: {
        display: true,
        font: { size: 13, weight: "bold" },
        color: "#333",
        padding: 25,
      },
      ticks: { display: false },
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  maintainAspectRatio: false,
};

function Ai() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ summaryText from Evaluation.jsx
  const summaryText = location.state?.summaryText || "No summary available.";

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text(data.title, 105, y, { align: "center" });
    y += 15;

    const chartElement = document.querySelector(".chartBox");
    if (chartElement) {
      const canvas = await html2canvas(chartElement, { scale: 2 });
      const chartImage = canvas.toDataURL("image/png");
      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(chartImage, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Gemini AI Feedback Summary", margin, y);
    y += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    const splitText = pdf.splitTextToSize(summaryText, 180);
    pdf.text(splitText, margin, y);
    y += 8 * (splitText.length || 1);

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(data.footer, 105, 285, { align: "center" });

    pdf.save("AI_Evaluation_Report.pdf");
  };

  return (
    <div className="page">
      <h1 className="titles">{data.title}</h1>

      <div className="cardContainer">
        <div className="leftBox">
          <h3 className="subtitle">{data.sections[0].heading}</h3>
          <div className="chartBox">
            <Radar data={data1} options={options} />
          </div>
        </div>

        <div className="rightBox">
          <h3 className="subtitle">Gemini AI Feedback Summary</h3>
          <div className="summary-box">
            <p>{summaryText}</p> {/* ✅ Summary दिसेल */}
          </div>
        </div>
      </div>

      <div className="buttonRow">
        <button className="secondaryBtn" onClick={downloadPDF}>
          <FaDownload style={{ marginRight: "8px" }} />
          Download PDF Report
        </button>

        <button className="primaryBtn" onClick={() => navigate("/")}>
          Evaluate Another Idea
        </button>
      </div>

      <footer className="footer">{data.footer}</footer>
    </div>
  );
}

export default Ai;
