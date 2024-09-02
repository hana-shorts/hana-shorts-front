import React from "react";
import TradingViewWidget from "../../components/TradingViewWidget";
import Stock from "../../components/Stock";
import StockInfo from "../../components/StockInfo";
import TradePanel from "../../components/TradePanel";
import OrderBook from "../../components/OrderBook";
import MarketData from "../../components/MarketData";
import "./Trade.css";

function Trade() {
  return (
    <div className="trade-page-container">
      <div className="trade-main-container">
        <div className="trade-stock-info-wrapper">
          <StockInfo />
        </div>
        <div className="trade-chart-wrapper">
          <TradingViewWidget />
        </div>
        <div className="trade-interface-container">
          <div className="trade-order-book-wrapper">
            <OrderBook />
          </div>
          <div className="trade-panel-wrapper">
            <TradePanel />
          </div>
        </div>
        <div className="trade-market-data-wrapper">
          <MarketData />
        </div>
      </div>
      <div className="trade-stock-list-wrapper">
        <Stock />
      </div>
    </div>
  );
}

export default Trade;
