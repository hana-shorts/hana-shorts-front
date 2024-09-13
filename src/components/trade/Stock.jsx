import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSpring, animated } from "@react-spring/web";
import "./Stock.css";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png";

const Stock = ({ onSelectStock }) => {
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
      const minLoadingTime = 1500; // 최소 로딩 시간 1.5초
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

  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0px)",
    config: { tension: 280, friction: 30 },
  });

  const handleStockClick = async (stockName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/getTickerCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockName }),
      });

      if (!response.ok) {
        throw new Error("Failed to get ticker code from the server");
      }

      const { tickerCode } = await response.json();
      onSelectStock({ code: tickerCode, name: stockName });
    } catch (error) {
      console.error("Error fetching ticker code:", error);
    }
  };

  return (
    <div className="stock-container">
      <div className="stock-header">
        <div
          className="stock-info"
          style={{ textAlign: "left", paddingLeft: "32px" }}
        >
          종목명
        </div>
        <div className="stock-price">현재가</div>
        <div className="stock-change">전일대비</div>
        <div className="stock-volume">거래 대금</div>
      </div>
      <div className="stock-item-container">
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
                key={index}
                className="stock-item-link"
                onClick={() => handleStockClick(stock.stockName)}
                style={springProps} // Apply animation to each stock item
              >
                <div className="stock-item">
                  <div className="stock-info">
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
                    <span className="stock-name">{stock.stockName}</span>
                  </div>
                  <div className="stock-price">
                    <span
                      className={`${stock.priceChanged ? "stock-changed" : ""}`}
                    >
                      {stock.closingPrice}
                    </span>
                  </div>
                  <div className="stock-change">
                    <span
                      className={`${
                        parseFloat(stock.changePercent) === 0
                          ? "stock-neutral"
                          : parseFloat(stock.changePercent) > 0
                          ? "stock-up"
                          : "stock-down"
                      } ${stock.changePercentChanged ? "stock-changed" : ""}`}
                    >
                      {stock.changePercent}
                    </span>
                    <span
                      className={`${
                        parseFloat(stock.changeValue) === 0
                          ? "stock-neutral"
                          : parseFloat(stock.changeValue) > 0
                          ? "stock-up"
                          : "stock-down"
                      } ${stock.changeValueChanged ? "stock-changed" : ""}`}
                    >
                      {stock.changeValue}
                    </span>
                  </div>
                  <div className="stock-volume">
                    <span>{stock.volume}</span>
                  </div>
                </div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default Stock;
