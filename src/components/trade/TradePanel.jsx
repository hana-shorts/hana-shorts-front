import React, { useState } from "react";
import "./TradePanel.css";

const TradePanel = () => {
  const [activeTab, setActiveTab] = useState("매수");
  const [tradeType, setTradeType] = useState("현금");
  const [orderType, setOrderType] = useState("지정가");
  const [showTradeOptions, setShowTradeOptions] = useState(false);
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleTradeTypeClick = (type) => {
    if (type === "신용") {
      setShowTradeOptions(!showTradeOptions);
    } else {
      setTradeType(type);
      setShowTradeOptions(false);
    }
  };

  const handleOrderTypeClick = (type) => {
    if (type === "지정가") {
      setShowOrderOptions(!showOrderOptions);
    } else {
      setOrderType(type);
      setShowOrderOptions(false);
    }
  };
  const handleTradeOptionClick = (option) => {
    setTradeType(option);
    setShowTradeOptions(false);
  };

  const handleOrderOptionClick = (option) => {
    setOrderType(option);
    setShowOrderOptions(false);
  };

  const increasePrice = () => setPrice(price + 1000);
  const decreasePrice = () => setPrice(price > 1000 ? price - 1000 : 0);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 받도록 필터링
    setPrice(value ? parseInt(value, 10) : 0);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 받도록 필터링
    setQuantity(value ? parseInt(value, 10) : 0);
  };

  const renderBuySection = () => (
    <div className="trade-panel-order-section">
      <div
        style={{
          padding: "20px",
          height: "310px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="trade-panel-order-type">
          <div className="trade-panel-order-type-label">거래 유형</div>
          <div className="trade-panel-order-type-label"></div>
          <button
            className={`trade-panel-type-button ${
              tradeType === "현금" ? "active" : ""
            }`}
            onClick={() => handleTradeTypeClick("현금")}
          >
            현금
          </button>
          <div className="trade-panel-type-button-wrapper">
            <button
              className={`trade-panel-type-button ${
                tradeType === "신용" ? "active" : ""
              }`}
              onClick={() => handleTradeTypeClick("신용")}
            >
              {tradeType.includes("신용") ? tradeType : "신용"}
            </button>
            {showTradeOptions && (
              <div
                className="trade-options-dropdown"
                style={{ height: "auto" }}
              >
                <button
                  className="trade-option"
                  onClick={() => handleTradeOptionClick("자기융자신규")}
                >
                  자기융자신규
                </button>
                <button
                  className="trade-option"
                  onClick={() => handleTradeOptionClick("유통융자신규")}
                >
                  유통융자신규
                </button>
                <button
                  className="trade-option"
                  onClick={() => handleTradeOptionClick("유통대주상환")}
                >
                  유통대주상환
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="trade-panel-order-type">
          <div className="trade-panel-order-type-label">주문 유형</div>
          <div className="trade-panel-order-type-label"></div>
          <div className="trade-panel-type-button-container">
            <div className="trade-panel-type-button-wrapper">
              <button
                className={`trade-panel-type-button ${
                  orderType.includes("지정가") ? "active" : ""
                }`}
                onClick={() => handleOrderTypeClick("지정가")}
              >
                {orderType.includes("지정가") ? orderType : "지정가"}
              </button>
              {showOrderOptions && (
                <div className="order-options-dropdown">
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("조건부지정가")}
                  >
                    조건부지정가
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("최유리지정가")}
                  >
                    최유리지정가
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("최우선지정가")}
                  >
                    최우선지정가
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("시간외단일가")}
                  >
                    시간외단일가
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("지정가(IOC)")}
                  >
                    지정가(IOC)
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("시장가(IOC)")}
                  >
                    시장가(IOC)
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("최유리(IOC)")}
                  >
                    최유리(IOC)
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("지정가(FOK)")}
                  >
                    지정가(FOK)
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("시장가(FOK)")}
                  >
                    시장가(FOK)
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("최유리(FOK)")}
                  >
                    최유리(FOK)
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("장전시간외")}
                  >
                    장전시간외
                  </button>
                  <button
                    className="order-option"
                    onClick={() => handleOrderOptionClick("장후시간외")}
                  >
                    장후시간외
                  </button>
                </div>
              )}
            </div>
            <button
              className={`trade-panel-type-button ${
                orderType === "시장가" ? "active" : ""
              }`}
              onClick={() => handleOrderTypeClick("시장가")}
            >
              시장가
            </button>
          </div>
        </div>

        <div className="trade-panel-input-group">
          <label>매수 가격</label>
          <div className="trade-panel-input">
            <button
              className="trade-panel-adjust-button"
              onClick={decreasePrice}
            >
              –
            </button>
            <input
              type="text"
              className="trade-panel-input-field"
              value={price.toLocaleString("ko-KR")}
              onChange={handlePriceChange}
            />
            <button
              className="trade-panel-adjust-button"
              onClick={increasePrice}
            >
              +
            </button>
          </div>
        </div>

        <div className="trade-panel-input-group">
          <label>주문 수량</label>
          <div className="trade-panel-input">
            <button
              className="trade-panel-adjust-button"
              onClick={decreaseQuantity}
            >
              –
            </button>
            <input
              type="text"
              className="trade-panel-input-field"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button
              className="trade-panel-adjust-button"
              onClick={increaseQuantity}
            >
              +
            </button>
          </div>
        </div>

        <div
          className="trade-panel-input-group"
          style={{ marginBottom: "30px" }}
        >
          <label>주문 가능</label>
          <input
            type="text"
            className="trade-panel-input-field"
            placeholder="333주"
            style={{ width: "300px" }}
          />
        </div>
      </div>

      <div className="trade-panel-footer">
        <div className="trade-panel-input-group">
          <label>주문총액 (KRW)</label>
          <in0px
            type="text"
            placeholder="0000000원"
            className="trade-panel-input-field"
            style={{ width: "300px", textAlign: "right", fontSize: "20px" }}
          />
        </div>
        <div className="trade-panel-buttons-group">
          <button className="trade-panel-button-black">예약매수</button>
          <button className="trade-panel-button-red">현금매수</button>
        </div>
      </div>
    </div>
  );

  const renderSellSection = () => (
    <div className="trade-panel-order-section">
      <p>매도 화면 내용이 여기에 표시됩니다.</p>
    </div>
  );

  const renderModifyCancelSection = () => (
    <div className="trade-panel-order-section">
      <p>정정/취소 화면 내용이 여기에 표시됩니다.</p>
    </div>
  );

  const renderReservationSection = () => (
    <div className="trade-panel-order-section">
      <p>체결/예약 화면 내용이 여기에 표시됩니다.</p>
    </div>
  );

  const renderOrderSection = () => {
    switch (activeTab) {
      case "매수":
        return renderBuySection();
      case "매도":
        return renderSellSection();
      case "정정/취소":
        return renderModifyCancelSection();
      case "체결/예약":
        return renderReservationSection();
      default:
        return null;
    }
  };

  return (
    <div className="trade-panel-container">
      <div className="trade-panel-tabs">
        <div
          className={`trade-panel-tab ${activeTab === "매수" ? "active" : ""}`}
          onClick={() => setActiveTab("매수")}
        >
          매수
        </div>
        <div
          className={`trade-panel-tab ${activeTab === "매도" ? "active" : ""}`}
          onClick={() => setActiveTab("매도")}
        >
          매도
        </div>
        <div
          className={`trade-panel-tab ${
            activeTab === "정정/취소" ? "active" : ""
          }`}
          onClick={() => setActiveTab("정정/취소")}
        >
          정정/취소
        </div>
        <div
          className={`trade-panel-tab ${
            activeTab === "체결/예약" ? "active" : ""
          }`}
          onClick={() => setActiveTab("체결/예약")}
        >
          체결/예약
        </div>
      </div>

      {renderOrderSection()}
    </div>
  );
};

export default TradePanel;
