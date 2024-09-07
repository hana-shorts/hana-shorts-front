import React, { useState } from "react";
import Stock from "../../components/trade/Stock";
import StockInfo from "../../components/trade/StockInfo";
import TradePanel from "../../components/trade/TradePanel";
import OrderBook from "../../components/trade/OrderBook";
import MarketData from "../../components/trade/MarketData";
import "./Trade.css";

function Trade() {
  const [selectedStockCode, setSelectedStockCode] = useState("005930");
  const [selectedStockName, setSelectedStockName] = useState("삼성전자"); // 추가된 상태

  const handleStockSelection = ({ code, name }) => {
    setSelectedStockCode(code);
    setSelectedStockName(name); // 주식 이름도 상태에 저장
  };

  return (
    <div className="trade-page-container">
      <div className="trade-main-container">
        <div className="trade-stock-info-wrapper">
          <StockInfo
            stockCode={selectedStockCode}
            stockName={selectedStockName} // 주식 이름 전달
          />
        </div>
        <div className="trade-interface-container">
          <div className="trade-order-book-wrapper">
            <OrderBook stockCode={selectedStockCode} />
          </div>
          <div className="trade-panel-wrapper">
            <TradePanel stockCode={selectedStockCode} />
          </div>
        </div>
        <div className="trade-market-data-wrapper">
          <MarketData stockCode={selectedStockCode} />
        </div>
      </div>
      <div className="trade-stock-list-wrapper">
        <Stock onSelectStock={handleStockSelection} />
      </div>
    </div>
  );
}

export default Trade;
