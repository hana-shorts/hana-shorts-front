// src/components/StocksKosdaqPerformance.js
import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Stocks.module.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const StocksKosdaqPerformance = () => {
  const [periodStocks, setPeriodStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousPeriodStocks = useRef([]);

  const fetchPeriodStocks = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch(
        "http://localhost:8080/api/stockKosdaqPerformance"
      );
      const data = await response.json();

      const updatedData = data.map((stock, index) => {
        const prevStock = previousPeriodStocks.current[index];
        return {
          ...stock,
          dailyChanged:
            prevStock && stock.periodDaily !== prevStock.periodDaily,
          weeklyChanged:
            prevStock && stock.periodWeekly !== prevStock.periodWeekly,
          monthlyChanged:
            prevStock && stock.periodMonthly !== prevStock.periodMonthly,
          ytdChanged: prevStock && stock.periodYtd !== prevStock.periodYtd,
          yearlyChanged:
            prevStock && stock.periodYearly !== prevStock.periodYearly,
          threeYearsChanged:
            prevStock && stock.period3Years !== prevStock.period3Years,
        };
      });

      previousPeriodStocks.current = data;
      setPeriodStocks(updatedData);
    } catch (error) {
      console.error("Error fetching KOSDAQ period stock data:", error);
    } finally {
      const minLoadingTime = 1500;
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
    fetchPeriodStocks();
    const interval = setInterval(() => {
      fetchPeriodStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0px)",
    config: { tension: 400, friction: 30 },
  });

  return (
    <div className={styles.stocksTableContainer}>
      <div className={styles.stocksHeader}>
        <div className={styles.stockInfo}>종목</div>
        <div className={styles.stockChange}>일간</div>
        <div className={styles.stockChange}>주간</div>
        <div className={styles.stockChange}>월간</div>
        <div className={styles.stockChange}>YTD</div>
        <div className={styles.stockChange}>연간</div>
        <div className={styles.stockChange}>3년간</div>
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
          : periodStocks.map((stock, index) => (
              <animated.div
                className={styles.stockItem}
                key={index}
                style={springProps}
              >
                <div className={styles.stockInfo}>
                  <img
                    src={
                      parseFloat(stock.periodDaily) >= 0 ? upArrow : downArrow
                    }
                    alt={parseFloat(stock.periodDaily) >= 0 ? "Up" : "Down"}
                    className={styles.stocksArrowIcon}
                  />
                  <span className={styles.stockName}>{stock.stockName}</span>
                </div>

                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.periodDaily) >= 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span
                    className={stock.dailyChanged ? styles.stockChanged : ""}
                  >
                    {stock.periodDaily}
                  </span>
                </div>

                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.periodWeekly) >= 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span
                    className={stock.weeklyChanged ? styles.stockChanged : ""}
                  >
                    {stock.periodWeekly}
                  </span>
                </div>

                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.periodMonthly) >= 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span
                    className={stock.monthlyChanged ? styles.stockChanged : ""}
                  >
                    {stock.periodMonthly}
                  </span>
                </div>

                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.periodYtd) >= 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span className={stock.ytdChanged ? styles.stockChanged : ""}>
                    {stock.periodYtd}
                  </span>
                </div>

                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.periodYearly) >= 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span
                    className={stock.yearlyChanged ? styles.stockChanged : ""}
                  >
                    {stock.periodYearly}
                  </span>
                </div>

                <div
                  className={`${styles.stockChange} ${
                    parseFloat(stock.period3Years) >= 0
                      ? styles.stockUp
                      : styles.stockDown
                  }`}
                >
                  <span
                    className={
                      stock.threeYearsChanged ? styles.stockChanged : ""
                    }
                  >
                    {stock.period3Years}
                  </span>
                </div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default StocksKosdaqPerformance;
