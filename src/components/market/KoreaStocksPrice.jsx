import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./KoreaStocks.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png";

const KoreaStocksPrice = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousStocks = useRef([]);

  const fetchStocks = async () => {
    const startTime = Date.now(); // 시작 시간 기록
    try {
      const response = await fetch("http://localhost:8080/api/stocks");
      const data = await response.json();

      const updatedData = data.map((stock, index) => {
        const prevStock = previousStocks.current[index];
        return {
          ...stock,
          priceChanged:
            prevStock && stock.closingPrice !== prevStock.closingPrice,
          highChanged: prevStock && stock.highPrice !== prevStock.highPrice,
          lowChanged: prevStock && stock.lowPrice !== prevStock.lowPrice,
          changeValueChanged:
            prevStock && stock.changeValue !== prevStock.changeValue,
          changePercentChanged:
            prevStock && stock.changePercent !== prevStock.changePercent,
        };
      });

      previousStocks.current = data;
      setStocks(updatedData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      const minLoadingTime = 1500; // 최소 로딩 시간 1초
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
    fetchStocks();
    const interval = setInterval(() => {
      fetchStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // `loading` 상태가 변경될 때마다 애니메이션을 재실행
  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0px)",
    config: { tension: 280, friction: 30 },
  });

  return (
    <div className="korea-stocks-table-container">
      <div className="korea-stocks-header">
        <div className="korea-stock-info">종목</div>
        <div className="korea-stock-price">종가</div>
        <div className="korea-stock-price">고가</div>
        <div className="korea-stock-price">저가</div>
        <div className="korea-stock-change">변동</div>
        <div className="korea-stock-change">변동(%)</div>
        <div className="korea-stock-price">거래량</div>
        <div className="korea-stock-time">시간</div>
      </div>
      <div className="currency-item-container">
        {loading
          ? Array.from({ length: 400 }).map((_, index) => (
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
          : stocks.map((stock, index) => (
              <animated.div
                className="korea-stock-item"
                key={index}
                style={springProps} // Apply animation to each stock item
              >
                <div className="korea-stock-info">
                  <img
                    src={
                      parseFloat(stock.changeValue) === 0
                        ? hyphen
                        : parseFloat(stock.changeValue) > 0
                        ? upArrow
                        : downArrow
                    }
                    alt={
                      parseFloat(stock.changeValue) === 0
                        ? "Hyphen"
                        : parseFloat(stock.changeValue) > 0
                        ? "Up"
                        : "Down"
                    }
                    className="arrow-icon"
                  />
                  <span className="korea-stock-name">{stock.stockName}</span>
                </div>
                <div className="korea-stock-price">
                  <span
                    className={`${
                      stock.priceChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.closingPrice}
                  </span>
                </div>
                <div className="korea-stock-price">
                  <span
                    className={`${
                      stock.highChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.highPrice}
                  </span>
                </div>
                <div className="korea-stock-price">
                  <span
                    className={`${
                      stock.lowChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.lowPrice}
                  </span>
                </div>
                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.changeValue) === 0
                      ? "korea-stock-neutral"
                      : parseFloat(stock.changeValue) > 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.changeValueChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.changeValue}
                  </span>
                </div>
                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.changePercent) === 0
                      ? "korea-stock-neutral"
                      : parseFloat(stock.changePercent) > 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.changePercentChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.changePercent}
                  </span>
                </div>
                <div className="korea-stock-price">
                  <span>{stock.volume}</span>
                </div>
                <div className="korea-stock-time">{stock.rateTime}</div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default KoreaStocksPrice;
