import React, { useState, useEffect } from "react";
import "./TradePanel.css";

const TradePanel = ({ stockCode, initialPrice, initialHoka, resetTab }) => {
  const [activeTab, setActiveTab] = useState("매수");
  const [tradeType, setTradeType] = useState("현금");
  const [orderType, setOrderType] = useState("지정가");
  const [showTradeOptions, setShowTradeOptions] = useState(false);
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [price, setPrice] = useState(initialPrice);
  const [quantity, setQuantity] = useState(0);
  const [lastCreditOption, setLastCreditOption] = useState("신용");
  const [balance, setBalance] = useState(0); // 잔고를 저장할 상태
  const [availableQuantity, setAvailableQuantity] = useState(0); // 주문 가능 수량
  const [totalAmount, setTotalAmount] = useState(0); // 주문 총액 상태

  useEffect(() => {
    // 컴포넌트가 마운트될 때 잔고 조회 API 호출
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `http://localhost:5002/api/balance?code=${stockCode}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setBalance(data[0].nrcvb_buy_amt); // 잔고 상태 업데이트
        }
      } catch (error) {
        console.error("잔고 조회 중 오류 발생:", error);
      }
    };

    fetchBalance();
  }, [stockCode]);

  // 현재가에 따라 주문 가능 수량을 업데이트
  useEffect(() => {
    if (price > 0) {
      const calculatedQuantity = Math.floor(balance / price); // 잔고를 현재가로 나눈 후 정수로 만듦
      setAvailableQuantity(calculatedQuantity); // 주문 가능 수량 상태 업데이트
    } else {
      setAvailableQuantity(0); // 현재가가 0 이하일 경우 주문 가능 수량을 0으로 설정
    }
  }, [balance, price]);

  // 주문 총액을 업데이트
  useEffect(() => {
    setTotalAmount(price * quantity); // 매수가격과 수량의 곱
  }, [price, quantity]);

  // Reset the tab to "매수" when resetTab changes
  useEffect(() => {
    if (resetTab) {
      setActiveTab("매수");
    }
  }, [resetTab]);

  useEffect(() => {
    if (activeTab === "매수" || activeTab === "매도") {
      setTradeType("현금");
      setOrderType("지정가");
      setPrice(initialPrice);
      setQuantity(0);
      setLastCreditOption("신용");
    }
  }, [activeTab, initialPrice]);

  const handleTradeTypeClick = (type) => {
    if (type === "신용") {
      setShowTradeOptions(!showTradeOptions);
      setTradeType(lastCreditOption); // 마지막 선택된 신용 옵션으로 이름 설정
    } else {
      setTradeType(type);
      setShowTradeOptions(false);
    }
  };

  const handleTradeOptionClick = (option) => {
    setTradeType(option);
    setLastCreditOption(option); // 마지막 선택된 옵션 기억
    setShowTradeOptions(false);
  };

  const handleOrderTypeClick = (type) => {
    if (type === "지정가") {
      setShowOrderOptions(!showOrderOptions);
    } else {
      setOrderType(type);
      setShowOrderOptions(false);
    }
  };

  const handleOrderOptionClick = (option) => {
    setOrderType(option);
    setShowOrderOptions(false);
  };

  // 숫자에 천단위 구분 기호 추가하는 함수
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 가격 증가 함수
  const increasePrice = () => {
    setPrice((prevPrice) => {
      // prevPrice와 initialHoka를 모두 숫자로 변환한 후 더해줍니다.
      const numericPrice = parseInt(prevPrice.toString().replace(/,/g, ""), 10);
      const numericHoka = parseInt(
        initialHoka.toString().replace(/,/g, ""),
        10
      );
      const updatedPrice = numericPrice + numericHoka;

      return updatedPrice; // 여기서 숫자를 그대로 반환합니다.
    });
  };

  // 가격 감소 함수
  const decreasePrice = () => {
    setPrice((prevPrice) => {
      const numericPrice = parseInt(prevPrice.toString().replace(/,/g, ""), 10);
      const numericHoka = parseInt(
        initialHoka.toString().replace(/,/g, ""),
        10
      );
      const updatedPrice =
        numericPrice > numericHoka ? numericPrice - numericHoka : 0;

      return updatedPrice; // 여기서 숫자를 그대로 반환합니다.
    });
  };

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
                tradeType !== "현금" ? "active" : ""
              }`}
              onClick={() => handleTradeTypeClick("신용")}
            >
              {tradeType === "현금" ? "신용" : tradeType}
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
                    onClick={() => handleOrderOptionClick("지정가")}
                  >
                    지정가
                  </button>
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
              disabled={orderType === "시장가"}
            >
              –
            </button>
            <input
              type="text"
              className="trade-panel-input-field"
              value={orderType === "시장가" ? "" : formatNumber(price)} // 시장가일 경우 빈 칸으로 설정
              onChange={handlePriceChange}
              disabled={orderType === "시장가"} // 시장가일 경우 비활성화
            />
            <button
              className="trade-panel-adjust-button"
              onClick={increasePrice}
              disabled={orderType === "시장가"}
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
          <label>최대 매수 가능</label>
          <input
            type="text"
            className="trade-panel-input-field"
            value={`${availableQuantity}주`} // 주문 가능 수량을 표시
            readOnly
            style={{ width: "100px", textAlign: "right" }}
          />
          <span
            className="trade-panel-balance"
            style={{
              color: "#888",
              alignContent: "center",
              marginLeft: "20px",
            }}
          >
            ({formatNumber(balance)}원)
          </span>
        </div>
      </div>

      <div className="trade-panel-footer">
        <div className="trade-panel-input-group">
          <label>주문 총액</label>
          <input
            type="text"
            value={formatNumber(totalAmount)} // 주문 총액을 표시
            className="trade-panel-input-field"
            style={{ width: "300px", textAlign: "right", fontSize: "20px" }}
          />
        </div>
        <div className="trade-panel-buttons-group">
          <button className="trade-panel-button-black">초기화</button>
          <button className="trade-panel-button-red">매수</button>
        </div>
      </div>
    </div>
  );

  const renderSellSection = () => (
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
                tradeType !== "현금" ? "active" : ""
              }`}
              onClick={() => handleTradeTypeClick("신용")}
            >
              {tradeType === "현금" ? "신용" : tradeType}
            </button>
            {showTradeOptions && (
              <div
                className="trade-options-dropdown"
                style={{ height: "auto" }}
              >
                <button
                  className="trade-option"
                  onClick={() => handleTradeOptionClick("자기융자상환")}
                >
                  자기융자상환
                </button>
                <button
                  className="trade-option"
                  onClick={() => handleTradeOptionClick("유통융자상환")}
                >
                  유통융자상환
                </button>
                <button
                  className="trade-option"
                  onClick={() => handleTradeOptionClick("유통대주신규")}
                >
                  유통대주신규
                </button>
                <button
                  className="trade-option"
                  onClick={() => handleTradeOptionClick("담보대출상환")}
                >
                  담보대출상환
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
                    onClick={() => handleOrderOptionClick("지정가")}
                  >
                    지정가
                  </button>
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
          <label>매도 가격</label>
          <div className="trade-panel-input">
            <button
              className="trade-panel-adjust-button"
              onClick={decreasePrice}
              disabled={orderType === "시장가"}
            >
              –
            </button>
            <input
              type="text"
              className="trade-panel-input-field"
              value={orderType === "시장가" ? "" : formatNumber(price)} // 시장가일 경우 빈 칸으로 설정
              onChange={handlePriceChange}
            />
            <button
              className="trade-panel-adjust-button"
              onClick={increasePrice}
              disabled={orderType === "시장가"}
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
          <label></label>
          <input
            type="text"
            className="trade-panel-input-field"
            value="" // 주문 가능 수량을 표시
            readOnly
            style={{ width: "100px", textAlign: "right" }}
          />
          <span
            className="trade-panel-balance"
            style={{
              color: "#888",
              alignContent: "center",
              marginLeft: "20px",
            }}
          ></span>
        </div>
      </div>

      <div className="trade-panel-footer">
        <div className="trade-panel-input-group">
          <label>주문 총액</label>
          <input
            type="text"
            value={formatNumber(totalAmount)} // 주문 총액을 표시
            className="trade-panel-input-field"
            style={{ width: "300px", textAlign: "right", fontSize: "20px" }}
          />
        </div>
        <div className="trade-panel-buttons-group">
          <button className="trade-panel-button-black">초기화</button>
          <button className="trade-panel-button-red">매도</button>
        </div>
      </div>
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
