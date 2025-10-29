import React, { useState, createContext, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import IdeaPitchComponent from "./Pages/IdeaPitchComponent";
import Evaluation from "./Pages/evaluation.jsx";
import Result from "./Pages/result";

// 🌀 Loading Context तयार
const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);

function LoadingOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #ccc",
          borderTopColor: "#007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {loading && <LoadingOverlay />}

      <Routes>
        <Route path="/" element={<IdeaPitchComponent />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </LoadingContext.Provider>
  );
}

export default App;
