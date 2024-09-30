// components/research/ScrapeItem.jsx
import React from "react";
import "./ScrapeItem.css";

const ScrapeItem = ({
  image,
  author,
  title,
  articleDate,
  articleTime,
  fileLink,
}) => {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("/");
    return `20${year}.${month}.${day}`;
  };

  return (
    <div
      className="scrape-item-container"
      role="article"
      aria-label={`${title} by ${author}`}
    >
      <div className="scrape-item-image-author">
        <img src={image} alt={`${title} 이미지`} loading="lazy" />
        <div className="scrape-item-author">{author}</div>
      </div>
      <div className="scrape-item-content">
        <div className="scrape-item-title">{title}</div>
        <div className="scrape-item-article-date-time">
          일시 &nbsp;&nbsp;{formatDate(articleDate)}&nbsp;&nbsp;&nbsp;
          {articleTime}
        </div>
        <div className="scrape-item-file">
          <a href={fileLink} target="_blank" rel="noopener noreferrer">
            파일 다운로드
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScrapeItem;
