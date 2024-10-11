import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button"; // Import Button if not already
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

  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef({}); // 각 탭에 대한 참조값을 저장할 객체

  const [openModal, setOpenModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  // 추가된 상태 변수
  const [openOrderConfirmModal, setOpenOrderConfirmModal] = useState(false);
  const [openUptickRuleModal, setOpenUptickRuleModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [cashFilledOrders, setCashFilledOrders] = useState([]);
  const [cashUnfilledOrders, setCashUnfilledOrders] = useState([]);
  const [creditFilledOrders, setCreditFilledOrders] = useState([]);

  // Function to handle modal visibility classes
  const getModalClasses = (isOpen) => {
    return `help-modal ${isOpen ? "show" : ""}`;
  };

  useEffect(() => {
    if (activeTab === "체결/예약") {
      fetchOrderHistory();
    }
  }, [activeTab]);

  const fetchOrderHistory = async () => {
    try {
      // 현금 주문 내역 가져오기
      const cashResponse = await fetch(
        "http://localhost:5002/api/order_history"
      );
      const cashData = await cashResponse.json();
      if (cashResponse.ok) {
        const cashFilled = cashData.filter(
          (order) => parseInt(order.tot_ccld_qty) === parseInt(order.ord_qty)
        );
        const cashUnfilled = cashData.filter(
          (order) => parseInt(order.tot_ccld_qty) < parseInt(order.ord_qty)
        );
        setCashFilledOrders(cashFilled);
        setCashUnfilledOrders(cashUnfilled);
      } else {
        console.error("Failed to fetch cash order history:", cashData.error);
      }

      // 신용 체결 내역 가져오기 (Spring 백엔드)
      const creditResponse = await fetch(
        "http://localhost:8080/api/transaction_history"
      );
      const creditData = await creditResponse.json();
      if (creditResponse.ok) {
        setCreditFilledOrders(creditData);
      } else {
        console.error(
          "Failed to fetch credit transaction history:",
          creditData.error
        );
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

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

  // activeTab이 바뀔 때마다 슬라이딩 인디케이터 위치 및 너비 업데이트
  useEffect(() => {
    const activeTabRef = tabsRef.current[activeTab];
    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;
      setIndicatorStyle({
        left: offsetLeft,
        width: clientWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "매수" || activeTab === "매도") {
      setTradeType("현금");
      setOrderType("지정가");
      setPrice(initialPrice);
      setQuantity(0);
      setLastCreditOption("신용");
    }
  }, [activeTab, initialPrice]);

  // Helper function to format date into two lines: date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Return original string if invalid date
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const MM = String(date.getMinutes()).padStart(2, "0");
    const SS = String(date.getSeconds()).padStart(2, "0");
    return (
      <>
        {`${yyyy}-${mm}-${dd}`}
        <br />
        {`${HH}:${MM}:${SS}`}
      </>
    );
  };

  const handleBuyOrder = () => {
    const orderDetails = {
      order_type: "buy",
      stock_code: stockCode,
      quantity: quantity,
      price: price,
      trade_type: tradeType,
    };

    setOrderDetails(orderDetails);
    setOpenOrderConfirmModal(true);
  };

  const handleSellOrder = () => {
    const orderDetails = {
      order_type: "sell",
      stock_code: stockCode,
      quantity: quantity,
      price: price,
      trade_type: tradeType,
    };

    if (tradeType === "유통대주신규") {
      // 업틱룰 모달 표시
      setOrderDetails(orderDetails);
      setOpenUptickRuleModal(true);
    } else {
      // 주문 확인 모달 바로 표시
      setOrderDetails(orderDetails);
      setOpenOrderConfirmModal(true);
    }
  };

  const placeOrder = async () => {
    try {
      let apiUrl = "http://localhost:5002/api/place_order";

      // tradeType이 '유통대주신규' 또는 '유통대주상환'인 경우 Spring 백엔드로 요청
      if (
        orderDetails.trade_type === "유통대주신규" ||
        orderDetails.trade_type === "유통대주상환"
      ) {
        apiUrl = "http://localhost:8080/api/place_sell_order_credit";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();
      if (response.ok) {
        // 주문이 성공적으로 처리되었을 때 모달 열기
        setOrderInfo([
          {
            odno: data.order_id || "주문번호",
            prdt_name: stockCode,
            ord_qty: quantity,
            ord_unpr: price,
          },
        ]);
        setOpenModal(true);

        // 폼 초기화
        setPrice(initialPrice);
        setQuantity(0);
      } else {
        // 에러 처리
        console.error("Order failed:", data.error);
        alert("주문 실패: " + data.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("주문 중 오류가 발생했습니다.");
    }
  };

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

        {/* 최대 매수 가능 섹션을 조건부로 렌더링 */}
        {tradeType !== "유통대주상환" && (
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
        )}
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
          <button className="trade-panel-button-red" onClick={handleBuyOrder}>
            매수
          </button>
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
          <button className="trade-panel-button-red" onClick={handleSellOrder}>
            매도
          </button>
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
    <div className="trade-panel-order-section-wrapper">
      <div className="trade-panel-order-section" style={{ padding: "10px" }}>
        <div className="order-history-container">
          {/* 현금 체결 내역 */}
          <h2>현금 체결 내역</h2>
          {cashFilledOrders.length > 0 ? (
            <table className="order-table">
              <thead>
                <tr>
                  <th>주문일자</th>
                  <th>종목명</th>
                  <th>매매구분</th>
                  <th>주문수량</th>
                  <th>체결수량</th>
                  <th>주문단가</th>
                  <th>체결단가</th>
                </tr>
              </thead>
              <tbody>
                {cashFilledOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="order-date">{formatDate(order.ord_dt)}</td>
                    <td>{order.prdt_name}</td>
                    <td>{order.sll_buy_dvsn_cd_name}</td>
                    <td>{order.ord_qty}</td>
                    <td>{order.tot_ccld_qty}</td>
                    <td>{formatNumber(order.ord_unpr)}</td>
                    <td>{formatNumber(order.avg_prvs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">현금 체결 내역이 없습니다.</p>
          )}

          {/* 현금 미체결 내역 */}
          <h2>현금 미체결 내역</h2>
          {cashUnfilledOrders.length > 0 ? (
            <table className="order-table">
              <thead>
                <tr>
                  <th>주문일자</th>
                  <th>종목명</th>
                  <th>매매구분</th>
                  <th>주문수량</th>
                  <th>체결수량</th>
                  <th>주문단가</th>
                  <th>미체결수량</th>
                </tr>
              </thead>
              <tbody>
                {cashUnfilledOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="order-date">{formatDate(order.ord_dt)}</td>
                    <td>{order.prdt_name}</td>
                    <td>{order.sll_buy_dvsn_cd_name}</td>
                    <td>{order.ord_qty}</td>
                    <td>{order.tot_ccld_qty}</td>
                    <td>{formatNumber(order.ord_unpr)}</td>
                    <td>{order.rmn_qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">현금 미체결 내역이 없습니다.</p>
          )}

          {/* 신용 체결 내역 */}
          <h2>신용 체결 내역</h2>
          {creditFilledOrders.length > 0 ? (
            <table className="order-table">
              <thead>
                <tr>
                  <th>주문일자</th>
                  <th>종목명</th>
                  <th>매매구분</th>
                  <th>주문수량</th>
                  <th>체결수량</th>
                  <th>주문단가</th>
                  <th>체결단가</th>
                </tr>
              </thead>
              <tbody>
                {creditFilledOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="order-date">
                      {formatDate(order.transaction_date)}
                    </td>
                    <td>{order.stock_code}</td>
                    <td>{order.trade_type}</td>
                    <td>{order.quantity}</td>
                    <td>{order.quantity}</td>
                    <td>{formatNumber(order.price)}</td>
                    <td>{formatNumber(order.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">신용 체결 내역이 없습니다.</p>
          )}

          {/* 신용 미체결 내역 */}
          <h2>신용 미체결 내역</h2>
          <p className="no-data">미체결 내역이 없습니다.</p>
        </div>
      </div>
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

  // const modalStyle = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: "400px",
  //   backgroundColor: "#fff",
  //   border: "1px solid #000",
  //   boxShadow: 24,
  //   padding: "16px",
  // };

  const getOrderConfirmModalTitle = () => {
    if (!orderDetails) return "주문 확인"; // orderDetails가 null일 때 기본 제목 반환

    let title = "";
    if (tradeType === "현금" && orderDetails.order_type === "buy") {
      title = "현금매수 주문 확인";
    } else if (tradeType === "현금" && orderDetails.order_type === "sell") {
      title = "현금매도 주문 확인";
    } else if (tradeType === "유통대주신규") {
      title = "유통대주신규 주문 확인";
    } else if (tradeType === "유통대주상환") {
      title = "유통대주상환 주문 확인";
    } else {
      title = "주문 확인";
    }
    return title;
  };

  return (
    <div className="trade-panel-container">
      <div className="trade-panel-tabs">
        <div
          ref={(el) => (tabsRef.current["매수"] = el)}
          className={`trade-panel-tab ${activeTab === "매수" ? "active" : ""}`}
          onClick={() => setActiveTab("매수")}
        >
          매수
        </div>
        <div
          ref={(el) => (tabsRef.current["매도"] = el)}
          className={`trade-panel-tab ${activeTab === "매도" ? "active" : ""}`}
          onClick={() => setActiveTab("매도")}
        >
          매도
        </div>
        <div
          ref={(el) => (tabsRef.current["정정/취소"] = el)}
          className={`trade-panel-tab ${
            activeTab === "정정/취소" ? "active" : ""
          }`}
          onClick={() => setActiveTab("정정/취소")}
        >
          정정/취소
        </div>
        <div
          ref={(el) => (tabsRef.current["체결/예약"] = el)}
          className={`trade-panel-tab ${
            activeTab === "체결/예약" ? "active" : ""
          }`}
          onClick={() => setActiveTab("체결/예약")}
        >
          체결내역
        </div>

        {/* 슬라이딩 인디케이터 */}
        <span
          className="trade-panel-tab-indicator"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        ></span>
      </div>

      {renderOrderSection()}

      {/* 업틱룰 모달 */}
      <Modal
        open={openUptickRuleModal}
        onClose={() => setOpenUptickRuleModal(false)}
        aria-labelledby="uptick-rule-modal-title"
        aria-describedby="uptick-rule-modal-description"
        disableEnforceFocus
      >
        <div
          className={getModalClasses(openUptickRuleModal)}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2 id="uptick-rule-modal-title">업틱룰 안내</h2>
          <div id="uptick-rule-modal-description">
            <p>
              업틱룰은 투자자가 공매도를 할 때 가장 최근 체결 가격보다 높은
              가격으로만 호가를 제출할 수 있도록 하는 규정입니다.
            </p>
          </div>
          <div className="button-container">
            <Button
              onClick={() => setOpenUptickRuleModal(false)}
              className="next-button"
            >
              취소
            </Button>
            <Button
              onClick={() => {
                setOpenUptickRuleModal(false);
                setOpenOrderConfirmModal(true);
              }}
              className="next-button"
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 주문 확인 모달 */}
      <Modal
        open={openOrderConfirmModal}
        onClose={() => setOpenOrderConfirmModal(false)}
        aria-labelledby="order-confirm-modal-title"
        aria-describedby="order-confirm-modal-description"
        disableEnforceFocus
      >
        <div
          className={getModalClasses(openOrderConfirmModal)}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2 id="order-confirm-modal-title">{getOrderConfirmModalTitle()}</h2>
          <div id="order-confirm-modal-description">
            <p>종목코드: {orderDetails?.stock_code}</p>
            <p>수량: {orderDetails?.quantity}</p>
            <p>가격: {orderDetails?.price}</p>
          </div>
          <div className="button-container">
            <Button
              onClick={() => setOpenOrderConfirmModal(false)}
              className="next-button"
            >
              취소
            </Button>
            <Button
              onClick={() => {
                setOpenOrderConfirmModal(false);
                placeOrder();
              }}
              className="next-button"
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 주문 완료 모달 */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="order-modal-title"
        aria-describedby="order-modal-description"
        disableEnforceFocus
      >
        <div
          className={getModalClasses(openModal)}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2 id="order-modal-title">주문이 완료되었습니다</h2>
          <div id="order-modal-description">
            {orderInfo &&
              orderInfo.map((info, index) => (
                <div key={index}>
                  <p>주문번호: {info.odno}</p>
                  <p>종목명: {info.prdt_name}</p>
                  <p>주문수량: {info.ord_qty}</p>
                  <p>주문단가: {info.ord_unpr}</p>
                </div>
              ))}
          </div>
          <div className="button-container">
            <Button onClick={() => setOpenModal(false)} className="next-button">
              닫기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TradePanel;
