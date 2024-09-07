import React, { useEffect, useState, useRef } from "react";
import socket from "../../socket"; // 전역 소켓 인스턴스를 가져옴
import "./OrderBook.css";

const OrderBook = ({ stockCode }) => {
  const [orderData, setOrderData] = useState([]); // 소켓 데이터용 상태
  const [orderDataHttp, setOrderDataHttp] = useState([]); // HTTP로 가져온 시가 데이터용 상태
  const orderbookBodyRef = useRef(null);

  useEffect(() => {
    if (stockCode) {
      // HTTP로 시가 데이터 가져오기
      const fetchInitialPrice = async () => {
        try {
          const response = await fetch(
            `http://localhost:5002/api/ask-order?code=${stockCode}`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            setOrderDataHttp(data[0]);
          }
        } catch (error) {
          console.error("Failed to fetch initial price:", error);
        }
      };

      fetchInitialPrice();

      // 소켓 통신으로 실시간 데이터 가져오기
      setTimeout(() => {
        socket.emit("request_orderbook", { code: stockCode });
      }, 100);

      const handleOrderbookUpdate = (data) => {
        if (data && data.length > 0) {
          setOrderData(data[0]);
        }
      };

      socket.on("orderbook_update", handleOrderbookUpdate);

      return () => {
        socket.emit("stop_orderbook_data");
        socket.off("orderbook_update", handleOrderbookUpdate);
      };
    }
  }, [stockCode]);

  useEffect(() => {
    if (orderbookBodyRef.current) {
      const orderbookBody = orderbookBodyRef.current;
      orderbookBody.scrollTop =
        (orderbookBody.scrollHeight - orderbookBody.clientHeight) / 2;
    }
  }, [orderData]);

  if (!orderData || !orderDataHttp.stck_sdpr) {
    return <div>Loading...</div>;
  }

  const renderOrderRows = () => {
    const rows = [];

    const getColorClass = (price) => {
      if (price > orderDataHttp.stck_sdpr) {
        return "orderbook-price-high";
      } else if (price < orderDataHttp.stck_sdpr) {
        return "orderbook-price-low";
      } else {
        return "orderbook-price-neutral";
      }
    };

    const getChangeColorClass = (change) => {
      if (change > 0) {
        return "orderbook-quantity-change-high";
      } else if (change < 0) {
        return "orderbook-quantity-change-low";
      } else {
        return "";
      }
    };

    for (let i = 10; i >= 1; i--) {
      const askPrice = orderData[`askp${i}`];
      const askPercentage = (
        ((askPrice - orderDataHttp.stck_sdpr) / orderDataHttp.stck_sdpr) *
        100
      ).toFixed(2);

      const askChange = orderData[`askp_rsqn_icdc${i}`];

      rows.push(
        <div key={`ask${i}`} className="orderbook-row ask">
          <div
            className={`orderbook-quantity-change ${getChangeColorClass(
              askChange
            )}`}
            style={{
              borderBottom: "1px solid #ddd",
            }}
          >
            <span
              style={{
                visibility: askChange === "0" ? "hidden" : "visible",
              }}
            >
              {Math.abs(askChange).toLocaleString()}
            </span>
          </div>
          <div
            className="orderbook-quantity"
            style={{
              justifyContent: "right",
              paddingRight: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {parseInt(orderData[`askp_rsqn${i}`], 10).toLocaleString()}
          </div>
          <div
            className={`orderbook-price ${getColorClass(askPrice)}`}
            style={{ backgroundColor: "#ecf3fa" }}
          >
            {parseInt(askPrice, 10).toLocaleString()}
            <span className={`orderbook-percentage ${getColorClass(askPrice)}`}>
              ({askPercentage}%)
            </span>
          </div>
          <div
            className="orderbook-quantity"
            style={{ backgroundColor: "#FFFFFF", paddingLeft: "10px" }}
          ></div>
          <div
            className="orderbook-quantity-change"
            style={{ backgroundColor: "#FFFFFF" }}
          />
        </div>
      );
    }

    for (let i = 1; i <= 10; i++) {
      const bidPrice = orderData[`bidp${i}`];
      const bidPercentage = (
        ((bidPrice - orderDataHttp.stck_sdpr) / orderDataHttp.stck_sdpr) *
        100
      ).toFixed(2);

      const bidChange = orderData[`bidp_rsqn_icdc${i}`];

      rows.push(
        <div key={`bid${i}`} className="orderbook-row bid">
          <div
            className="orderbook-quantity-change"
            style={{
              backgroundColor: "#FFFFFF",
            }}
          />
          <div
            className="orderbook-quantity"
            style={{ backgroundColor: "#FFFFFF", paddingRight: "10px" }}
          ></div>
          <div
            className={`orderbook-price ${getColorClass(bidPrice)}`}
            style={{ backgroundColor: "#fbf1ef" }}
          >
            {parseInt(bidPrice, 10).toLocaleString()}
            <span className={`orderbook-percentage ${getColorClass(bidPrice)}`}>
              ({bidPercentage}%)
            </span>
          </div>
          <div
            className="orderbook-quantity"
            style={{
              justifyContent: "left",
              paddingLeft: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {parseInt(orderData[`bidp_rsqn${i}`], 10).toLocaleString()}
          </div>
          <div
            className={`orderbook-quantity-change ${getChangeColorClass(
              bidChange
            )}`}
            style={{
              borderBottom: "1px solid #ddd",
            }}
          >
            <span
              style={{
                visibility: bidChange === "0" ? "hidden" : "visible",
              }}
            >
              {Math.abs(bidChange).toLocaleString()}
            </span>
          </div>
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="orderbook-container">
      <div className="orderbook-body" ref={orderbookBodyRef}>
        {renderOrderRows()}
      </div>
      <div className="orderbook-header">
        <div
          className="orderbook-header-item"
          style={{
            textAlign: "right",
            marginRight: "30px",
          }}
        >
          {parseInt(orderData.total_askp_rsqn, 10).toLocaleString()}
        </div>
        <div className="orderbook-header-item">호가</div>
        <div
          className="orderbook-header-item"
          style={{
            textAlign: "left",
            marginLeft: "30px",
          }}
        >
          {parseInt(orderData.total_bidp_rsqn, 10).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
