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
  return (
    <div
      className="scrape-item"
      role="article"
      aria-label={`${title} by ${author}`}
    >
      <div className="scrape-image-author">
        <img src={image} alt={`${title} 이미지`} loading="lazy" />
        <p className="author">{author}</p>
      </div>
      <div className="scrape-content">
        <h3 className="title">{title}</h3>
        <p className="article-date-time">
          {articleDate} {articleTime}
        </p>
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
