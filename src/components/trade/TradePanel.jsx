import React from "react";
import "./TradePanel.css";

const TradePanel = () => {
  return (
    <div className="trade-panel-container">
      <div className="trade-panel-header">
        <button className="trade-panel-tab-button active">매수</button>
        <button className="trade-panel-tab-button">매도</button>
        <button className="trade-panel-tab-button">간편주문</button>
        <button className="trade-panel-tab-button">거래내역</button>
      </div>
      <div className="trade-panel-body">
        <div className="trade-panel-order-type">
          <span>주문유형</span>
          <span>
            <input type="radio" id="limit" name="orderType" checked />
            <label htmlFor="limit">지정가</label>
            <input type="radio" id="market" name="orderType" />
            <label htmlFor="market">시장가</label>
            <input type="radio" id="reserve" name="orderType" />
            <label htmlFor="reserve">예약-지정가</label>
          </span>
        </div>
        <div className="trade-panel-order-availability">
          <span>주문가능</span>
          <span>0 BTC ≈ 0 KRW</span>
        </div>
        <div className="trade-panel-order-input">
          <label>매도가격 (KRW)</label>
          <div className="trade-panel-input-group">
            <button className="trade-panel-minus-button">-</button>
            <input type="text" value="81,252,000" />
            <button className="trade-panel-plus-button">+</button>
          </div>
        </div>
        <div className="trade-panel-order-input">
          <label>주문수량 (BTC)</label>
          <input type="text" value="0" />
          <div className="trade-panel-percentage-buttons">
            <button>10%</button>
            <button>25%</button>
            <button>50%</button>
            <button>100%</button>
          </div>
        </div>
        <div className="trade-panel-order-input">
          <label>주문총액 (KRW)</label>
          <input type="text" value="0" />
        </div>
        <div className="trade-panel-order-info">
          <span>최소주문금액: 5,000 KRW</span>
          <span>수수료(부가세 포함): 0.05%</span>
        </div>
        <div className="trade-panel-action-buttons">
          <button className="trade-panel-register-button">회원가입</button>
          <button className="trade-panel-login-button">로그인</button>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;
