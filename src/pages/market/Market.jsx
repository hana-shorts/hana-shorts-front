// Market.jsx
import React, { useState, useRef, useEffect } from "react";
import Currency from "../../components/market/Currency"; // 작성한 컴포넌트 불러오기
import Commodity from "../../components/market/Commodity"; // 새로 만든 컴포넌트 임포트
import Index from "../../components/market/Index";
import Stocks from "../../components/market/Stocks";
import Sector from "../../components/market/Sector";
import Schedule from "../../components/market/Schedule"; // 새로 만든 컴포넌트 임포트
import "./Market.css";

const Market = () => {
  const [activeTab, setActiveTab] = useState("외환");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef({}); // 각 탭의 ref를 저장

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    // 활성화된 탭의 ref 가져오기
    const activeTabRef = tabsRef.current[activeTab];
    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;
      setIndicatorStyle({
        left: offsetLeft,
        width: clientWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="market-page fade-in-minus-y">
      <div className="market-header">
        <h1 className="market-title">마켓</h1>
        <div className="market-tabs">
          <button
            ref={(el) => (tabsRef.current["외환"] = el)}
            className={activeTab === "외환" ? "market-active" : ""}
            onClick={() => handleTabClick("외환")}
          >
            외환
          </button>
          <button
            ref={(el) => (tabsRef.current["원자재"] = el)}
            className={activeTab === "원자재" ? "market-active" : ""}
            onClick={() => handleTabClick("원자재")}
          >
            원자재
          </button>
          <button
            ref={(el) => (tabsRef.current["지수"] = el)}
            className={activeTab === "지수" ? "market-active" : ""}
            onClick={() => handleTabClick("지수")}
          >
            지수
          </button>
          <button
            ref={(el) => (tabsRef.current["주식"] = el)}
            className={activeTab === "주식" ? "market-active" : ""}
            onClick={() => handleTabClick("주식")}
          >
            주식
          </button>
          <button
            ref={(el) => (tabsRef.current["섹터"] = el)}
            className={activeTab === "섹터" ? "market-active" : ""}
            onClick={() => handleTabClick("섹터")}
          >
            섹터
          </button>
          <button
            ref={(el) => (tabsRef.current["일정"] = el)}
            className={activeTab === "일정" ? "market-active" : ""}
            onClick={() => handleTabClick("일정")}
          >
            일정
          </button>
          {/* 슬라이딩 인디케이터 */}
          <span
            className="market-tab-indicator"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          ></span>
        </div>
      </div>

      <div className="market-content">
        {activeTab === "외환" && <Currency />}
        {activeTab === "원자재" && <Commodity />}
        {activeTab === "지수" && <Index />}
        {activeTab === "주식" && <Stocks />}
        {activeTab === "섹터" && <Sector />}
        {activeTab === "일정" && <Schedule />}
      </div>
    </div>
  );
};

export default Market;
