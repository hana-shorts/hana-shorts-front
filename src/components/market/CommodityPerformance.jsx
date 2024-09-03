import React, { useEffect, useState, useRef } from "react";
import "./Commodity.css";

// 이미지 경로 가져오기
import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const CommodityPerformance = () => {
  const [periodCommodities, setPeriodCommodities] = useState([]);
  const previousPeriodCommodities = useRef([]);

  // 성과 데이터를 가져오는 함수
  const fetchPeriodCommodities = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/commodityPeriods"
      );
      const data = await response.json();

      // 이전 데이터와 비교하여 변화된 부분에 클래스를 추가
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

      setPeriodCommodities(updatedData);
      previousPeriodCommodities.current = data; // 이전 데이터를 현재 데이터로 업데이트
    } catch (error) {
      console.error("Error fetching period commodity data:", error);
    }
  };

  useEffect(() => {
    fetchPeriodCommodities();
    const interval = setInterval(() => {
      fetchPeriodCommodities();
    }, 30000); // 30초마다 데이터를 불러옴

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <>
      <div className="commodity-header">
        <div className="commodity-info">종목</div>
        <div className="commodity-change">일간</div>
        <div className="commodity-change">주간</div>
        <div className="commodity-change">월간</div>
        <div className="commodity-change">YTD</div>
        <div className="commodity-change">연간</div>
        <div className="commodity-change">3년간</div>
      </div>
      {periodCommodities.map((commodity, index) => (
        <div className="commodity-item" key={index}>
          <div className="commodity-info">
            <img
              src={parseFloat(commodity.periodDaily) >= 0 ? upArrow : downArrow}
              alt={parseFloat(commodity.periodDaily) >= 0 ? "Up" : "Down"}
              className="arrow-icon"
            />
            <span className="commodity-name">{commodity.commodityName}</span>
          </div>

          <div
            className={`commodity-change ${
              parseFloat(commodity.periodDaily) >= 0
                ? "commodity-up"
                : "commodity-down"
            }`}
          >
            <span
              className={`${commodity.dailyChanged ? "commodity-changed" : ""}`}
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
              className={`${commodity.ytdChanged ? "commodity-changed" : ""}`}
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
        </div>
      ))}
    </>
  );
};

export default CommodityPerformance;
