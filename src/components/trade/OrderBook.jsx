import React, { useEffect, useState } from "react";
import socket from "../../socket"; // 전역 소켓 인스턴스를 가져옴
import "./OrderBook.css";

const OrderBook = ({ stockCode }) => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (stockCode) {
      setTimeout(() => {
        socket.emit("request_orderbook", { code: stockCode });
      }, 100); // 100ms 지연 추가

      // 서버로부터 데이터를 수신
      const handleOrderbookUpdate = (data) => {
        if (data && data.length > 0) {
          setOrderData(data[0]); // 데이터 배열의 첫 번째 요소를 저장
        }
      };

      socket.on("orderbook_update", handleOrderbookUpdate);

      // 컴포넌트 언마운트 시 이벤트 핸들러만 제거
      return () => {
        socket.emit("stop_orderbook_data");
        socket.off("orderbook_update", handleOrderbookUpdate);
      };
    }
  }, [stockCode]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const renderOrderRows = () => {
    const rows = [];

    // 매도 호가를 위에, 매수 호가를 아래에 위치시킴
    for (let i = 10; i >= 1; i--) {
      rows.push(
        <div key={`ask${i}`} className="orderbook-row ask">
          <div className="orderbook-quantity" style={{ textAlign: "right" }}>
            {orderData[`askp_rsqn${i}`]}
          </div>
          <div className="orderbook-price">
            {orderData[`askp${i}`]} {orderData[`antc_cntg_prdy_ctrt${i}`]}
          </div>
          <div className="orderbook-quantity"></div>
        </div>
      );
    }

    for (let i = 1; i <= 10; i++) {
      rows.push(
        <div key={`bid${i}`} className="orderbook-row bid">
          <div className="orderbook-quantity"></div>
          <div className="orderbook-price">
            {orderData[`bidp${i}`]} <br />
            <span className="antc-cntg">
              {orderData[`antc_cntg_prdy_ctrt${i}`]}
            </span>
          </div>
          <div className="orderbook-quantity" style={{ textAlign: "left" }}>
            {orderData[`bidp_rsqn${i}`]}
          </div>
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="orderbook-container">
      <div className="orderbook-body">{renderOrderRows()}</div>
      <div className="orderbook-header">
        <div className="orderbook-header-item" style={{ textAlign: "right" }}>
          {parseInt(orderData.total_askp_rsqn, 10).toLocaleString()}
        </div>
        <div className="orderbook-header-item">호가</div>
        <div className="orderbook-header-item" style={{ textAlign: "left" }}>
          {parseInt(orderData.total_bidp_rsqn, 10).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
