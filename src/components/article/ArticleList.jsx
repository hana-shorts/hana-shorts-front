import React from 'react';
import './ArticleList.css';

const ArticleList = ({ articleList, customClassName, showImage = true }) => {
  return (
    <div className={`articlelist-section ${customClassName}`}>
      {articleList.map((news, index) => {
        return (
          <a key={index} href={news.link} className="articlelist-link" target="_blank" rel="noopener noreferrer">
            <div className="articlelist-item">
              <div className="articlelist-content">
                <div className="articlelist-text">
                  <div className="articlelist-header">
                    <div className="articlelist-time">
                      <div
                        style={{
                          backgroundColor: '#e9ebef',
                          fontSize: '14px',
                          padding: '6px 6px 4px 6px',
                          borderRadius: '5px',
                        }}
                      >
                        {news.time}
                      </div>
                      <div style={{ fontSize: '14px', padding: '4px 6px', borderRadius: '5px' }}>{news.date}</div>
                    </div>
                    <div className="articlelist-press">{news.press}</div>
                  </div>
                  <div className="articlelist-title">{news.title}</div>
                  <div className="articlelist-description">{news.description}</div>
                </div>
                {showImage && news.img && <img src={news.img} alt={news.title} className="articlelist-img" />}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default ArticleList;
