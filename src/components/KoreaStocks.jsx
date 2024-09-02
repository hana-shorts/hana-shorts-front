import React from "react";
import "./KoreaStocks.css";

const KoreaStocks = ({ columns, customLabels }) => {
  const stocks = [
    {
      name: "LG전자",
      price: "97,400",
      high: "98,500",
      low: "96,900",
      change: "0",
      changePercent: "0.00%",
      volume: "283.99K",
      date: "20/08",
    },
    {
      name: "삼성전기",
      price: "145,700",
      high: "146,300",
      low: "142,800",
      change: "+1,800",
      changePercent: "+1.25%",
      volume: "251.71K",
      date: "20/08",
    },
    {
      name: "HMM",
      price: "17,800",
      high: "18,330",
      low: "17,680",
      change: "-120",
      changePercent: "-0.67%",
      volume: "1.64M",
      date: "20/08",
    },
    {
      name: "삼성화재",
      price: "356,000",
      high: "362,000",
      low: "344,000",
      change: "+9,500",
      changePercent: "+2.74%",
      volume: "97.31K",
      date: "20/08",
    },
    {
      name: "롯데케미칼",
      price: "81,200",
      high: "82,900",
      low: "79,600",
      change: "-1,200",
      changePercent: "-1.46%",
      volume: "158.81K",
      date: "20/08",
    },
    {
      name: "하나금융지주",
      price: "64,500",
      high: "64,900",
      low: "63,200",
      change: "+1,600",
      changePercent: "+2.54%",
      volume: "919.34K",
      date: "20/08",
    },
    {
      name: "현대글로비스",
      price: "105,800",
      high: "106,700",
      low: "104,300",
      change: "+1,100",
      changePercent: "+1.05%",
      volume: "130.07K",
      date: "20/08",
    },
    {
      name: "고려아연",
      price: "532,000",
      high: "534,000",
      low: "526,000",
      change: "+6,000",
      changePercent: "+1.14%",
      volume: "28.66K",
      date: "20/08",
    },
    {
      name: "현대모비스",
      price: "219,000",
      high: "223,500",
      low: "219,000",
      change: "-1,500",
      changePercent: "-0.68%",
      volume: "74.72K",
      date: "20/08",
    },
    {
      name: "현대차",
      price: "256,000",
      high: "261,000",
      low: "255,000",
      change: "+1,000",
      changePercent: "+0.39%",
      volume: "659.11K",
      date: "20/08",
    },
    {
      name: "SK이노베이션",
      price: "102,400",
      high: "103,900",
      low: "99,500",
      change: "+2,200",
      changePercent: "+2.20%",
      volume: "230.01K",
      date: "20/08",
    },
    {
      name: "KB금융",
      price: "89,900",
      high: "90,000",
      low: "87,500",
      change: "+2,900",
      changePercent: "+3.33%",
      volume: "1.09M",
      date: "20/08",
    },
    {
      name: "아모레퍼시픽",
      price: "121,500",
      high: "123,900",
      low: "120,700",
      change: "-1,400",
      changePercent: "-1.14%",
      volume: "224.87K",
      date: "20/08",
    },
    {
      name: "LG화학",
      price: "291,500",
      high: "293,500",
      low: "283,500",
      change: "+2,000",
      changePercent: "+0.69%",
      volume: "185.72K",
      date: "20/08",
    },
    {
      name: "삼성생명",
      price: "97,700",
      high: "98,500",
      low: "92,600",
      change: "+4,100",
      changePercent: "+4.38%",
      volume: "473.08K",
      date: "20/08",
    },
    {
      name: "SK하이닉스",
      price: "199,700",
      high: "202,500",
      low: "198,100",
      change: "+5,800",
      changePercent: "+2.99%",
      volume: "4.2M",
      date: "20/08",
    },
    {
      name: "삼성전자",
      price: "78,900",
      high: "79,800",
      low: "78,700",
      change: "+600",
      changePercent: "+0.77%",
      volume: "10.16M",
      date: "20/08",
    },
    {
      name: "삼성SDI",
      price: "311,000",
      high: "313,500",
      low: "305,500",
      change: "+2,000",
      changePercent: "+0.65%",
      volume: "348.11K",
      date: "20/08",
    },
    {
      name: "신한지주",
      price: "58,400",
      high: "58,700",
      low: "57,200",
      change: "+1,200",
      changePercent: "+2.10%",
      volume: "871.82K",
      date: "20/08",
    },
    {
      name: "기아",
      price: "103,400",
      high: "104,900",
      low: "102,600",
      change: "+1,200",
      changePercent: "+1.17%",
      volume: "890.61K",
      date: "20/08",
    },
    {
      name: "SK텔레콤",
      price: "54,900",
      high: "55,400",
      low: "54,800",
      change: "-200",
      changePercent: "-0.36%",
      volume: "186.49K",
      date: "20/08",
    },
    {
      name: "S-oil",
      price: "62,300",
      high: "62,900",
      low: "62,100",
      change: "-600",
      changePercent: "-0.95%",
      volume: "363.44K",
      date: "20/08",
    },
    {
      name: "삼성물산",
      price: "145,100",
      high: "147,100",
      low: "144,400",
      change: "+900",
      changePercent: "+0.62%",
      volume: "245.39K",
      date: "20/08",
    },
    {
      name: "KT&G",
      price: "100,100",
      high: "101,600",
      low: "100,000",
      change: "-1,000",
      changePercent: "-0.99%",
      volume: "245.39K",
      date: "20/08",
    },
    {
      name: "NAVER",
      price: "156,600",
      high: "158,900",
      low: "156,500",
      change: "0",
      changePercent: "0.00%",
      volume: "538.9K",
      date: "20/08",
    },
    {
      name: "KT",
      price: "38,700",
      high: "39,050",
      low: "38,200",
      change: "+450",
      changePercent: "+1.18%",
      volume: "348.25K",
      date: "20/08",
    },
  ];

  // columns prop이 제공되지 않은 경우 기본으로 모든 컬럼을 사용
  const allColumns = [
    "name",
    "price",
    "high",
    "low",
    "change",
    "changePercent",
    "volume",
    "date",
  ];
  const activeColumns = columns || allColumns;

  // customLabels로부터 각 컬럼의 레이블을 가져옵니다. 없는 경우 기본 레이블 사용
  const labels = {
    name: "종목",
    price: customLabels?.price || "종가",
    high: "고가",
    low: "저가",
    change: "변동",
    changePercent: "변동 %",
    volume: "거래량",
    date: "날짜",
  };

  return (
    <div className="korea-stocks">
      <div className="korea-stocks-header">
        {activeColumns.includes("name") && (
          <div className="korea-stock-info">{labels.name}</div>
        )}
        {activeColumns.includes("price") && (
          <div className="korea-stock-price">{labels.price}</div>
        )}
        {activeColumns.includes("high") && (
          <div className="korea-stock-price">{labels.high}</div>
        )}
        {activeColumns.includes("low") && (
          <div className="korea-stock-price">{labels.low}</div>
        )}
        {activeColumns.includes("change") && (
          <div className="korea-stock-change">{labels.change}</div>
        )}
        {activeColumns.includes("changePercent") && (
          <div className="korea-stock-change">{labels.changePercent}</div>
        )}
        {activeColumns.includes("volume") && (
          <div className="korea-stock-volume">{labels.volume}</div>
        )}
        {activeColumns.includes("date") && (
          <div className="korea-stock-date">{labels.date}</div>
        )}
      </div>
      {stocks.map((stock, i) => (
        <div className="korea-stock-item" key={i}>
          {activeColumns.includes("name") && (
            <div className="korea-stock-info">
              {/* <img src={`/images/`} className="stock-icon" alt={""} /> */}
              <span className="korea-stock-name">{stock.name}</span>
            </div>
          )}
          {activeColumns.includes("price") && (
            <div className="korea-stock-price">{stock.price}</div>
          )}
          {activeColumns.includes("high") && (
            <div className="korea-stock-price">{stock.high}</div>
          )}
          {activeColumns.includes("low") && (
            <div className="korea-stock-price">{stock.low}</div>
          )}
          {activeColumns.includes("change") && (
            <div
              className={`korea-stock-change ${
                parseFloat(stock.change.replace(/,/g, "")) >= 0
                  ? "korea-stock-up"
                  : "korea-stock-down"
              }`}
            >
              {stock.change}
            </div>
          )}
          {activeColumns.includes("changePercent") && (
            <div
              className={`korea-stock-change ${
                parseFloat(stock.changePercent) >= 0
                  ? "korea-stock-up"
                  : "korea-stock-down"
              }`}
            >
              {stock.changePercent}
            </div>
          )}
          {activeColumns.includes("volume") && (
            <div className="korea-stock-volume">{stock.volume}</div>
          )}
          {activeColumns.includes("date") && (
            <div className="korea-stock-date">{stock.date}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KoreaStocks;
