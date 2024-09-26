// pages/research/ResearchIntro.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import webmVideo from "../../assets/images/research-welcome.webm"; // WebM 비디오 파일 경로
import recommendImage from "../../assets/images/research-recommend.avif";
import analysisImage from "../../assets/images/research-analysis.avif";
import extrasImage from "../../assets/images/research-extras.avif";
import "./ResearchIntro.css"; // 페이지 전용 CSS

const ResearchIntro = () => {
  const navigate = useNavigate();
  const [showTabs, setShowTabs] = useState(false);

  const handleStartClick = () => {
    setShowTabs(true);
  };

  const handleTabClick = (tabName) => {
    navigate(`/research/${tabName}`);
  };

  return (
    <div className="research-intro-page fade-in-minus-y">
      {!showTabs ? (
        <div className="research-intro-content-wrapper">
          <div className="research-intro-container">
            <div className="research-intro-text">
              <h2>맞춤형 투자 리서치를 한눈에</h2>
              <div>주식 마켓 분석부터 상위 종목 추천까지</div>
              <br />
              <div>필요한 정보를 손쉽게 찾아보세요.</div>
              <button
                className="research-intro-start-button"
                onClick={handleStartClick}
              >
                시작하기
              </button>
            </div>
            <div className="research-intro-video-container">
              <video loop autoPlay className="research-intro-webm-video">
                <source src={webmVideo} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      ) : (
        <div className="research-intro-buttons-container fade-in-minus-y">
          <div
            className="research-intro-button"
            onClick={() => handleTabClick("recommend")}
            tabIndex="0"
            role="button"
            aria-label="추천 서비스"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleTabClick("recommend");
            }}
          >
            <img
              src={recommendImage}
              alt="추천 서비스"
              className="research-intro-button-image"
            />
            <div className="research-intro-button-subtitle">
              오늘의 상위 종목을 한눈에
            </div>
            <span className="research-intro-button-label">추천 서비스</span>
          </div>
          <div
            className="research-intro-button"
            onClick={() => handleTabClick("analysis")}
            tabIndex="0"
            role="button"
            aria-label="분석 데스크"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleTabClick("analysis");
            }}
          >
            <img
              src={analysisImage}
              alt="분석 데스크"
              className="research-intro-button-image"
            />
            <div className="research-intro-button-subtitle">
              하나증권의 금융 전문가들이 제공하는
            </div>
            <span className="research-intro-button-label">분석 데스크</span>
          </div>
          <div
            className="research-intro-button"
            onClick={() => handleTabClick("extras")}
            tabIndex="0"
            role="button"
            aria-label="기타 자료"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleTabClick("extras");
            }}
          >
            <img
              src={extrasImage}
              alt="기타 자료"
              className="research-intro-button-image"
            />
            <div className="research-intro-button-subtitle">
              다양한 금융 Shorts와 영상 자료를 함께
            </div>
            <span className="research-intro-button-label">하나 TV</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchIntro;
