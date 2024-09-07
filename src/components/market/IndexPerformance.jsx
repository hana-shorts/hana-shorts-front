import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Index.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const IndexPerformance = () => {
  const [periodIndices, setPeriodIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousPeriodIndices = useRef([]);

  const fetchPeriodIndices = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch("http://localhost:8080/api/indexPeriods");
      const data = await response.json();

      const updatedData = data.map((index, i) => {
        const prevIndex = previousPeriodIndices.current[i];
        return {
          ...index,
          periodDailyChanged:
            prevIndex && index.periodDaily !== prevIndex.periodDaily,
          periodWeeklyChanged:
            prevIndex && index.periodWeekly !== prevIndex.periodWeekly,
          periodMonthlyChanged:
            prevIndex && index.periodMonthly !== prevIndex.periodMonthly,
          periodYtdChanged:
            prevIndex && index.periodYtd !== prevIndex.periodYtd,
          periodYearlyChanged:
            prevIndex && index.periodYearly !== prevIndex.periodYearly,
          period3YearsChanged:
            prevIndex && index.period3Years !== prevIndex.period3Years,
        };
      });

      previousPeriodIndices.current = data;
      setPeriodIndices(updatedData);
    } catch (error) {
      console.error("Error fetching period index data:", error);
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
    fetchPeriodIndices();
    const interval = setInterval(() => {
      fetchPeriodIndices();
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
        <div className="index-change">일간</div>
        <div className="index-change">주간</div>
        <div className="index-change">월간</div>
        <div className="index-change">YTD</div>
        <div className="index-change">연간</div>
        <div className="index-change">3년간</div>
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
          : periodIndices.map((index, i) => (
              <animated.div
                className="index-item"
                key={i}
                style={springProps} // Apply animation to each index item
              >
                <div className="index-info">
                  <img
                    src={
                      parseFloat(index.periodDaily) >= 0 ? upArrow : downArrow
                    }
                    alt={parseFloat(index.periodDaily) >= 0 ? "Up" : "Down"}
                    className="arrow-icon"
                  />
                  <span className="index-name">{index.indexName}</span>
                </div>

                <div
                  className={`index-change ${
                    parseFloat(index.periodDaily) >= 0
                      ? "index-up"
                      : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.periodDailyChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.periodDaily}
                  </span>
                </div>

                <div
                  className={`index-change ${
                    parseFloat(index.periodWeekly) >= 0
                      ? "index-up"
                      : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.periodWeeklyChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.periodWeekly}
                  </span>
                </div>

                <div
                  className={`index-change ${
                    parseFloat(index.periodMonthly) >= 0
                      ? "index-up"
                      : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.periodMonthlyChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.periodMonthly}
                  </span>
                </div>

                <div
                  className={`index-change ${
                    parseFloat(index.periodYtd) >= 0 ? "index-up" : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.periodYtdChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.periodYtd}
                  </span>
                </div>

                <div
                  className={`index-change ${
                    parseFloat(index.periodYearly) >= 0
                      ? "index-up"
                      : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.periodYearlyChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.periodYearly}
                  </span>
                </div>

                <div
                  className={`index-change ${
                    parseFloat(index.period3Years) >= 0
                      ? "index-up"
                      : "index-down"
                  }`}
                >
                  <span
                    className={`${
                      index.period3YearsChanged ? "index-changed" : ""
                    }`}
                  >
                    {index.period3Years}
                  </span>
                </div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default IndexPerformance;
