import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Index.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png";

const IndexPrice = () => {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousIndices = useRef([]);

  const fetchIndices = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch("http://localhost:8080/api/indices");
      const data = await response.json();

      const updatedData = data.map((index, i) => {
        const prevIndex = previousIndices.current[i];
        return {
          ...index,
          closingPriceChanged:
            prevIndex && index.closingPrice !== prevIndex.closingPrice,
          highPriceChanged:
            prevIndex && index.highPrice !== prevIndex.highPrice,
          lowPriceChanged: prevIndex && index.lowPrice !== prevIndex.lowPrice,
          changeValueChanged:
            prevIndex && index.changeValue !== prevIndex.changeValue,
          changePercentChanged:
            prevIndex && index.changePercent !== prevIndex.changePercent,
        };
      });

      previousIndices.current = data;
      setIndices(updatedData);
    } catch (error) {
      console.error("Error fetching index data:", error);
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
    fetchIndices();
    const interval = setInterval(() => {
      fetchIndices();
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
    <div className="index-table-container">
      <div className="index-header">
        <div className="index-info">종목</div>
        <div className="index-price">종가</div>
        <div className="index-price">고가</div>
        <div className="index-price">저가</div>
        <div className="index-change">변동</div>
        <div className="index-change">변동(%)</div>
        <div className="index-time">시간</div>
      </div>
      <div className="index-item-container">
        {loading
          ? Array.from({ length: 21 }).map((_, index) => (
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
          : indices.map((index, i) => (
              <animated.div
                className="index-item"
                key={i}
                style={springProps} // Apply animation to each index item
              >
                <div className="index-info">
                  <img
                    src={
                      parseFloat(index.changeValue) === 0
                        ? hyphen
                        : parseFloat(index.changeValue) > 0
                        ? upArrow
                        : downArrow
                    }
                    alt={
                      parseFloat(index.changeValue) === 0
                        ? "Hyphen"
                        : parseFloat(index.changeValue) > 0
                        ? "Up"
                        : "Down"
                    }
                    className="arrow-icon"
                  />
                  <span className="index-name">{index.indexName}</span>
                </div>
                <div className="index-price">
                  <span
                    className={`${
                      index.closingPriceChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.closingPrice}
                  </span>
                </div>
                <div className="index-price">
                  <span
                    className={`${
                      index.highPriceChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.highPrice}
                  </span>
                </div>
                <div className="index-price">
                  <span
                    className={`${
                      index.lowPriceChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.lowPrice}
                  </span>
                </div>
                <div
                  className={`index-change ${
                    parseFloat(index.changeValue) === 0
                      ? "index-neutral"
                      : parseFloat(index.changeValue) > 0
                      ? "index-up"
                      : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.changeValueChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.changeValue}
                  </span>
                </div>
                <div
                  className={`index-change ${
                    parseFloat(index.changePercent) === 0
                      ? "index-neutral"
                      : parseFloat(index.changePercent) > 0
                      ? "index-up"
                      : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.changePercentChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.changePercent}
                  </span>
                </div>
                <div className="index-time">{index.rateTime}</div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default IndexPrice;
