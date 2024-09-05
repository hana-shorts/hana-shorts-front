import React, { useEffect, useState, useRef } from "react";
import "./Stock.css";
import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png";

const Stock = ({ onSelectStock }) => {
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

  const handleStockClick = async (stockName) => {
    try {
      // 주식명을 Spring으로 전달하고 티커 코드를 받음
      const response = await fetch(`http://localhost:8080/api/getTickerCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockName }),
      });

      if (!response.ok) {
        throw new Error("Failed to get ticker code from the server");
      }

      const { tickerCode } = await response.json();

      // 받은 티커 코드를 상위 컴포넌트로 전달
      onSelectStock(tickerCode);
    } catch (error) {
      console.error("Error fetching ticker code:", error);
    }
  };

  return (
    <div className="stock-container">
      <div className="stock-header">
        <div
          className="stock-info"
          style={{ textAlign: "left", paddingLeft: "32px" }}
        >
          종목명
        </div>
        <div className="stock-price">현재가</div>
        <div className="stock-change">전일대비</div>
        <div className="stock-volume">거래 대금</div>
      </div>
      <div className="stock-item-container">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="stock-item-link"
            onClick={() => handleStockClick(stock.stockName)}
          >
            <div className="stock-item">
              <div className="stock-info">
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
                <span className="stock-name">{stock.stockName}</span>
              </div>
              <div className="stock-price">
                <span
                  className={`${stock.priceChanged ? "stock-changed" : ""}`}
                >
                  {stock.closingPrice}
                </span>
              </div>
              <div className="stock-change">
                <span
                  className={`${
                    parseFloat(stock.changePercent) === 0
                      ? "stock-neutral"
                      : parseFloat(stock.changePercent) > 0
                      ? "stock-up"
                      : "stock-down"
                  } ${stock.changePercentChanged ? "stock-changed" : ""}`}
                >
                  {stock.changePercent}
                </span>
                <span
                  className={`${
                    parseFloat(stock.changeValue) === 0
                      ? "stock-neutral"
                      : parseFloat(stock.changeValue) > 0
                      ? "stock-up"
                      : "stock-down"
                  } ${stock.changeValueChanged ? "stock-changed" : ""}`}
                >
                  {stock.changeValue}
                </span>
              </div>
              <div className="stock-volume">
                <span>{stock.volume}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stock;
