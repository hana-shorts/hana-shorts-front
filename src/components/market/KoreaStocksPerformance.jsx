import React, { useEffect, useState, useRef } from "react";
import "./KoreaStocks.css";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";

const KoreaStocksPerformance = () => {
  const [periodStocks, setPeriodStocks] = useState([]);
  const previousPeriodStocks = useRef([]);

  const fetchPeriodStocks = async () => {
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

      setPeriodStocks(updatedData);
      previousPeriodStocks.current = data;
    } catch (error) {
      console.error("Error fetching period stock data:", error);
    }
  };

  useEffect(() => {
    fetchPeriodStocks();
    const interval = setInterval(() => {
      fetchPeriodStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="korea-stocks-header">
        <div className="korea-stock-info">종목</div>
        <div className="korea-stock-change">일간</div>
        <div className="korea-stock-change">주간</div>
        <div className="korea-stock-change">월간</div>
        <div className="korea-stock-change">YTD</div>
        <div className="korea-stock-change">연간</div>
        <div className="korea-stock-change">3년간</div>
      </div>
      {periodStocks.map((stock, index) => (
        <div className="korea-stock-item" key={index}>
          <div className="korea-stock-info">
            <img
              src={parseFloat(stock.periodDaily) >= 0 ? upArrow : downArrow}
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
              className={`${stock.dailyChanged ? "korea-stock-changed" : ""}`}
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
              className={`${stock.weeklyChanged ? "korea-stock-changed" : ""}`}
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
              className={`${stock.monthlyChanged ? "korea-stock-changed" : ""}`}
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
              className={`${stock.ytdChanged ? "korea-stock-changed" : ""}`}
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
              className={`${stock.yearlyChanged ? "korea-stock-changed" : ""}`}
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
        </div>
      ))}
    </>
  );
};

export default KoreaStocksPerformance;
