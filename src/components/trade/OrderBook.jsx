import React from "react";
import "./OrderBook.css";

const OrderBook = () => {
  const orderData = [
    { price: "81,323,000", changePercent: "+0.71%", quantity: "0.000" },
    { price: "81,270,000", changePercent: "+0.64%", quantity: "0.026" },
    { price: "81,267,000", changePercent: "+0.64%", quantity: "0.233" },
    { price: "81,266,000", changePercent: "+0.64%", quantity: "0.634" },
    { price: "81,263,000", changePercent: "+0.63%", quantity: "0.084" },
    { price: "81,262,000", changePercent: "+0.63%", quantity: "0.035" },
    { price: "81,236,000", changePercent: "+0.60%", quantity: "0.067" },
    { price: "81,235,000", changePercent: "+0.60%", quantity: "1.200" },
    { price: "81,217,000", changePercent: "+0.58%", quantity: "0.011" },
    { price: "81,215,000", changePercent: "+0.57%", quantity: "0.012" },
    { price: "81,188,000", changePercent: "+0.54%", quantity: "0.010" },
    { price: "81,174,000", changePercent: "+0.52%", quantity: "0.012" },
    { price: "81,168,000", changePercent: "+0.52%", quantity: "0.022" },
  ];

  return (
    <div className="orderbook-container">
      <div className="orderbook-header">
        <div className="orderbook-header-item">체결가</div>
        <div className="orderbook-header-item">체결량</div>
        <div className="orderbook-header-item">수량(BTC)</div>
      </div>
      <div className="orderbook-body">
        {orderData.map((order, index) => (
          <div key={index} className="orderbook-row">
            <div className="orderbook-price">{order.price}</div>
            <div
              className={`orderbook-change ${
                order.changePercent.startsWith("+")
                  ? "orderbook-up"
                  : "orderbook-down"
              }`}
            >
              {order.changePercent}
            </div>
            <div className="orderbook-quantity">{order.quantity}</div>
          </div>
        ))}
      </div>
      <div className="orderbook-footer">
        <div className="orderbook-footer-item">1.368</div>
        <div className="orderbook-footer-item">수량(BTC) &zwnj; 2.462</div>
      </div>
    </div>
  );
};

export default OrderBook;
