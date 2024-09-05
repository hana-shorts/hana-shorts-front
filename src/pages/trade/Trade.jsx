import React, { useState } from "react";
import TradingViewWidget from "../../components/trade/TradingViewWidget";
import Stock from "../../components/trade/Stock";
import StockInfo from "../../components/trade/StockInfo";
import TradePanel from "../../components/trade/TradePanel";
import OrderBook from "../../components/trade/OrderBook";
import MarketData from "../../components/trade/MarketData";
import "./Trade.css";

function Trade() {
  const [selectedStockCode, setSelectedStockCode] = useState("");

  if (!selectedStockCode) {
    setSelectedStockCode("005930");
  }

  return (
    <div className="trade-page-container">
      <div className="trade-main-container">
        <div className="trade-stock-info-wrapper">
          <StockInfo stockCode={selectedStockCode} />
        </div>
        <div className="trade-chart-wrapper">
          <TradingViewWidget stockCode={selectedStockCode} />
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
        <Stock onSelectStock={setSelectedStockCode} />
      </div>
    </div>
  );
}

export default Trade;
