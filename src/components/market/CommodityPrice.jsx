import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Commodity.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png"; // Hyphen 이미지 추가

const CommodityPrice = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousCommodities = useRef([]);

  const fetchCommodities = async () => {
    const startTime = Date.now(); // 시작 시간 기록
    try {
      const response = await fetch("http://localhost:8080/api/commodities");
      const data = await response.json();

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

      previousCommodities.current = data;
      setCommodities(updatedData);
    } catch (error) {
      console.error("Error fetching commodity data:", error);
    } finally {
      const minLoadingTime = 1000; // 최소 로딩 시간 1초
      const loadTime = Date.now() - startTime;

      if (loadTime < minLoadingTime) {
        setTimeout(() => setLoading(false), minLoadingTime - loadTime);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCommodities();
    const interval = setInterval(() => {
      fetchCommodities();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // `loading` 상태가 변경될 때마다 애니메이션을 재실행
  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0px)",
    config: { tension: 280, friction: 60 },
  });

  return (
    <div className="commodity-table-container">
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
      <div className="commodity-item-container">
        {loading
          ? Array.from({ length: 16 }).map((_, index) => (
              <Skeleton
                key={index}
                height={100}
                className="skeleton-ui"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))
          : commodities.map((commodity, index) => (
              <animated.div
                key={index}
                style={springProps}
                className="commodity-item"
              >
                <div className="commodity-info">
                  <img
                    src={
                      parseFloat(commodity.changeValue) === 0
                        ? hyphen
                        : parseFloat(commodity.changeValue) > 0
                        ? upArrow
                        : downArrow
                    }
                    alt={
                      parseFloat(commodity.changeValue) === 0
                        ? "Hyphen"
                        : parseFloat(commodity.changeValue) > 0
                        ? "Up"
                        : "Down"
                    }
                    className="arrow-icon"
                  />
                  <span className="commodity-name">
                    {commodity.commodityName}
                  </span>
                </div>
                <span className="commodity-expiry">
                  {commodity.contractMonth}
                </span>
                <div className="commodity-price">
                  <span
                    className={`${
                      commodity.priceChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.closingPrice}
                  </span>
                </div>
                <div className="commodity-price">
                  <span
                    className={`${
                      commodity.highChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.highPrice}
                  </span>
                </div>
                <div className="commodity-price">
                  <span
                    className={`${
                      commodity.lowChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.lowPrice}
                  </span>
                </div>
                <div
                  className={`commodity-change ${
                    parseFloat(commodity.changeValue) === 0
                      ? "commodity-neutral"
                      : parseFloat(commodity.changeValue) > 0
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
                    parseFloat(commodity.changePercent) === 0
                      ? "commodity-neutral"
                      : parseFloat(commodity.changePercent) > 0
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
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default CommodityPrice;
