import React, { useState } from "react";
import "./Ticker.css";

const Ticker = () => {
  const [isPaused, setIsPaused] = useState(false);

  const indices = [
    {
      name: "DOW",
      value: "40,659.76",
      change: "96.70",
      percent: "0.24%",
      direction: "up",
    },
    {
      name: "NASDAQ",
      value: "17,631.72",
      change: "37.22",
      percent: "0.21%",
      direction: "up",
    },
    {
      name: "S&P500",
      value: "5,554.25",
      change: "11.03",
      percent: "0.20%",
      direction: "up",
    },
    {
      name: "니케이",
      value: "38,062.67",
      change: "1336.03",
      percent: "3.64%",
      direction: "up",
    },
    {
      name: "홍콩H",
      value: "6,225.86",
      change: "63.96",
      percent: "1.04%",
      direction: "up",
    },
    {
      name: "원/달러",
      value: "1,337.10",
      change: "14.2000",
      percent: "1.05%",
      direction: "down",
    },
    {
      name: "위엔/달러",
      value: "7.12",
      change: "0.0467",
      percent: "0.65%",
      direction: "down",
    },
    {
      name: "KOSPI",
      value: "2,674.36",
      change: "22.87",
      percent: "0.85%",
      direction: "down",
    },
    {
      name: "KOSDAQ",
      value: "777.47",
      change: "8.86",
      percent: "1.13%",
      direction: "down",
    },
  ];

  const doubledIndices = [...indices, ...indices];

  return (
    <div className="ticker-main-wrapper">
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="ticker-control-btn"
      >
        {isPaused ? "▶️" : "❚❚"}
      </button>
      <div className="ticker-container">
        <div className={`ticker-content ${isPaused ? "ticker-paused" : ""}`}>
          {doubledIndices.map((index, i) => (
            <div className="ticker-item" key={i}>
              <a href={`/indices/${index.name}`}>
                <span className="ticker-name">{index.name}</span>
                <span className="ticker-value">{index.value}</span>
                <span
                  className={`ticker-change ${
                    index.direction === "up" ? "ticker-up" : "ticker-down"
                  }`}
                >
                  {index.direction === "up" ? "▲" : "▼"} {index.change}
                </span>
                <span
                  className={`ticker-percent ${
                    index.direction === "up" ? "ticker-up" : "ticker-down"
                  }`}
                >
                  {index.percent}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ticker;
