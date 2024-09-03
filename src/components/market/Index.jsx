import React, { useState } from "react";
import "./Index.css";
import IndexPrice from "./IndexPrice";
import IndexPerformance from "./IndexPerformance";

const Index = () => {
  const [activeTab, setActiveTab] = useState("price");

  return (
    <div className="index-container">
      <div className="index-tabs">
        <button
          className={`index-tab ${activeTab === "price" ? "active" : ""}`}
          onClick={() => setActiveTab("price")}
        >
          가격
        </button>
        <button
          className={`index-tab ${activeTab === "performance" ? "active" : ""}`}
          onClick={() => setActiveTab("performance")}
        >
          성과
        </button>
      </div>
      {activeTab === "price" ? <IndexPrice /> : <IndexPerformance />}
    </div>
  );
};

export default Index;
