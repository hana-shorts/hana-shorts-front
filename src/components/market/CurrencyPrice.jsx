import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Currency.css";
import { useSpring, animated } from "@react-spring/web";

import upArrow from "../../assets/images/up_arrow.png";
import downArrow from "../../assets/images/down_arrow.png";
import hyphen from "../../assets/images/hyphen.png"; // Hyphen 이미지 추가

const CurrencyPrice = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousCurrencies = useRef([]);

  const fetchCurrencies = async () => {
    const startTime = Date.now(); // 시작 시간 기록
    try {
      const response = await fetch("http://localhost:8080/api/currencyPrice");
      const data = await response.json();

      const updatedData = data.map((rate, index) => {
        const prevRate = previousCurrencies.current[index];
        return {
          ...rate,
          buyPriceChanged: prevRate && rate.buyPrice !== prevRate.buyPrice,
          sellPriceChanged: prevRate && rate.sellPrice !== prevRate.sellPrice,
          highPriceChanged: prevRate && rate.highPrice !== prevRate.highPrice,
          lowPriceChanged: prevRate && rate.lowPrice !== prevRate.lowPrice,
          changeValueChanged:
            prevRate && rate.changeValue !== prevRate.changeValue,
          changePercentChanged:
            prevRate && rate.changePercent !== prevRate.changePercent,
        };
      });

      previousCurrencies.current = data;
      setCurrencies(updatedData);
    } catch (error) {
      console.error("Error fetching currency data:", error);
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
    fetchCurrencies();
    const interval = setInterval(() => {
      fetchCurrencies();
    }, 30000); // 30초마다 데이터를 불러옴

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
        <div className="currency-price">매수</div>
        <div className="currency-price">매도</div>
        <div className="currency-price">고가</div>
        <div className="currency-price">저가</div>
        <div className="currency-change">변동</div>
        <div className="currency-change">변동(%)</div>
        <div className="currency-time">시간</div>
      </div>
      <div className="currency-item-container">
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
          : currencies.map((rate, index) => (
              <animated.div
                key={index}
                style={springProps} // Apply animation to each currency item
                className="currency-item"
              >
                <div className="currency-info">
                  <img
                    src={
                      parseFloat(rate.changeValue) === 0
                        ? hyphen
                        : parseFloat(rate.changeValue) > 0
                        ? upArrow
                        : downArrow
                    }
                    alt={
                      parseFloat(rate.changeValue) === 0
                        ? "Hyphen"
                        : parseFloat(rate.changeValue) > 0
                        ? "Up"
                        : "Down"
                    }
                    className="currency-arrow-icon"
                  />
                  <span className="currency-name">{rate.currencyName}</span>
                </div>
                <div className="currency-price">
                  <span
                    className={`${
                      rate.buyPriceChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.buyPrice}
                  </span>
                </div>
                <div className="currency-price">
                  <span
                    className={`${
                      rate.sellPriceChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.sellPrice}
                  </span>
                </div>
                <div className="currency-price">
                  <span
                    className={`${
                      rate.highPriceChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.highPrice}
                  </span>
                </div>
                <div className="currency-price">
                  <span
                    className={`${
                      rate.lowPriceChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.lowPrice}
                  </span>
                </div>
                <div
                  className={`currency-change ${
                    parseFloat(rate.changeValue) === 0
                      ? "currency-neutral"
                      : parseFloat(rate.changeValue) > 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${
                      rate.changeValueChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.changeValue}
                  </span>
                </div>
                <div
                  className={`currency-change ${
                    parseFloat(rate.changePercent) === 0
                      ? "currency-neutral"
                      : parseFloat(rate.changePercent) > 0
                      ? "currency-up"
                      : "currency-down"
                  }`}
                >
                  <span
                    className={`${
                      rate.changePercentChanged ? "currency-changed" : ""
                    }`}
                  >
                    {rate.changePercent}
                  </span>
                </div>
                <div className="currency-time">{rate.rateTime}</div>
              </animated.div>
            ))}
      </div>
    </div>
  );
};

export default CurrencyPrice;
