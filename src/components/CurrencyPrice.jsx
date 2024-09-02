import React, { useEffect, useState, useRef } from "react";
import "./Currency.css";

// 이미지 경로 가져오기
import upArrow from "../assets/images/up_arrow.png";
import downArrow from "../assets/images/down_arrow.png";

const CurrencyPrice = () => {
  const [currencies, setCurrencies] = useState([]);
  const previousCurrencies = useRef([]);

  // 데이터를 가져오는 함수
  const fetchCurrencies = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/currencies");
      const data = await response.json();

      // 이전 데이터와 비교하여 변화된 부분에 클래스를 추가
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

      setCurrencies(updatedData);
      previousCurrencies.current = data; // 이전 데이터를 현재 데이터로 업데이트
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
    const interval = setInterval(() => {
      fetchCurrencies();
    }, 30000); // 30초마다 데이터를 불러옴

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <>
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
      {currencies.map((rate, index) => (
        <div className="currency-item" key={index}>
          <div className="currency-info">
            <img
              src={parseFloat(rate.changeValue) >= 0 ? upArrow : downArrow}
              alt={parseFloat(rate.changeValue) >= 0 ? "Up" : "Down"}
              className="arrow-icon"
            />
            <span className="currency-name">{rate.currencyName}</span>
          </div>
          <div className="currency-price">
            <span
              className={`${rate.buyPriceChanged ? "currency-changed" : ""}`}
            >
              {rate.buyPrice}
            </span>
          </div>
          <div className="currency-price">
            <span
              className={`${rate.sellPriceChanged ? "currency-changed" : ""}`}
            >
              {rate.sellPrice}
            </span>
          </div>
          <div className="currency-price">
            <span
              className={`${rate.highPriceChanged ? "currency-changed" : ""}`}
            >
              {rate.highPrice}
            </span>
          </div>
          <div className="currency-price">
            <span
              className={`${rate.lowPriceChanged ? "currency-changed" : ""}`}
            >
              {rate.lowPrice}
            </span>
          </div>
          <div
            className={`currency-change ${
              parseFloat(rate.changeValue) >= 0
                ? "currency-up"
                : "currency-down"
            }`}
          >
            <span
              className={`${rate.changeValueChanged ? "currency-changed" : ""}`}
            >
              {rate.changeValue}
            </span>
          </div>
          <div
            className={`currency-change ${
              parseFloat(rate.changePercent) >= 0
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
        </div>
      ))}
    </>
  );
};

export default CurrencyPrice;
