import React, { useState } from "react";
import "./Commodity.css";
import CommodityPrice from "./CommodityPrice";
import CommodityPerformance from "./CommodityPerformance";

const Commodity = () => {
  const [activeTab, setActiveTab] = useState("price");

  return (
    <div className="commodity-container">
      <div className="commodity-tabs">
        <button
          className={`commodity-tab ${activeTab === "price" ? "active" : ""}`}
          onClick={() => setActiveTab("price")}
        >
          가격
        </button>
        <button
          className={`commodity-tab ${
            activeTab === "performance" ? "active" : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          성과
        </button>
      </div>
      {activeTab === "price" ? <CommodityPrice /> : <CommodityPerformance />}
    </div>
  );
};

export default Commodity;
