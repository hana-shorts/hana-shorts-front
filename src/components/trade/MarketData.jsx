import React, { useState, useEffect } from "react";
import socket from "../../socket"; // 전역 소켓 인스턴스를 가져옴
import "./MarketData.css";

const MarketData = ({ stockCode = "005930" }) => {
  const [activeTab, setActiveTab] = useState("체결");
  const [settlementData, setSettlementData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    if (stockCode && activeTab === "체결") {
      setTimeout(() => {
        socket.emit("request_settlement_data", { code: stockCode });
      }, 100); // 100ms 지연 추가
      socket.on("settlement_update", (data) => {
        setSettlementData(data);
      });
      return () => {
        socket.emit("stop_settlement_data");
        socket.off("settlement_update");
      };
    } else if (stockCode && activeTab === "일별") {
      setTimeout(() => {
        socket.emit("request_daily_data", { code: stockCode });
      }, 100); // 100ms 지연 추가
      socket.on("daily_update", (data) => {
        setDailyData(data);
      });
      return () => {
        socket.emit("stop_daily_data");
        socket.off("daily_update");
      };
    }
  }, [stockCode, activeTab]);

  const toggleTab = (tab) => {
    setActiveTab(tab);
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

      {activeTab === "체결" ? (
        <div className="market-data-tab-content">
          {settlementData.map((item, index) => (
            <div className="market-data-row" key={index}>
              <div className="market-data-cell">{item.stck_cntg_hour}</div>
              <div
                className={`market-data-cell ${
                  item.prdy_vrss_sign === "2"
                    ? "market-data-red"
                    : "market-data-blue"
                }`}
              >
                {item.stck_prpr}
              </div>
              <div className="market-data-cell">{item.prdy_vrss}</div>
              <div className="market-data-cell">{item.cntg_vol}</div>
              <div className="market-data-cell">{item.tday_rltv}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="market-data-tab-content">
          {dailyData.map((item, index) => (
            <div className="market-data-row" key={index}>
              <div className="market-data-cell">{item.stck_bsop_date}</div>
              <div
                className={`market-data-cell ${
                  parseFloat(item.prdy_ctrt) >= 0
                    ? "market-data-red"
                    : "market-data-blue"
                }`}
              >
                {item.stck_clpr}
              </div>
              <div className="market-data-cell">{item.prdy_vrss}</div>
              <div className="market-data-cell">{item.prdy_ctrt}</div>
              <div className="market-data-cell">{item.acml_vol}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketData;
