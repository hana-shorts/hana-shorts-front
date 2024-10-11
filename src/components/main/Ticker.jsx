import React, { useState } from "react";
import "./Ticker.css";

const Ticker = () => {
  const [isPaused, setIsPaused] = useState(false);

  const indices = [
    {
      name: "DOW",
      value: "42,454.12",
      change: "57.88",
      percent: "0.14%",
      direction: "down",
    },
    {
      name: "NASDAQ",
      value: "18,282.05",
      change: "9.57",
      percent: "0.052%",
      direction: "down",
    },
    {
      name: "S&P500",
      value: "5,780.05",
      change: "11.99",
      percent: "0.21%",
      direction: "down",
    },
    {
      name: "니케이",
      value: "39,609.29",
      change: "228.40",
      percent: "0.58%",
      direction: "up",
    },
    {
      name: "홍콩H",
      value: "7,620.74",
      change: "255.15",
      percent: "3.46%",
      direction: "up",
    },
    {
      name: "원/달러",
      value: "1,347.61",
      change: "1.39",
      percent: "0.10%",
      direction: "down",
    },
    {
      name: "위안/달러",
      value: "7.0718",
      change: "0.0073",
      percent: "0.10%",
      direction: "down",
    },
    {
      name: "KOSPI",
      value: "2,601.30",
      change: "3.17",
      percent: "0.12%",
      direction: "up",
    },
    {
      name: "KOSDAQ",
      value: "772.15",
      change: "3.33",
      percent: "0.43%",
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
