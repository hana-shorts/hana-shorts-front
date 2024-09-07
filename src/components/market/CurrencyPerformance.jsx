import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Currency.css";
import { useSpring, animated } from "@react-spring/web"; // Import animation hook

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const CurrencyPerformance = () => {
  const [periodCurrencies, setPeriodCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousPeriodCurrencies = useRef([]);

  const fetchPeriodCurrencies = async () => {
    const startTime = Date.now(); // 시작 시간 기록
    try {
      const response = await fetch("http://localhost:8080/api/currencyPeriods");
      const data = await response.json();

      const updatedData = data.map((rate, index) => {
        const prevRate = previousPeriodCurrencies.current[index];
        return {
          ...rate,
          dailyChanged: prevRate && rate.periodDaily !== prevRate.periodDaily,
          weeklyChanged:
            prevRate && rate.periodWeekly !== prevRate.periodWeekly,
          monthlyChanged:
            prevRate && rate.periodMonthly !== prevRate.periodMonthly,
          ytdChanged: prevRate && rate.periodYtd !== prevRate.periodYtd,
          yearlyChanged:
            prevRate && rate.periodYearly !== prevRate.periodYearly,
          threeYearsChanged:
            prevRate && rate.period3years !== prevRate.period3years,
        };
      });

      previousPeriodCurrencies.current = data;
      setPeriodCurrencies(updatedData);
    } catch (error) {
      console.error("Error fetching period currency data:", error);
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
    fetchPeriodCurrencies();
    const interval = setInterval(() => {
      fetchPeriodCurrencies();
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
    <div className="currency-table-container">
      <div className="currency-header">
        <div className="currency-info">종목</div>
        <div className="currency-change">일간</div>
        <div className="currency-change">주간</div>
        <div className="currency-change">월간</div>
        <div className="currency-change">YTD</div>
        <div className="currency-change">연간</div>
        <div className="currency-change">3년간</div>
      </div>
      <div className="currency-item-container">
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
          : periodCurrencies.map((rate, index) => (
              <animated.div
                key={index}
                style={springProps} // Apply animation to each currency item
                className="currency-item"
              >
                <div className="currency-info">
                  <img
                    src={
                      parseFloat(rate.periodDaily) >= 0 ? upArrow : downArrow
                    }
                    alt={parseFloat(rate.periodDaily) >= 0 ? "Up" : "Down"}
                    className="arrow-icon"
                  />
                  <span className="currency-name">{rate.currencyName}</span>
                </div>

                <div
                  className={`currency-change ${
                    parseFloat(rate.periodDaily) >= 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${rate.dailyChanged ? "currency-changed" : ""}`}
                  >
                    {rate.periodDaily}
                  </span>
                </div>

                <div
                  className={`currency-change ${
                    parseFloat(rate.periodWeekly) >= 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${
                      rate.weeklyChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.periodWeekly}
                  </span>
                </div>

                <div
                  className={`currency-change ${
                    parseFloat(rate.periodMonthly) >= 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${
                      rate.monthlyChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.periodMonthly}
                  </span>
                </div>

                <div
                  className={`currency-change ${
                    parseFloat(rate.periodYtd) >= 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${rate.ytdChanged ? "currency-changed" : ""}`}
                  >
                    {rate.periodYtd}
                  </span>
                </div>

                <div
                  className={`currency-change ${
                    parseFloat(rate.periodYearly) >= 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${
                      rate.yearlyChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.periodYearly}
                  </span>
                </div>

                <div
                  className={`currency-change ${
                    parseFloat(rate.period3years) >= 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${
                      rate.threeYearsChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.period3years}
                  </span>
                </div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default CurrencyPerformance;
