// src/components/Stocks.js
import React, { useState } from "react";
import styles from "./Stocks.module.css";
import StocksKospiPrice from "./StocksKospiPrice";
import StocksKospiPerformance from "./StocksKospiPerformance";
import StocksKosdaqPrice from "./StocksKosdaqPrice";
import StocksKosdaqPerformance from "./StocksKosdaqPerformance";

const Stocks = () => {
  const [activeMarket, setActiveMarket] = useState("KOSPI");
  const [activeTab, setActiveTab] = useState("price");

  const handleMarketChange = (market) => {
    setActiveMarket(market);
    setActiveTab("price");
  };

  const renderContent = () => {
    if (activeMarket === "KOSPI") {
      return activeTab === "price" ? (
        <StocksKospiPrice />
      ) : (
        <StocksKospiPerformance />
      );
    } else if (activeMarket === "KOSDAQ") {
      return activeTab === "price" ? (
        <StocksKosdaqPrice />
      ) : (
        <StocksKosdaqPerformance />
      );
    }
  };

  return (
    <div className={styles.stocksContainer}>
      <div className={styles.stocksMarketButtons}>
        <button
          className={`${styles.stocksMarketButton} ${
            activeMarket === "KOSPI" ? styles.active : ""
          }`}
          onClick={() => handleMarketChange("KOSPI")}
        >
          KOSPI
        </button>
        <button
          className={`${styles.stocksMarketButton} ${
            activeMarket === "KOSDAQ" ? styles.active : ""
          }`}
          onClick={() => handleMarketChange("KOSDAQ")}
        >
          KOSDAQ
        </button>
      </div>
      <div className={styles.stocksTabs}>
        <button
          className={`${styles.stocksTab} ${
            activeTab === "price" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("price")}
        >
          가격
        </button>
        <button
          className={`${styles.stocksTab} ${
            activeTab === "performance" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          성과
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default Stocks;
