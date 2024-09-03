import React, { useState } from "react";
import "./KoreaStocks.css";
import KoreaStocksPrice from "./KoreaStocksPrice";
import KoreaStocksPerformance from "./KoreaStocksPerformance";

const KoreaStocks = () => {
  const [activeTab, setActiveTab] = useState("price");

  return (
    <div className="korea-stocks-container">
      <div className="korea-stocks-tabs">
        <button
          className={`korea-stocks-tab ${
            activeTab === "price" ? "active" : ""
          }`}
          onClick={() => setActiveTab("price")}
        >
          가격
        </button>
        <button
          className={`korea-stocks-tab ${
            activeTab === "performance" ? "active" : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          성과
        </button>
      </div>
      {activeTab === "price" ? (
        <KoreaStocksPrice />
      ) : (
        <KoreaStocksPerformance />
      )}
    </div>
  );
};

export default KoreaStocks;
