// src/components/trade/Stock.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSpring, animated } from "@react-spring/web";
import "./Stock.css";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png";
import magnifier from "../../assets/images/magnifier.png";

const Stock = ({ onSelectStock }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketType, setMarketType] = useState("KOSPI"); // 시장 타입 상태 추가
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const previousStocks = useRef([]);
  const navigate = useNavigate(); // useNavigate 사용

  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef({});

  const fetchStocks = useCallback(async () => {
    const startTime = Date.now(); // 시작 시간 기록
    try {
      const endpoint =
        marketType === "KOSPI"
          ? "http://localhost:8080/api/stockKospiPrice"
          : "http://localhost:8080/api/stockKosdaqPrice"; // marketType에 따른 엔드포인트
      const response = await fetch(endpoint);
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

      previousStocks.current = data;
      setStocks(updatedData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      const minLoadingTime = 1500; // 최소 로딩 시간 1.5초
      const loadTime = Date.now() - startTime;

      if (loadTime < minLoadingTime) {
        setTimeout(() => setLoading(false), minLoadingTime - loadTime);
      } else {
        setLoading(false);
      }
    }
  }, [marketType]);

  useEffect(() => {
    setLoading(true);
    fetchStocks();
    const interval = setInterval(() => {
      fetchStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStocks]);

  useEffect(() => {
    const activeTabRef = tabsRef.current[marketType];
    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;
      setIndicatorStyle({
        left: offsetLeft,
        width: clientWidth,
      });
    }
  }, [marketType]);

  const handleMarketChange = (newMarket) => {
    setMarketType(newMarket);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // 검색어에 맞게 필터링
  const filteredStocks = stocks.filter((stock) =>
    (stock.stockName || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase())
  );

  const springProps = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0px)",
    config: { tension: 280, friction: 30 },
  });

  const handleStockClick = async (stockName) => {
    try {
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
      onSelectStock({ code: tickerCode, name: stockName });
      navigate(`/trade/${tickerCode}`); // 주식 코드로 경로 변경
    } catch (error) {
      console.error("Error fetching ticker code:", error);
    }
  };

  return (
    <div className="stock-container">
      {/* 검색창 */}
      <div className="stock-search-container">
        {/*magnifier 아이콘 추가*/}
        <img src={magnifier} className="stock-search-icon" alt="Search Icon" />
        <input
          type="text"
          className="stock-search-input"
          placeholder="주식 검색"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* KOSPI / KOSDAQ 탭 */}
      <div className="stock-market-tabs">
        <div
          ref={(el) => (tabsRef.current["KOSPI"] = el)}
          className={`stock-market-tab ${
            marketType === "KOSPI" ? "active-market" : ""
          }`}
          onClick={() => handleMarketChange("KOSPI")}
        >
          KOSPI
        </div>
        <div
          ref={(el) => (tabsRef.current["KOSDAQ"] = el)}
          className={`stock-market-tab ${
            marketType === "KOSDAQ" ? "active-market" : ""
          }`}
          onClick={() => handleMarketChange("KOSDAQ")}
        >
          KOSDAQ
        </div>
        {/* 슬라이딩 인디케이터 */}
        <span
          className="stock-market-tab-indicator"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        ></span>
      </div>

      {/* 헤더 */}
      <div className="stock-header">
        <div className="stock-info">종목명</div>
        <div className="stock-price">현재가</div>
        <div className="stock-change">전일대비</div>
        <div className="stock-volume">거래 대금</div>
      </div>

      {/* 주식 리스트 */}
      <div className="stock-item-container">
        {loading
          ? Array.from({ length: 16 }).map((_, index) => (
              <Skeleton
                key={index}
                height={99.4}
                className="skeleton-ui"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))
          : filteredStocks.map((stock, index) => (
              <animated.div
                key={index}
                className="stock-item-link"
                onClick={() => handleStockClick(stock.stockName)}
                style={springProps}
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
                      className="stock-arrow-icon"
                    />
                    <span className="stock-name">{stock.stockName}</span>
                  </div>
                  <div className="stock-price">
                    {/* 검색 중이 아닐 때만 changed 스타일 적용 */}
                    <span
                      className={`${
                        searchTerm === "" && stock.priceChanged
                          ? "stock-changed"
                          : ""
                      }`}
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
                      } ${
                        searchTerm === "" && stock.changePercentChanged
                          ? "stock-changed"
                          : ""
                      }`}
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
                      } ${
                        searchTerm === "" && stock.changeValueChanged
                          ? "stock-changed"
                          : ""
                      }`}
                    >
                      {stock.changeValue}
                    </span>
                  </div>
                  <div className="stock-volume">
                    <span>{stock.volume}</span>
                  </div>
                </div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default Stock;
