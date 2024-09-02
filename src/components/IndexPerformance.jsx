import React, { useEffect, useState, useRef } from "react";
import "./Index.css";

// 이미지 경로 가져오기
import upArrow from "../assets/images/up_arrow.png";
import downArrow from "../assets/images/down_arrow.png";

const IndexPerformance = () => {
  const [periodIndices, setPeriodIndices] = useState([]);
  const previousPeriodIndices = useRef([]);

  // 성과 데이터를 가져오는 함수
  const fetchPeriodIndices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/indexPeriods");
      const data = await response.json();

      // 이전 데이터와 비교하여 변화된 부분에 클래스를 추가
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

      setPeriodIndices(updatedData);
      previousPeriodIndices.current = data; // 이전 데이터를 현재 데이터로 업데이트
    } catch (error) {
      console.error("Error fetching period index data:", error);
    }
  };

  useEffect(() => {
    fetchPeriodIndices();
    const interval = setInterval(() => {
      fetchPeriodIndices();
    }, 30000); // 30초마다 데이터를 불러옴

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <>
      <div className="index-header">
        <div className="index-info">종목</div>
        <div className="index-change">일간</div>
        <div className="index-change">주간</div>
        <div className="index-change">월간</div>
        <div className="index-change">YTD</div>
        <div className="index-change">연간</div>
        <div className="index-change">3년간</div>
      </div>
      {periodIndices.map((index, i) => (
        <div className="index-item" key={i}>
          <div className="index-info">
            <img
              src={parseFloat(index.periodDaily) >= 0 ? upArrow : downArrow}
              alt={parseFloat(index.periodDaily) >= 0 ? "Up" : "Down"}
              className="arrow-icon"
            />
            <span className="index-name">{index.indexName}</span>
          </div>

          <div
            className={`index-change ${
              parseFloat(index.periodDaily) >= 0 ? "index-up" : "index-down"
            }`}
          >
            <span
              className={`${index.periodDailyChanged ? "index-changed" : ""}`}
            >
              {index.periodDaily}
            </span>
          </div>

          <div
            className={`index-change ${
              parseFloat(index.periodWeekly) >= 0 ? "index-up" : "index-down"
            }`}
          >
            <span
              className={`${index.periodWeeklyChanged ? "index-changed" : ""}`}
            >
              {index.periodWeekly}
            </span>
          </div>

          <div
            className={`index-change ${
              parseFloat(index.periodMonthly) >= 0 ? "index-up" : "index-down"
            }`}
          >
            <span
              className={`${index.periodMonthlyChanged ? "index-changed" : ""}`}
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
              className={`${index.periodYtdChanged ? "index-changed" : ""}`}
            >
              {index.periodYtd}
            </span>
          </div>

          <div
            className={`index-change ${
              parseFloat(index.periodYearly) >= 0 ? "index-up" : "index-down"
            }`}
          >
            <span
              className={`${index.periodYearlyChanged ? "index-changed" : ""}`}
            >
              {index.periodYearly}
            </span>
          </div>

          <div
            className={`index-change ${
              parseFloat(index.period3Years) >= 0 ? "index-up" : "index-down"
            }`}
          >
            <span
              className={`${index.period3YearsChanged ? "index-changed" : ""}`}
            >
              {index.period3Years}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default IndexPerformance;
