// src/components/StocksKospiPrice.js
import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Stocks.module.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png";

const StocksKospiPrice = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousStocks = useRef([]);

  const fetchStocks = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch("http://localhost:8080/api/stockKospiPrice");
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
      console.error("Error fetching KOSPI stock data:", error);
    } finally {
      const minLoadingTime = 1500; // Minimum loading time 1.5 seconds
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

  // Animation for content
  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0px)",
    config: { tension: 280, friction: 30 },
  });

  return (
    <div className={styles.stocksTableContainer}>
      <div className={styles.stocksHeader}>
        <div className={styles.stockInfo}>종목</div>
        <div className={styles.stockPrice}>종가</div>
        <div className={styles.stockPrice}>고가</div>
        <div className={styles.stockPrice}>저가</div>
        <div className={styles.stockChange}>변동</div>
        <div className={styles.stockChange}>변동(%)</div>
        <div className={styles.stockPrice}>거래량</div>
        <div className={styles.stockTime}>시간</div>
      </div>
      <div className={styles.stocksItemContainer}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                height={97.3}
                className={styles.skeletonUi}
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))
          : stocks.map((stock, index) => (
              <animated.div
                className={styles.stockItem}
                key={index}
                style={springProps}
              >
                <div className={styles.stockInfo}>
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
                    className={styles.stocksArrowIcon}
                  />
                  <span className={styles.stockName}>{stock.stockName}</span>
                </div>
                <div className={styles.stockPrice}>
                  <span
                    className={stock.priceChanged ? styles.stockChanged : ""}
                  >
                    {stock.closingPrice}
                  </span>
                </div>
                <div className={styles.stockPrice}>
                  <span
                    className={stock.highChanged ? styles.stockChanged : ""}
                  >
                    {stock.highPrice}
                  </span>
                </div>
                <div className={styles.stockPrice}>
                  <span className={stock.lowChanged ? styles.stockChanged : ""}>
                    {stock.lowPrice}
                  </span>
                </div>
                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.changeValue) === 0
                      ? styles.stockNeutral
                      : parseFloat(stock.changeValue) > 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span
                    className={
                      stock.changeValueChanged ? styles.stockChanged : ""
                    }
                  >
                    {stock.changeValue}
                  </span>
                </div>
                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.changePercent) === 0
                      ? styles.stockNeutral
                      : parseFloat(stock.changePercent) > 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span
                    className={
                      stock.changePercentChanged ? styles.stockChanged : ""
                    }
                  >
                    {stock.changePercent}
                  </span>
                </div>
                <div className={styles.stockPrice}>
                  <span>{stock.volume}</span>
                </div>
                <div className={styles.stockTime}>{stock.rateTime}</div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default StocksKospiPrice;
