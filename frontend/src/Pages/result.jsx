import React, { useRef, useEffect } from "react";
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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 100,
      bottom:100,
      left: 111,
      right: 111,
    },
  },
  scales: {
    r: {
      angleLines: { color: "rgba(0, 0, 0, 0.1)" },
      grid: { color: "rgba(0, 0, 0, 0.05)" },
      pointLabels: {
        display: true,
        font: (ctx) => {
          const width = window.innerWidth;
          return {
            size: width < 480 ? 9 : width < 768 ? 11 : 13,
            weight: "bold",
          };
        },
        color: "#333",
        padding: (ctx) => {
          const width = window.innerWidth;
          return width < 480 ? 40 : width < 768 ? 45 : 50;
        },
      },
      ticks: { display: false },
      min: 0,
      max: 100,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};




function Ai() {
  const location = useLocation();
  const navigate = useNavigate();
  const chartRef = useRef(null);

  // ✅ Dynamic summary & scores
  const summaryText = location.state?.summaryText || "No summary available.";
  const scores = location.state?.scores || {
    Innovation: 50,
    "Market Potential": 50,
    Feasibility: 50,
    "Team Strength": 50,
    "Monetization Strategy": 50,
    "Sustainability Impact": 50,
  };

  // ✅ Use dynamic data with values in labels
  const data1 = {
    labels: Object.keys(scores).map(
      (key) => `${key} (${scores[key] ?? 0})`
    ),
    datasets: [
      {
        label: "",
        data: Object.values(scores),
        backgroundColor: "rgba(102, 140, 221, 0.4)",
        borderColor: "rgba(102, 140, 221, 1)",
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  // ✅ Chart responsive resize fix
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartRef.current.resize) {
        chartRef.current.resize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ PDF Download (same as before)
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
    const lines = Array.isArray(summaryText)
      ? summaryText.map((p, i) => `${i + 1}. ${p}`)
      : [summaryText];
    const split = pdf.splitTextToSize(lines.join("\n\n"), 180);
    pdf.text(split, margin, y);

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
            <div className="chartWrapper" style={{ width: "100%", height: "500px" }} >
              <Radar ref={chartRef} data={data1} options={options} />
            </div>
          </div>
        </div>

        <div className="rightBox">
          <h3 className="subtitle">Gemini AI Feedback Summary</h3>
          <div className="summary-box">
            {Array.isArray(summaryText) ? (
              summaryText.map((item, idx) => (
                <div key={idx}>
                  <strong>{idx + 1}.</strong> {item}
                </div>
              ))
            ) : (
              <p>{summaryText}</p>
            )}
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
