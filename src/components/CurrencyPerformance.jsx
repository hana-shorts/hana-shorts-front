import React, { useEffect, useState, useRef } from "react";
import "./Currency.css";

// 이미지 경로 가져오기
import upArrow from "../assets/images/up_arrow.png";
import downArrow from "../assets/images/down_arrow.png";

const CurrencyPerformance = () => {
  const [periodCurrencies, setPeriodCurrencies] = useState([]);
  const previousPeriodCurrencies = useRef([]);

  // 성과 데이터를 가져오는 함수
  const fetchPeriodCurrencies = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/currencyPeriods");
      const data = await response.json();

      // 이전 데이터와 비교하여 변화된 부분에 클래스를 추가
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

      setPeriodCurrencies(updatedData);
      previousPeriodCurrencies.current = data; // 이전 데이터를 현재 데이터로 업데이트
    } catch (error) {
      console.error("Error fetching period currency data:", error);
    }
  };

  useEffect(() => {
    fetchPeriodCurrencies();
    const interval = setInterval(() => {
      fetchPeriodCurrencies();
    }, 30000); // 30초마다 데이터를 불러옴

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <>
      <div className="currency-header">
        <div className="currency-info">종목</div>
        <div className="currency-change">일간</div>
        <div className="currency-change">주간</div>
        <div className="currency-change">월간</div>
        <div className="currency-change">YTD</div>
        <div className="currency-change">연간</div>
        <div className="currency-change">3년간</div>
      </div>
      {periodCurrencies.map((rate, index) => (
        <div className="currency-item" key={index}>
          <div className="currency-info">
            <img
              src={parseFloat(rate.periodDaily) >= 0 ? upArrow : downArrow}
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
            <span className={`${rate.dailyChanged ? "currency-changed" : ""}`}>
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
            <span className={`${rate.weeklyChanged ? "currency-changed" : ""}`}>
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
              className={`${rate.monthlyChanged ? "currency-changed" : ""}`}
            >
              {rate.periodMonthly}
            </span>
          </div>

          <div
            className={`currency-change ${
              parseFloat(rate.periodYtd) >= 0 ? "currency-up" : "currency-down"
            }`}
          >
            <span className={`${rate.ytdChanged ? "currency-changed" : ""}`}>
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
            <span className={`${rate.yearlyChanged ? "currency-changed" : ""}`}>
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
              className={`${rate.threeYearsChanged ? "currency-changed" : ""}`}
            >
              {rate.period3years}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default CurrencyPerformance;
