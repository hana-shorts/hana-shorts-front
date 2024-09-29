// components/research/ResearchAnalysis.jsx
import React from "react";
import ScrapeItem from "./ScrapeItem"; // ScrapeItem 컴포넌트 import
import "./ResearchAnalysis.css";

const ResearchAnalysis = () => {
  // 섹션별 스크랩 데이터 (예시 데이터)
  const sections = [
    {
      title: "주식 전략",
      scrapes: generateScrapes("주식 전략"),
    },
    {
      title: "산업/기업",
      scrapes: generateScrapes("산업/기업"),
    },
    {
      title: "글로벌 리서치",
      scrapes: generateScrapes("글로벌 리서치"),
    },
    {
      title: "글로벌 자산전략",
      scrapes: generateScrapes("글로벌 자산전략"),
    },
  ];

  return (
    <div className="research-analysis-container">
      <div className="analysis-row">
        <div className="analysis-section">
          <h2 className="section-title">주식 전략</h2>
          <div className="scrapes-container">
            {sections[0].scrapes.map((scrape, idx) => (
              <ScrapeItem
                key={idx}
                image={scrape.image}
                textLine1={scrape.textLine1}
                textLine2={scrape.textLine2}
                fileLink={scrape.fileLink}
              />
            ))}
          </div>
        </div>
        <div className="analysis-section">
          <h2 className="section-title">산업/기업</h2>
          <div className="scrapes-container">
            {sections[1].scrapes.map((scrape, idx) => (
              <ScrapeItem
                key={idx}
                image={scrape.image}
                textLine1={scrape.textLine1}
                textLine2={scrape.textLine2}
                fileLink={scrape.fileLink}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="analysis-row">
        <div className="analysis-section">
          <h2 className="section-title">글로벌 리서치</h2>
          <div className="scrapes-container">
            {sections[2].scrapes.map((scrape, idx) => (
              <ScrapeItem
                key={idx}
                image={scrape.image}
                textLine1={scrape.textLine1}
                textLine2={scrape.textLine2}
                fileLink={scrape.fileLink}
              />
            ))}
          </div>
        </div>
        <div className="analysis-section">
          <h2 className="section-title">글로벌 자산전략</h2>
          <div className="scrapes-container">
            {sections[3].scrapes.map((scrape, idx) => (
              <ScrapeItem
                key={idx}
                image={scrape.image}
                textLine1={scrape.textLine1}
                textLine2={scrape.textLine2}
                fileLink={scrape.fileLink}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 스크랩 항목 생성 함수 (예시용)
const generateScrapes = (category) => {
  const scrapes = [];
  for (let i = 1; i <= 5; i++) {
    scrapes.push({
      image: "https://via.placeholder.com/150", // 이미지 URL 또는 경로
      textLine1: `${category} 관련 내용 1-${i}`,
      textLine2: `${category} 관련 내용 2-${i}`,
      fileLink: "#", // 파일 다운로드 링크
    });
  }
  return scrapes;
};

export default ResearchAnalysis;
