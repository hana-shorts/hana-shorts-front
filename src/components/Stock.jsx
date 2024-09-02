import React from "react";
import "./Stock.css";

const stocks = [
  {
    name: "LG전자",
    price: "97,400",
    change: "0",
    changePercent: "0.00%",
    volume: "283.99",
  },
  {
    name: "삼성전기",
    price: "145,700",
    change: "+1,800",
    changePercent: "+1.25%",
    volume: "251.71",
  },
  {
    name: "HMM",
    price: "17,800",
    change: "-120",
    changePercent: "-0.67%",
    volume: "1,640",
  },
  {
    name: "삼성화재",
    price: "356,000",
    change: "+9,500",
    changePercent: "+2.74%",
    volume: "97.31",
  },
  {
    name: "롯데케미칼",
    price: "81,200",
    change: "-1,200",
    changePercent: "-1.46%",
    volume: "158.81",
  },
  {
    name: "하나금융지주",
    price: "64,500",
    change: "+1,600",
    changePercent: "+2.54%",
    volume: "919.34",
  },
  {
    name: "현대글로비스",
    price: "105,800",
    change: "+1,100",
    changePercent: "+1.05%",
    volume: "130.07",
  },
  {
    name: "고려아연",
    price: "532,000",
    change: "+6,000",
    changePercent: "+1.14%",
    volume: "28.66",
  },
  {
    name: "현대모비스",
    price: "219,000",
    change: "-1,500",
    changePercent: "-0.68%",
    volume: "74.72",
  },
  {
    name: "현대차",
    price: "256,000",
    change: "+1,000",
    changePercent: "+0.39%",
    volume: "659.11",
  },
  {
    name: "SK이노베이션",
    price: "102,400",
    change: "+2,200",
    changePercent: "+2.20%",
    volume: "230.01",
  },
  {
    name: "KB금융",
    price: "89,900",
    change: "+2,900",
    changePercent: "+3.33%",
    volume: "1,090",
  },
  {
    name: "아모레퍼시픽",
    price: "121,500",
    change: "-1,400",
    changePercent: "-1.14%",
    volume: "224.87",
  },
  {
    name: "LG화학",
    price: "291,500",
    change: "+2,000",
    changePercent: "+0.69%",
    volume: "185.72",
  },
  {
    name: "삼성생명",
    price: "97,700",
    change: "+4,100",
    changePercent: "+4.38%",
    volume: "473.08",
  },
  {
    name: "SK하이닉스",
    price: "199,700",
    change: "+5,800",
    changePercent: "+2.99%",
    volume: "4,200",
  },
  {
    name: "삼성전자",
    price: "78,900",
    change: "+600",
    changePercent: "+0.77%",
    volume: "10,160",
  },
  {
    name: "삼성SDI",
    price: "311,000",
    change: "+2,000",
    changePercent: "+0.65%",
    volume: "348.11",
  },
  {
    name: "신한지주",
    price: "58,400",
    change: "+1,200",
    changePercent: "+2.10%",
    volume: "871.82",
  },
  {
    name: "기아",
    price: "103,400",
    change: "+1,200",
    changePercent: "+1.17%",
    volume: "890.61",
  },
  {
    name: "SK텔레콤",
    price: "54,900",
    change: "-200",
    changePercent: "-0.36%",
    volume: "186.49",
  },
  {
    name: "S-oil",
    price: "62,300",
    change: "-600",
    changePercent: "-0.95%",
    volume: "363.44",
  },
  {
    name: "삼성물산",
    price: "145,100",
    change: "+900",
    changePercent: "+0.62%",
    volume: "245.39",
  },
  {
    name: "KT&G",
    price: "100,100",
    change: "-1,000",
    changePercent: "-0.99%",
    volume: "245.39",
  },
  {
    name: "NAVER",
    price: "156,600",
    change: "0",
    changePercent: "0.00%",
    volume: "538.9",
  },
  {
    name: "KT",
    price: "38,700",
    change: "+450",
    changePercent: "+1.18%",
    volume: "348.25",
  },
  {
    name: "KT",
    price: "38,700",
    change: "+450",
    changePercent: "+1.18%",
    volume: "348.25",
  },
  {
    name: "KT",
    price: "38,700",
    change: "+450",
    changePercent: "+1.18%",
    volume: "348.25",
  },
  {
    name: "KT",
    price: "38,700",
    change: "+450",
    changePercent: "+1.18%",
    volume: "348.25",
  },
  {
    name: "KT",
    price: "38,700",
    change: "+450",
    changePercent: "+1.18%",
    volume: "348.25",
  },
  {
    name: "KT",
    price: "38,700",
    change: "+450",
    changePercent: "+1.18%",
    volume: "348.25",
  },
  {
    name: "KT",
    price: "38,700",
    change: "+450",
    changePercent: "+1.18%",
    volume: "348.25",
  },
];

const Stock = () => {
  return (
    <div className="stock-container">
      <div className="stock-header">
        <div
          className="stock-header-item"
          style={{ width: "31%", textAlign: "left", paddingLeft: "40px" }}
        >
          종목명
        </div>
        <div className="stock-header-item">현재가</div>
        <div className="stock-header-item">전일대비</div>
        <div className="stock-header-item">거래 대금</div>
      </div>
      {stocks.map((stock, index) => (
        <div className="stock-item" key={index}>
          <div className="stock-name">{stock.name}</div>
          <div className="stock-price">{stock.price}</div>
          <div className="stock-change">
            <div className="stock-change-percent">{stock.changePercent}</div>
            <div className="stock-change-amount">{stock.change}</div>
          </div>
          <div className="stock-volume">{stock.volume}백만</div>
        </div>
      ))}
    </div>
  );
};

export default Stock;
