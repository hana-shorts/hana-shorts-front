import React from "react";
import "./ArticleList.css";

const ArticleList = ({ articleList, customClassName }) => {
  return (
    <div className={`articlelist-section ${customClassName}`}>
      {articleList.map((news) => (
        <a
          href={news.url}
          key={news.id}
          className="articlelist-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="articlelist-item">
            <p>
              {news.time} <span>{news.date}</span>
            </p>
            <h2>{news.title}</h2>
            <p>{news.description}</p>
            {news.img && <img src={news.img} alt={news.title} />}
          </div>
        </a>
      ))}
    </div>
  );
};

export default ArticleList;
