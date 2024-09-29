// components/research/ScrapeItem.jsx
import React from "react";
import "./ScrapeItem.css";

const ScrapeItem = ({ image, textLine1, textLine2, fileLink }) => {
  return (
    <div className="scrape-item">
      <div className="scrape-image">
        <img src={image} alt="스크랩 이미지" />
      </div>
      <div className="scrape-content">
        <div className="scrape-text">
          <p>{textLine1}</p>
          <p>{textLine2}</p>
        </div>
        <div className="scrape-file">
          <a href={fileLink} target="_blank" rel="noopener noreferrer">
            파일 다운로드
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScrapeItem;
