import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Commodity.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const CommodityPerformance = () => {
  const [periodCommodities, setPeriodCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousPeriodCommodities = useRef([]);

  const fetchPeriodCommodities = async () => {
    const startTime = Date.now(); // 시작 시간 기록
    try {
      const response = await fetch(
        "http://localhost:8080/api/commodityPerformance"
      );
      const data = await response.json();

      const updatedData = data.map((commodity, index) => {
        const prevCommodity = previousPeriodCommodities.current[index];
        return {
          ...commodity,
          dailyChanged:
            prevCommodity &&
            commodity.periodDaily !== prevCommodity.periodDaily,
          weeklyChanged:
            prevCommodity &&
            commodity.periodWeekly !== prevCommodity.periodWeekly,
          monthlyChanged:
            prevCommodity &&
            commodity.periodMonthly !== prevCommodity.periodMonthly,
          ytdChanged:
            prevCommodity && commodity.periodYtd !== prevCommodity.periodYtd,
          yearlyChanged:
            prevCommodity &&
            commodity.periodYearly !== prevCommodity.periodYearly,
          threeYearsChanged:
            prevCommodity &&
            commodity.period3Years !== prevCommodity.period3Years,
        };
      });

      previousPeriodCommodities.current = data;
      setPeriodCommodities(updatedData);
    } catch (error) {
      console.error("Error fetching period commodity data:", error);
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
    fetchPeriodCommodities();
    const interval = setInterval(() => {
      fetchPeriodCommodities();
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
        <div className="commodity-change">일간</div>
        <div className="commodity-change">주간</div>
        <div className="commodity-change">월간</div>
        <div className="commodity-change">YTD</div>
        <div className="commodity-change">연간</div>
        <div className="commodity-change">3년간</div>
      </div>
      <div className="commodity-item-container">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                height={97.3}
                className="skeleton-ui"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))
          : periodCommodities.map((commodity, index) => (
              <animated.div
                key={index}
                style={springProps}
                className="commodity-item"
              >
                <div className="commodity-info">
                  <img
                    src={
                      parseFloat(commodity.periodDaily) >= 0
                        ? upArrow
                        : downArrow
                    }
                    alt={parseFloat(commodity.periodDaily) >= 0 ? "Up" : "Down"}
                    className="commodity-arrow-icon"
                  />
                  <span className="commodity-name">
                    {commodity.commodityName}
                  </span>
                </div>

                <div
                  className={`commodity-change ${
                    parseFloat(commodity.periodDaily) >= 0
                      ? "commodity-up"
                      : "commodity-down"
                  }`}
                >
                  <span
                    className={`${
                      commodity.dailyChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.periodDaily}
                  </span>
                </div>

                <div
                  className={`commodity-change ${
                    parseFloat(commodity.periodWeekly) >= 0
                      ? "commodity-up"
                      : "commodity-down"
                  }`}
                >
                  <span
                    className={`${
                      commodity.weeklyChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.periodWeekly}
                  </span>
                </div>

                <div
                  className={`commodity-change ${
                    parseFloat(commodity.periodMonthly) >= 0
                      ? "commodity-up"
                      : "commodity-down"
                  }`}
                >
                  <span
                    className={`${
                      commodity.monthlyChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.periodMonthly}
                  </span>
                </div>

                <div
                  className={`commodity-change ${
                    parseFloat(commodity.periodYtd) >= 0
                      ? "commodity-up"
                      : "commodity-down"
                  }`}
                >
                  <span
                    className={`${
                      commodity.ytdChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.periodYtd}
                  </span>
                </div>

                <div
                  className={`commodity-change ${
                    parseFloat(commodity.periodYearly) >= 0
                      ? "commodity-up"
                      : "commodity-down"
                  }`}
                >
                  <span
                    className={`${
                      commodity.yearlyChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.periodYearly}
                  </span>
                </div>

                <div
                  className={`commodity-change ${
                    parseFloat(commodity.period3Years) >= 0
                      ? "commodity-up"
                      : "commodity-down"
                  }`}
                >
                  <span
                    className={`${
                      commodity.threeYearsChanged ? "commodity-changed" : ""
                    }`}
                  >
                    {commodity.period3Years}
                  </span>
                </div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default CommodityPerformance;
