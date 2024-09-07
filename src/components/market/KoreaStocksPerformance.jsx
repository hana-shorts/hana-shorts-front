import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./KoreaStocks.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const KoreaStocksPerformance = () => {
  const [periodStocks, setPeriodStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousPeriodStocks = useRef([]);

  const fetchPeriodStocks = async () => {
    const startTime = Date.now(); // 시작 시간 기록
    try {
      const response = await fetch("http://localhost:8080/api/stockPeriods");
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
      console.error("Error fetching period stock data:", error);
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
    fetchPeriodStocks();
    const interval = setInterval(() => {
      fetchPeriodStocks();
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
    <div className="korea-stocks-table-container">
      <div className="korea-stocks-header">
        <div className="korea-stock-info">종목</div>
        <div className="korea-stock-change">일간</div>
        <div className="korea-stock-change">주간</div>
        <div className="korea-stock-change">월간</div>
        <div className="korea-stock-change">YTD</div>
        <div className="korea-stock-change">연간</div>
        <div className="korea-stock-change">3년간</div>
      </div>
      <div className="korea-stocks-item-container">
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
          : periodStocks.map((stock, index) => (
              <animated.div
                className="korea-stock-item"
                key={index}
                style={springProps} // Apply animation to each stock item
              >
                <div className="korea-stock-info">
                  <img
                    src={
                      parseFloat(stock.periodDaily) >= 0 ? upArrow : downArrow
                    }
                    alt={parseFloat(stock.periodDaily) >= 0 ? "Up" : "Down"}
                    className="arrow-icon"
                  />
                  <span className="korea-stock-name">{stock.stockName}</span>
                </div>

                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.periodDaily) >= 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.dailyChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.periodDaily}
                  </span>
                </div>

                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.periodWeekly) >= 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.weeklyChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.periodWeekly}
                  </span>
                </div>

                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.periodMonthly) >= 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.monthlyChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.periodMonthly}
                  </span>
                </div>

                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.periodYtd) >= 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.ytdChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.periodYtd}
                  </span>
                </div>

                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.periodYearly) >= 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.yearlyChanged ? "korea-stock-changed" : ""
                    }`}
                  >
                    {stock.periodYearly}
                  </span>
                </div>

                <div
                  className={`korea-stock-change ${
                    parseFloat(stock.period3Years) >= 0
                      ? "korea-stock-up"
                      : "korea-stock-down"
                  }`}
                >
                  <span
                    className={`${
                      stock.threeYearsChanged ? "korea-stock-changed" : ""
                    }`}
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

export default KoreaStocksPerformance;
