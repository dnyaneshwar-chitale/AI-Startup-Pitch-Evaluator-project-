import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import './styles.css'; 
import pageData from '../Pages/data.json';

const IdeaPitchComponent = () => {
  const { title, subtitle, buttonText } = pageData;

  return (
    <div className="feedback-container">
      <div className="content-box">
        <h1 className="title">{title}</h1>
        <p className="subtitles">{subtitle}</p>

        {/* ✅ Use Link properly for navigation */}
        <Link to="/evaluation" className="evaluation-button">
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default IdeaPitchComponent;
