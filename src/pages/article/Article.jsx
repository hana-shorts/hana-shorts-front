import React, { useState, useEffect } from "react";
import ArticleList from "../../components/article/ArticleList";
import "./Article.css";

const Article = () => {
  const [selectedTab, setSelectedTab] = useState("latest");
  const [latestNews, setLatestNews] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [error, setError] = useState(null);

  const fetchLatestNews = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/latest_news");
      if (!response.ok) {
        throw new Error("뉴스 데이터를 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      setLatestNews(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchPopularNews = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/popular_news");
      if (!response.ok) {
        throw new Error("뉴스 데이터를 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      setPopularNews(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchLatestNews();
    fetchPopularNews();
  }, []);

  const articleList = selectedTab === "latest" ? latestNews : popularNews;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="article-page fade-in-minus-y">
      <h1 className="article-title">뉴스룸</h1>
      <div className="article-tabs">
        <button
          onClick={() => setSelectedTab("latest")}
          className={selectedTab === "latest" ? "article-active" : ""}
        >
          최신 뉴스
        </button>
        <button
          onClick={() => setSelectedTab("popular")}
          className={selectedTab === "popular" ? "article-active" : ""}
        >
          많이 본 뉴스
        </button>
      </div>

      <ArticleList
        articleList={articleList}
        loading={articleList.length === 0}
      />
      <button className="article-load-more-button">더보기</button>
    </div>
  );
};

export default Article;
