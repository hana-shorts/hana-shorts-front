import React, { useState } from "react";
import CurrencyPrice from "./CurrencyPrice";
import CurrencyPerformance from "./CurrencyPerformance";
import "./Currency.css";

const Currency = () => {
  const [activeTab, setActiveTab] = useState("price"); // 기본 탭은 'price'

  return (
    <div className="currency-container">
      <div className="currency-tabs">
        <button
          className={`currency-tab ${activeTab === "price" ? "active" : ""}`}
          onClick={() => setActiveTab("price")}
        >
          가격
        </button>
        <button
          className={`currency-tab ${
            activeTab === "performance" ? "active" : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          성과
        </button>
      </div>
      {activeTab === "price" ? <CurrencyPrice /> : <CurrencyPerformance />}
    </div>
  );
};

export default Currency;
