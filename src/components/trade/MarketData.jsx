import React, { useState } from "react";
import "./MarketData.css";

const MarketData = () => {
  const [activeTab, setActiveTab] = useState("체결");

  const settlementData = [
    // Settlement data entries
    {
      time: "08.22 01:53",
      price: "81,646,000",
      volumeBTC: "0.00451525",
      amountKRW: "368,652",
    },
    {
      time: "08.22 01:53",
      price: "81,646,000",
      volumeBTC: "0.00673814",
      amountKRW: "550,142",
    },
    {
      time: "08.22 01:53",
      price: "81,645,000",
      volumeBTC: "0.01230602",
      amountKRW: "1,004,725",
    },
    {
      time: "08.22 01:53",
      price: "81,646,000",
      volumeBTC: "0.04326186",
      amountKRW: "3,532,158",
    },
    {
      time: "08.22 01:53",
      price: "81,646,000",
      volumeBTC: "0.01751812",
      amountKRW: "1,430,284",
    },
    {
      time: "08.22 01:53",
      price: "81,620,000",
      volumeBTC: "0.00235349",
      amountKRW: "192,092",
    },
    {
      time: "08.22 01:53",
      price: "81,624,000",
      volumeBTC: "0.00098134",
      amountKRW: "74,979",
    },
    {
      time: "08.22 01:53",
      price: "81,647,000",
      volumeBTC: "0.0125039",
      amountKRW: "1,000,208",
    },
    {
      time: "08.22 01:52",
      price: "81,630,000",
      volumeBTC: "0.0200000",
      amountKRW: "1,632,180",
    },
    {
      time: "08.22 01:52",
      price: "81,646,000",
      volumeBTC: "0.00458994",
      amountKRW: "374,750",
    },
    {
      time: "08.22 01:52",
      price: "81,646,000",
      volumeBTC: "0.00458994",
      amountKRW: "374,750",
    },
    {
      time: "08.22 01:52",
      price: "81,646,000",
      volumeBTC: "0.00458994",
      amountKRW: "374,750",
    },
    {
      time: "08.22 01:52",
      price: "81,646,000",
      volumeBTC: "0.00458994",
      amountKRW: "374,750",
    },
  ];

  const dailyData = [
    // Daily data entries
    {
      date: "08.21",
      closingPrice: "81,678,000",
      change: "927,000",
      changePercent: "+1.15%",
      volumeBTC: "1,700",
    },
    {
      date: "08.20",
      closingPrice: "80,751,000",
      change: "929,000",
      changePercent: "-1.14%",
      volumeBTC: "3,340",
    },
    {
      date: "08.19",
      closingPrice: "81,680,000",
      change: "180,000",
      changePercent: "+0.22%",
      volumeBTC: "2,644",
    },
    {
      date: "08.18",
      closingPrice: "81,500,000",
      change: "1,349,000",
      changePercent: "-1.63%",
      volumeBTC: "1,728",
    },
    {
      date: "08.17",
      closingPrice: "82,849,000",
      change: "640,000",
      changePercent: "+0.78%",
      volumeBTC: "887",
    },
    {
      date: "08.16",
      closingPrice: "82,209,000",
      change: "1,205,000",
      changePercent: "+1.49%",
      volumeBTC: "2,630",
    },
    {
      date: "08.15",
      closingPrice: "81,004,000",
      change: "1,453,000",
      changePercent: "-1.76%",
      volumeBTC: "3,986",
    },
    {
      date: "08.14",
      closingPrice: "82,457,000",
      change: "2,143,000",
      changePercent: "-2.53%",
      volumeBTC: "3,583",
    },
    {
      date: "08.13",
      closingPrice: "84,600,000",
      change: "1,379,000",
      changePercent: "+1.66%",
      volumeBTC: "2,990",
    },
    {
      date: "08.12",
      closingPrice: "83,221,000",
      change: "406,000",
      changePercent: "+0.49%",
      volumeBTC: "5,072",
    },
    {
      date: "08.11",
      closingPrice: "82,815,000",
      change: "2,854,000",
      changePercent: "-3.33%",
      volumeBTC: "2,669",
    },
  ];

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="market-data-wrapper">
      <div className="market-data-tabs">
        <div
          className={`market-data-tab ${
            activeTab === "체결" ? "market-data-active" : ""
          }`}
          onClick={() => toggleTab("체결")}
        >
          체결
        </div>
        <div
          className={`market-data-tab ${
            activeTab === "일별" ? "market-data-active" : ""
          }`}
          onClick={() => toggleTab("일별")}
        >
          일별
        </div>
      </div>

      {activeTab === "체결" ? (
        <div className="market-data-tab-content">
          {settlementData.map((item, index) => (
            <div className="market-data-row" key={index}>
              <div className="market-data-cell">{item.time}</div>
              <div className="market-data-cell market-data-red">
                {item.price}
              </div>
              <div className="market-data-cell">{item.volumeBTC}</div>
              <div className="market-data-cell">{item.amountKRW}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="market-data-tab-content">
          {dailyData.map((item, index) => (
            <div className="market-data-row" key={index}>
              <div className="market-data-cell">{item.date}</div>
              <div className="market-data-cell market-data-red">
                {item.closingPrice}
              </div>
              <div className="market-data-cell">{item.change}</div>
              <div className="market-data-cell">{item.changePercent}</div>
              <div className="market-data-cell">{item.volumeBTC}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketData;
