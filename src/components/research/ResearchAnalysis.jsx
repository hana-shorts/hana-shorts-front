// components/research/ResearchAnalysis.jsx
import React, { useState, useEffect } from "react";
import ScrapeItem from "./ScrapeItem"; // ScrapeItem 컴포넌트 import
import CircularProgress from "@mui/material/CircularProgress"; // MUI CircularProgress import
import Box from "@mui/material/Box"; // MUI Box import
import "./ResearchAnalysis.css";

const ResearchAnalysis = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 호출하여 데이터 가져오기
    fetch("http://localhost:5002/api/get_research_analysis")
      .then((response) => {
        if (!response.ok) {
          throw new Error("데이터를 가져오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setSections(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="research-analysis-container">
      {/* 첫 번째 행: 주식 전략 & 산업/기업 */}
      <div className="analysis-row">
        {/* 주식 전략 섹션 */}
        <div className="analysis-section">
          <h2 className="section-title">주식 전략</h2>
          <div className="scrapes-container">
            {loading ? (
              <Box className="loading-indicator">
                <CircularProgress />
              </Box>
            ) : sections["주식 전략"] ? (
              sections["주식 전략"].slice(0, 10).map((scrape, idx) => (
                <ScrapeItem
                  key={idx}
                  image={scrape.image}
                  author={scrape.author}
                  title={scrape.title}
                  articleDate={scrape.textLine1} // 예: 'YY/MM/DD'
                  articleTime={scrape.textLine2} // 예: '오후 3:24:29'
                  fileLink={scrape.fileLink}
                />
              ))
            ) : (
              <div className="error-message">데이터를 불러오지 못했습니다.</div>
            )}
          </div>
        </div>
        {/* 산업/기업 섹션 */}
        <div className="analysis-section">
          <h2 className="section-title">산업/기업</h2>
          <div className="scrapes-container">
            {loading ? (
              <Box className="loading-indicator">
                <CircularProgress />
              </Box>
            ) : sections["산업/기업"] ? (
              sections["산업/기업"]
                .slice(0, 10)
                .map((scrape, idx) => (
                  <ScrapeItem
                    key={idx}
                    image={scrape.image}
                    author={scrape.author}
                    title={scrape.title}
                    articleDate={scrape.textLine1}
                    articleTime={scrape.textLine2}
                    fileLink={scrape.fileLink}
                  />
                ))
            ) : (
              <div className="error-message">데이터를 불러오지 못했습니다.</div>
            )}
          </div>
        </div>
      </div>
      {/* 두 번째 행: 글로벌 리서치 & 글로벌 자산전략 */}
      <div className="analysis-row">
        {/* 글로벌 리서치 섹션 */}
        <div className="analysis-section">
          <h2 className="section-title">글로벌 리서치</h2>
          <div className="scrapes-container">
            {loading ? (
              <Box className="loading-indicator">
                <CircularProgress />
              </Box>
            ) : sections["글로벌 리서치"] ? (
              sections["글로벌 리서치"]
                .slice(0, 10)
                .map((scrape, idx) => (
                  <ScrapeItem
                    key={idx}
                    image={scrape.image}
                    author={scrape.author}
                    title={scrape.title}
                    articleDate={scrape.textLine1}
                    articleTime={scrape.textLine2}
                    fileLink={scrape.fileLink}
                  />
                ))
            ) : (
              <div className="error-message">데이터를 불러오지 못했습니다.</div>
            )}
          </div>
        </div>
        {/* 글로벌 자산전략 섹션 */}
        <div className="analysis-section">
          <h2 className="section-title">글로벌 자산전략</h2>
          <div className="scrapes-container">
            {loading ? (
              <Box className="loading-indicator">
                <CircularProgress />
              </Box>
            ) : sections["글로벌 자산전략"] ? (
              sections["글로벌 자산전략"]
                .slice(0, 10)
                .map((scrape, idx) => (
                  <ScrapeItem
                    key={idx}
                    image={scrape.image}
                    author={scrape.author}
                    title={scrape.title}
                    articleDate={scrape.textLine1}
                    articleTime={scrape.textLine2}
                    fileLink={scrape.fileLink}
                  />
                ))
            ) : (
              <div className="error-message">데이터를 불러오지 못했습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAnalysis;
