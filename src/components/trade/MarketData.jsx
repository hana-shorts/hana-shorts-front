import React, { useState, useEffect } from "react";
import socket from "../../socket"; // 전역 소켓 인스턴스를 가져옴
import "./MarketData.css";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png"; // Hyphen 이미지 추가

const MarketData = ({ stockCode }) => {
  const [activeTab, setActiveTab] = useState("체결");
  const [settlementData, setSettlementData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    if (stockCode) {
      if (activeTab === "체결") {
        socket.emit("request_settlement_data", { code: stockCode });
        socket.on("settlement_update", (data) => {
          setSettlementData(data);
        });

        return () => {
          socket.emit("stop_settlement_data");
          socket.off("settlement_update");
        };
      } else if (activeTab === "일별") {
        socket.emit("request_daily_data", { code: stockCode });
        socket.on("daily_update", (data) => {
          setDailyData(data);
        });

        return () => {
          socket.emit("stop_daily_data");
          socket.off("daily_update");
        };
      }
    }
  }, [stockCode, activeTab]);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const formatTime = (time) => {
    const hour = time.slice(0, 2);
    const minute = time.slice(2, 4);
    const second = time.slice(4, 6);
    return `${hour}:${minute}:${second}`;
  };

  const formatDate = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${year}.${month}.${day}`;
  };

  const renderArrow = (sign) => {
    if (sign === "1" || sign === "2") {
      return <img src={upArrow} alt="Up Arrow" className="arrow-icon" />;
    } else if (sign === "4" || sign === "5") {
      return <img src={downArrow} alt="Down Arrow" className="arrow-icon" />;
    } else {
      return <img src={hyphen} alt="hyphen" className="arrow-icon" />;
    }
  };

  return (
    <div className="market-data-wrapper">
      <div className="market-data-tabs">
        <div
          className={`market-data-tab ${
            activeTab === "체결" ? "market-data-active" : ""
          }`}
          onClick={() => toggleTab("체결")}
        >
          체결
        </div>
        <div
          className={`market-data-tab ${
            activeTab === "일별" ? "market-data-active" : ""
          }`}
          onClick={() => toggleTab("일별")}
        >
          일별
        </div>
      </div>

      {/* 탭에 따른 헤더 표시 */}
      <div className="market-data-header">
        {activeTab === "체결" ? (
          <>
            <div className="market-data-header-cell">시간</div>
            <div className="market-data-header-cell">체결가</div>
            <div className="market-data-header-cell">대비</div>
            <div className="market-data-header-cell">체결량</div>
            <div className="market-data-header-cell">체결강도</div>
          </>
        ) : (
          <>
            <div className="market-data-header-cell">일자</div>
            <div className="market-data-header-cell">종가</div>
            <div className="market-data-header-cell">대비</div>
            <div className="market-data-header-cell">거래량</div>
          </>
        )}
      </div>

      {activeTab === "체결" ? (
        <div className="market-data-tab-content">
          {settlementData.map((item, index) => (
            <div className="market-data-row" key={index}>
              <div className="market-data-cell">
                {formatTime(item.stck_cntg_hour)}
              </div>
              <div
                className={`market-data-cell ${
                  item.prdy_vrss_sign === "2"
                    ? "market-data-red"
                    : item.prdy_vrss_sign === "5"
                    ? "market-data-blue"
                    : "market-data-neutral"
                }`}
              >
                {item.stck_prpr}
              </div>
              <div
                className={`market-data-cell ${
                  item.prdy_vrss_sign === "2"
                    ? "market-data-red"
                    : item.prdy_vrss_sign === "5"
                    ? "market-data-blue"
                    : "market-data-neutral"
                }`}
              >
                {renderArrow(item.prdy_vrss_sign)}
                {Math.abs(item.prdy_vrss)}
              </div>
              <div className="market-data-cell">{item.cntg_vol}</div>
              <div
                className={`market-data-cell ${
                  item.tday_rltv >= 100 ? "market-data-red" : "market-data-blue"
                }`}
              >
                {item.tday_rltv}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="market-data-tab-content">
          {dailyData.map((item, index) => (
            <div className="market-data-row" key={index}>
              <div className="market-data-cell">
                {formatDate(item.stck_bsop_date)}
              </div>
              <div
                className={`market-data-cell ${
                  parseFloat(item.prdy_ctrt) >= 0
                    ? "market-data-red"
                    : parseFloat(item.prdy_ctrt) < 0
                    ? "market-data-blue"
                    : "market-data-neutral"
                }`}
              >
                {item.stck_clpr}
              </div>
              <div
                className={`market-data-cell ${
                  item.prdy_vrss_sign === "2"
                    ? "market-data-red"
                    : item.prdy_vrss_sign === "5"
                    ? "market-data-blue"
                    : "market-data-neutral"
                }`}
              >
                {renderArrow(item.prdy_vrss_sign)}
                {Math.abs(item.prdy_vrss)}
              </div>
              <div className="market-data-cell">
                {parseInt(item.acml_vol, 10).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketData;
