import React, { useEffect, useState, useRef } from "react";
import "./KoreaStocks.css";
import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png"; // Hyphen 이미지 추가

const KoreaStocksPrice = () => {
  const [stocks, setStocks] = useState([]);
  const previousStocks = useRef([]);

  const fetchStocks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/stocks");
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

      setStocks(updatedData);
      previousStocks.current = data;
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(() => {
      fetchStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="korea-stocks-header">
        <div className="korea-stock-info">종목</div>
        <div className="korea-stock-price">종가</div>
        <div className="korea-stock-price">고가</div>
        <div className="korea-stock-price">저가</div>
        <div className="korea-stock-change">변동</div>
        <div className="korea-stock-change">변동(%)</div>
        <div className="korea-stock-price">거래량</div>
        <div className="korea-stock-time">시간</div>
      </div>
      {stocks.map((stock, index) => (
        <div className="korea-stock-item" key={index}>
          <div className="korea-stock-info">
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
              className="arrow-icon"
            />
            <span className="korea-stock-name">{stock.stockName}</span>
          </div>
          <div className="korea-stock-price">
            <span
              className={`${stock.priceChanged ? "korea-stock-changed" : ""}`}
            >
              {stock.closingPrice}
            </span>
          </div>
          <div className="korea-stock-price">
            <span
              className={`${stock.highChanged ? "korea-stock-changed" : ""}`}
            >
              {stock.highPrice}
            </span>
          </div>
          <div className="korea-stock-price">
            <span
              className={`${stock.lowChanged ? "korea-stock-changed" : ""}`}
            >
              {stock.lowPrice}
            </span>
          </div>
          <div
            className={`korea-stock-change ${
              parseFloat(stock.changeValue) === 0
                ? "korea-stock-neutral"
                : parseFloat(stock.changeValue) > 0
                ? "korea-stock-up"
                : "korea-stock-down"
            }`}
          >
            <span
              className={`${
                stock.changeValueChanged ? "korea-stock-changed" : ""
              }`}
            >
              {stock.changeValue}
            </span>
          </div>
          <div
            className={`korea-stock-change ${
              parseFloat(stock.changePercent) === 0
                ? "korea-stock-neutral"
                : parseFloat(stock.changePercent) > 0
                ? "korea-stock-up"
                : "korea-stock-down"
            }`}
          >
            <span
              className={`${
                stock.changePercentChanged ? "korea-stock-changed" : ""
              }`}
            >
              {stock.changePercent}
            </span>
          </div>
          <div className="korea-stock-price">
            <span>{stock.volume}</span>
          </div>
          <div className="korea-stock-time">{stock.rateTime}</div>
        </div>
      ))}
    </>
  );
};

export default KoreaStocksPrice;
