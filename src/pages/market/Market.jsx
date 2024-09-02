import React, { useState } from "react";
import Currency from "../../components/Currency"; // 작성한 컴포넌트 불러오기
import Commodity from "../../components/Commodity"; // 새로 만든 컴포넌트 임포트
import Index from "../../components/Index";
import KoreaStocks from "../../components/KoreaStocks";
import Sector from "../../components/Sector";
import Schedule from "../../components/Schedule"; // 새로 만든 컴포넌트 임포트
import "./Market.css";

const Market = () => {
  const [activeTab, setActiveTab] = useState("외환");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="market-page">
      <div className="market-header">
        <h1 className="market-title">마켓</h1>
        <div className="market-tabs">
          <button
            className={activeTab === "외환" ? "market-active" : ""}
            onClick={() => handleTabClick("외환")}
          >
            외환
          </button>
          <button
            className={activeTab === "원자재" ? "market-active" : ""}
            onClick={() => handleTabClick("원자재")}
          >
            원자재
          </button>
          <button
            className={activeTab === "지수" ? "market-active" : ""}
            onClick={() => handleTabClick("지수")}
          >
            지수
          </button>
          <button
            className={activeTab === "주식" ? "market-active" : ""}
            onClick={() => handleTabClick("주식")}
          >
            주식
          </button>
          <button
            className={activeTab === "섹터" ? "market-active" : ""}
            onClick={() => handleTabClick("섹터")}
          >
            섹터
          </button>
          <button
            className={activeTab === "일정" ? "market-active" : ""}
            onClick={() => handleTabClick("일정")}
          >
            일정
          </button>
        </div>
      </div>

      <div className="market-content">
        {activeTab === "외환" && (
          <>
            <div className="market-separator-line"></div>
            <Currency /> {/* 외환 탭에서만 환율 데이터 표시 */}
          </>
        )}
        {activeTab === "원자재" && (
          <>
            <div className="market-separator-line"></div>
            <Commodity /> {/* 원자재 탭에서만 원자재 데이터 표시 */}
          </>
        )}
        {activeTab === "지수" && (
          <>
            <div className="market-separator-line"></div>
            <Index /> {/* 지수 탭에서만 지수 데이터 표시 */}
          </>
        )}
        {activeTab === "주식" && (
          <>
            <div className="market-separator-line"></div>
            <KoreaStocks /> {/* 주식 탭에서만 주식 데이터 표시 */}
          </>
        )}
        {activeTab === "섹터" && (
          <>
            <div className="market-separator-line"></div>
            <Sector /> {/* 섹터 탭에서만 섹터 데이터 표시 */}
          </>
        )}
        {activeTab === "일정" && (
          <>
            <div className="market-separator-line"></div>
            <Schedule /> {/* 일정 탭에서만 일정 데이터 표시 */}
          </>
        )}
      </div>
    </div>
  );
};

export default Market;
