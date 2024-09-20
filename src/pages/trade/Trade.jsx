import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams 추가
import Stock from "../../components/trade/Stock";
import StockInfo from "../../components/trade/StockInfo";
import TradePanel from "../../components/trade/TradePanel";
import OrderBook from "../../components/trade/OrderBook";
import MarketData from "../../components/trade/MarketData";
import "./Trade.css";

function Trade() {
  const { stockCode } = useParams(); // URL에서 stockCode를 가져옴
  const [selectedStockCode, setSelectedStockCode] = useState(
    stockCode || "005930"
  ); // 기본값 설정
  // const [selectedStockCode, setSelectedStockCode] = useState("005930");
  const [selectedStockName, setSelectedStockName] = useState("삼성전자"); // 추가된 상태
  const [initialPrice, setInitialPrice] = useState(0); // 초기 가격 상태 추가
  const [initialHoka, setInitialHoka] = useState(0);
  const [resetTab, setResetTab] = useState(false); // 추가된 상태: 탭을 리셋하는 트리거

  const handleStockSelection = ({ code, name }) => {
    setSelectedStockCode(code);
    setSelectedStockName(name); // 주식 이름도 상태에 저장
    setResetTab(true); // 주식 선택 시 탭을 "매수"로 리셋
  };

  useEffect(() => {
    if (resetTab) {
      setResetTab(false); // resetTab을 true로 변경한 후 다시 false로 변경
    }
  }, [resetTab]);

  const handlePriceUpdate = (price) => {
    setInitialPrice(price); // OrderBook으로부터 받은 가격 데이터 업데이트
  };

  const handleHokaUpdate = (hoka) => {
    setInitialHoka(hoka); // OrderBook으로부터 받은 가격 데이터 업데이트
  };

  return (
    <div className="trade-page-container">
      <div className="trade-main-container">
        <div className="trade-stock-info-wrapper fade-in-minus-y">
          <StockInfo
            stockCode={selectedStockCode}
            stockName={selectedStockName} // 주식 이름 전달
            onHokaUpdate={handleHokaUpdate}
          />
        </div>
        <div className="trade-interface-container fade-in-minus-x">
          <div className="trade-order-book-wrapper">
            <OrderBook
              stockCode={selectedStockCode}
              onPriceUpdate={handlePriceUpdate}
            />
          </div>
          <div className="trade-panel-wrapper">
            <TradePanel
              stockCode={selectedStockCode}
              initialPrice={initialPrice}
              initialHoka={initialHoka}
              resetTab={resetTab} // resetTab 전달
            />
          </div>
        </div>
        <div className="trade-market-data-wrapper fade-in-plus-y">
          <MarketData stockCode={selectedStockCode} />
        </div>
      </div>
      <div className="trade-stock-list-wrapper fade-in-plus-x">
        <Stock onSelectStock={handleStockSelection} />
      </div>
    </div>
  );
}

export default Trade;
