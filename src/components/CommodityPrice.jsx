import React, { useEffect, useState, useRef } from "react";
import "./Commodity.css";

// 이미지 경로 가져오기
import upArrow from "../assets/images/up_arrow.png";
import downArrow from "../assets/images/down_arrow.png";

const CommodityPrice = () => {
  const [commodities, setCommodities] = useState([]);
  const previousCommodities = useRef([]);

  // 데이터를 가져오는 함수
  const fetchCommodities = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/commodities");
      const data = await response.json();

      // 이전 데이터와 비교하여 변화된 부분에 클래스를 추가
      const updatedData = data.map((commodity, index) => {
        const prevCommodity = previousCommodities.current[index];
        return {
          ...commodity,
          priceChanged:
            prevCommodity &&
            commodity.closingPrice !== prevCommodity.closingPrice,
          highChanged:
            prevCommodity && commodity.highPrice !== prevCommodity.highPrice,
          lowChanged:
            prevCommodity && commodity.lowPrice !== prevCommodity.lowPrice,
          changeValueChanged:
            prevCommodity &&
            commodity.changeValue !== prevCommodity.changeValue,
          changePercentChanged:
            prevCommodity &&
            commodity.changePercent !== prevCommodity.changePercent,
        };
      });

      setCommodities(updatedData);
      previousCommodities.current = data; // 이전 데이터를 현재 데이터로 업데이트
    } catch (error) {
      console.error("Error fetching commodity data:", error);
    }
  };

  useEffect(() => {
    fetchCommodities();
    const interval = setInterval(() => {
      fetchCommodities();
    }, 30000); // 30초마다 데이터를 불러옴

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <div className="commodity-container">
      <div className="commodity-header">
        <div className="commodity-info">종목</div>
        <div className="commodity-price">월물</div>
        <div className="commodity-price">종가</div>
        <div className="commodity-price">고가</div>
        <div className="commodity-price">저가</div>
        <div className="commodity-change">변동</div>
        <div className="commodity-change">변동(%)</div>
        <div className="commodity-time">시간</div>
      </div>
      {commodities.map((commodity, index) => (
        <div className="commodity-item" key={index}>
          <div className="commodity-info">
            <img
              src={parseFloat(commodity.changeValue) >= 0 ? upArrow : downArrow}
              alt={parseFloat(commodity.changeValue) >= 0 ? "Up" : "Down"}
              className="arrow-icon"
            />
            <span className="commodity-name">{commodity.commodityName}</span>
          </div>
          <span className="commodity-expiry">{commodity.contractMonth}</span>
          <div className="commodity-price">
            <span
              className={`${commodity.priceChanged ? "commodity-changed" : ""}`}
            >
              {commodity.closingPrice}
            </span>
          </div>
          <div className="commodity-price">
            <span
              className={`${commodity.highChanged ? "commodity-changed" : ""}`}
            >
              {commodity.highPrice}
            </span>
          </div>
          <div className="commodity-price">
            <span
              className={`${commodity.lowChanged ? "commodity-changed" : ""}`}
            >
              {commodity.lowPrice}
            </span>
          </div>
          <div
            className={`commodity-change ${
              parseFloat(commodity.changeValue) >= 0
                ? "commodity-up"
                : "commodity-down"
            }`}
          >
            <span
              className={`${
                commodity.changeValueChanged ? "commodity-changed" : ""
              }`}
            >
              {commodity.changeValue}
            </span>
          </div>
          <div
            className={`commodity-change ${
              parseFloat(commodity.changePercent) >= 0
                ? "commodity-up"
                : "commodity-down"
            }`}
          >
            <span
              className={`${
                commodity.changePercentChanged ? "commodity-changed" : ""
              }`}
            >
              {commodity.changePercent}
            </span>
          </div>
          <div className="commodity-time">{commodity.rateTime}</div>
        </div>
      ))}
    </div>
  );
};

export default CommodityPrice;
