import React from "react";
import "./StockInfo.css";

const StockInfo = () => {
  return (
    <div className="stockinfo-container">
      <div className="stockinfo-header">
        <div className="stockinfo-name">
          <img
            src="/path/to/bitcoin-icon.png"
            alt="Bitcoin"
            className="stockinfo-icon"
          />
          <span>NASDAQ</span>
        </div>
        <div className="stockinfo-price-info">
          <div className="stockinfo-price">
            81,207,000 <span className="stockinfo-currency">KRW</span>
          </div>
          <div className="stockinfo-change">
            <span className="stockinfo-change-percent">+0.56%</span>
            <span className="stockinfo-change-amount">▲ 456,000</span>
          </div>
        </div>
      </div>
      <div className="stockinfo-details">
        <div className="stockinfo-chart-thumbnail">
          <img
            src="/path/to/chart-thumbnail.png"
            alt="Chart Thumbnail"
            className="stockinfo-chart-image"
          />
        </div>
        <div className="stockinfo-stats">
          <div className="stockinfo-stat-item">
            <span className="stockinfo-label">고가</span>
            <span className="stockinfo-value">82,077,000</span>
          </div>
          <div className="stockinfo-stat-item">
            <span className="stockinfo-label">저가</span>
            <span className="stockinfo-value">80,567,000</span>
          </div>
          <div className="stockinfo-stat-item">
            <span className="stockinfo-label">거래량(24H)</span>
            <span className="stockinfo-value">2,235.396 BTC</span>
          </div>
          <div className="stockinfo-stat-item">
            <span className="stockinfo-label">거래대금(24H)</span>
            <span className="stockinfo-value">181,310,587,714 KRW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;
