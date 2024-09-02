import React, { useEffect, useState, useRef } from "react";
import "./Index.css";

// 이미지 미리 가져오기
import upArrow from "../assets/images/up_arrow.png";
import downArrow from "../assets/images/down_arrow.png";

const IndexPrice = () => {
  const [indices, setIndices] = useState([]);
  const previousIndices = useRef([]);

  // 데이터를 가져오는 함수
  const fetchIndices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/indices");
      const data = await response.json();

      // 이전 데이터와 비교하여 변화된 부분에 클래스를 추가
      const updatedData = data.map((index, i) => {
        const prevIndex = previousIndices.current[i];
        return {
          ...index,
          closingPriceChanged:
            prevIndex && index.closingPrice !== prevIndex.closingPrice,
          highPriceChanged:
            prevIndex && index.highPrice !== prevIndex.highPrice,
          lowPriceChanged: prevIndex && index.lowPrice !== prevIndex.lowPrice,
          changeValueChanged:
            prevIndex && index.changeValue !== prevIndex.changeValue,
          changePercentChanged:
            prevIndex && index.changePercent !== prevIndex.changePercent,
        };
      });

      setIndices(updatedData);
      previousIndices.current = data; // 이전 데이터를 현재 데이터로 업데이트
    } catch (error) {
      console.error("Error fetching index data:", error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchIndices();
    const interval = setInterval(() => {
      fetchIndices();
    }, 30000); // 30초마다 데이터를 불러옴

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <div className="index-container">
      <div className="index-header">
        <div className="index-info">종목</div>
        <div className="index-price">종가</div>
        <div className="index-price">고가</div>
        <div className="index-price">저가</div>
        <div className="index-change">변동</div>
        <div className="index-change">변동(%)</div>
        <div className="index-time">시간</div>
      </div>
      {indices.map((index, i) => (
        <div className="index-item" key={i}>
          <div className="index-info">
            <img
              src={parseFloat(index.changeValue) >= 0 ? upArrow : downArrow}
              alt={parseFloat(index.changeValue) >= 0 ? "Up" : "Down"}
              className="arrow-icon"
            />
            <span className="index-name">{index.indexName}</span>
          </div>
          <div className="index-price">
            <span
              className={`${index.closingPriceChanged ? "index-changed" : ""}`}
            >
              {index.closingPrice}
            </span>
          </div>
          <div className="index-price">
            <span
              className={`${index.highPriceChanged ? "index-changed" : ""}`}
            >
              {index.highPrice}
            </span>
          </div>
          <div className="index-price">
            <span className={`${index.lowPriceChanged ? "index-changed" : ""}`}>
              {index.lowPrice}
            </span>
          </div>
          <div
            className={`index-change ${
              parseFloat(index.changeValue) >= 0 ? "index-up" : "index-down"
            }`}
          >
            <span
              className={`${index.changeValueChanged ? "index-changed" : ""}`}
            >
              {index.changeValue}
            </span>
          </div>
          <div
            className={`index-change ${
              parseFloat(index.changePercent) >= 0 ? "index-up" : "index-down"
            }`}
          >
            <span
              className={`${index.changePercentChanged ? "index-changed" : ""}`}
            >
              {index.changePercent}
            </span>
          </div>
          <div className="index-time">{index.rateTime}</div>
        </div>
      ))}
    </div>
  );
};

export default IndexPrice;
