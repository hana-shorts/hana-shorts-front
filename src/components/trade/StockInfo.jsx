import React, { useEffect, useState } from "react";
import socket from "../../socket"; // 전역 소켓 인스턴스를 가져옴
import StockChart from "./StockChart"; // StockChart 컴포넌트 추가
import "./StockInfo.css";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const StockInfo = ({ stockCode, stockName, onHokaUpdate }) => {
  const [stockData, setStockData] = useState([]);
  const [activeTab, setActiveTab] = useState("시세");

  useEffect(() => {
    if (stockCode) {
      setTimeout(() => {
        socket.emit("request_stock_info", { code: stockCode });
      }, 100); // 100ms 지연 추가

      const handleStockInfoUpdate = (data) => {
        if (data && data.length > 0) {
          setStockData(data[0]); // 데이터 배열의 첫 번째 요소를 저장
          onHokaUpdate(data[0].aspr_unit); // 부모 컴포넌트로 가격 데이터를 전달
        }
      };

      socket.on("stock_info_update", handleStockInfoUpdate);

      return () => {
        socket.emit("stop_stock_info");
        socket.off("stock_info_update", handleStockInfoUpdate);
      };
    }
  }, [stockCode, onHokaUpdate]);

  // 상승, 하락 여부에 따른 화살표 결정
  const arrowIcon = stockData.prdy_vrss_sign === "2" ? upArrow : downArrow;
  const changeColor = stockData.prdy_vrss_sign === "2" ? "#e12d2d" : "#0059b3";

  return (
    <div className="stockinfo-container">
      {/* 헤더 섹션 */}
      <div className="stockinfo-header">
        <div className="stockinfo-name">{stockName}</div>
        <div className="stockinfo-tabs">
          <div
            className={`stockinfo-tab ${activeTab === "시세" ? "active" : ""}`}
            onClick={() => setActiveTab("시세")}
          >
            시세
          </div>
          <div
            className={`stockinfo-tab ${activeTab === "정보" ? "active" : ""}`}
            onClick={() => setActiveTab("정보")}
          >
            정보
          </div>
        </div>
      </div>

      {activeTab === "시세" ? (
        <div className="stockinfo-pricing">
          <div className="stockinfo-price-left">
            <div className="stockinfo-info">
              <span className="stockinfo-code">{stockData.stck_shrn_iscd}</span>{" "}
              |{" "}
              <span className="stockinfo-market">
                {stockData.rprs_mrkt_kor_name}
              </span>{" "}
              |{" "}
              <span className="stockinfo-sector">
                {stockData.bstp_kor_isnm}
              </span>
            </div>
            <div className="stockinfo-price">
              <span
                className="stockinfo-price-value"
                style={{ color: changeColor }}
              >
                {stockData.stck_prpr}
              </span>
            </div>
            <div className="stockinfo-change" style={{ color: changeColor }}>
              <img src={arrowIcon} alt="변동" className="stockinfo-arrow" />
              <span className="stockinfo-change-amount">
                {stockData.prdy_vrss}
              </span>
              <span className="stockinfo-change-percent">
                {stockData.prdy_ctrt}%
              </span>
            </div>
            <div className="stockinfo-volume">
              {parseInt(stockData.acml_vol, 10).toLocaleString()}주
              <span className="stockinfo-volume-percent">
                ({parseFloat(stockData.prdy_vrss_vol_rate).toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="stockinfo-price-right">
            <div
              className="stockinfo-stat-item"
              style={{ borderBottom: "1px solid #333" }}
            >
              <span className="stockinfo-label">고가</span>
              <span className="stockinfo-value">{stockData.stck_hgpr}</span>
              <span className="stockinfo-label">시가총액(억)</span>
              <span className="stockinfo-value" style={{ marginRight: "0px" }}>
                {parseInt(stockData.hts_avls, 10).toLocaleString()}
              </span>
            </div>
            <div className="stockinfo-stat-item">
              <span className="stockinfo-label">저가</span>
              <span className="stockinfo-value">{stockData.stck_lwpr}</span>
              <span className="stockinfo-label">거래대금(만)</span>
              <span className="stockinfo-value" style={{ marginRight: "0px" }}>
                {(parseFloat(stockData.acml_tr_pbmn) / 10000).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 0 }
                )}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="stockinfo-details">
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">시가:</span>
            <span className="stockinfo-detail-value">
              {stockData.stck_oprc}
            </span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">전일 종가:</span>
            <span className="stockinfo-detail-value">
              {stockData.stck_sdpr}
            </span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">52주 최고가:</span>
            <span className="stockinfo-detail-value">{stockData.w52_hgpr}</span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">52주 최저가:</span>
            <span className="stockinfo-detail-value">{stockData.w52_lwpr}</span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">외국인 보유율:</span>
            <span className="stockinfo-detail-value">
              {stockData.hts_frgn_ehrt}%
            </span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">시가총액:</span>
            <span className="stockinfo-detail-value">{stockData.hts_avls}</span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">PER:</span>
            <span className="stockinfo-detail-value">{stockData.per}</span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">PBR:</span>
            <span className="stockinfo-detail-value">{stockData.pbr}</span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">EPS:</span>
            <span className="stockinfo-detail-value">{stockData.eps}</span>
          </div>
          <div className="stockinfo-detail-item">
            <span className="stockinfo-detail-label">bps:</span>
            <span className="stockinfo-detail-value">{stockData.bps}</span>
          </div>
        </div>
      )}
      <div className="stockinfo-chart-wrapper">
        {activeTab === "시세" && (
          <StockChart stockCode={stockCode} activeTab={activeTab} />
        )}
      </div>
    </div>
  );
};

export default StockInfo;
