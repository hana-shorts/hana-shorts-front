// src/pages/trade/Trade.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // useParams 추가
import Stock from "../../components/trade/Stock";
import StockInfo from "../../components/trade/StockInfo";
import TradePanel from "../../components/trade/TradePanel";
import OrderBook from "../../components/trade/OrderBook";
import MarketData from "../../components/trade/MarketData";
import HelpSequenceModal from "../../components/trade/HelpSequenceModal"; // 도움말 시퀀스 모달 추가
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./Trade.css";

function Trade() {
  const { stockCode } = useParams(); // URL에서 stockCode를 가져옴
  const location = useLocation(); // useLocation으로 전달된 state 확인
  const [selectedStockCode, setSelectedStockCode] = useState(
    stockCode || "005930"
  );
  const [selectedStockName, setSelectedStockName] = useState(
    location.state?.stockName || "삼성전자"
  );
  const [initialPrice, setInitialPrice] = useState(0); // 초기 가격 상태 추가
  const [initialHoka, setInitialHoka] = useState(0);
  const [resetTab, setResetTab] = useState(false); // 추가된 상태: 탭을 리셋하는 트리거

  // 모달 관련 상태
  const [openInitialModal, setOpenInitialModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showHelpSequence, setShowHelpSequence] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 세션 스토리지에서 '다시 보지 않기' 상태 확인
  useEffect(() => {
    const dontShow = sessionStorage.getItem("dontShowHelp");
    if (!dontShow) {
      setOpenInitialModal(true);
    }
  }, []);

  const handleStockSelection = ({ code, name }) => {
    setSelectedStockCode(code);
    setSelectedStockName(name); // 주식 이름도 상태에 저장
    setResetTab(true); // 주식 선택 시 탭을 "매수"로 리셋
  };

  // 주식 이름을 다시 요청할 필요 없이 location에서 가져온 stockName을 사용
  useEffect(() => {
    if (location.state?.stockName) {
      setSelectedStockName(location.state.stockName);
    }
  }, [location.state]);

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

  // 초기 모달에서 'O' 버튼 클릭 시
  const handleAgreeHelp = () => {
    setOpenInitialModal(false);
    setShowHelpSequence(true);
    setCurrentStep(1); // 첫 번째 도움말 단계로 이동
  };

  // 초기 모달에서 'X' 버튼 클릭 시
  const handleCloseModal = () => {
    setOpenInitialModal(false);
  };

  // '다시 보지 않기' 체크박스 상태 변경
  const handleDontShowAgainChange = (event) => {
    setDontShowAgain(event.target.checked);
    if (event.target.checked) {
      sessionStorage.setItem("dontShowHelp", "true");
    } else {
      sessionStorage.removeItem("dontShowHelp");
    }
  };

  // 다음 도움말 단계로 이동
  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // 도움말 종료
  const handleEndHelp = () => {
    setShowHelpSequence(false);
    setCurrentStep(0);
  };

  return (
    <div className="trade-page-container">
      {/* 초기 모달 */}
      <Modal open={openInitialModal}>
        <div className="modal-content">
          <p>본 서비스 이용에 도움을 받으시겠습니까?</p>
          <div className="modal-buttons">
            <Button
              variant="contained"
              className="next-button"
              onClick={handleAgreeHelp}
            >
              예
            </Button>
            <Button
              variant="contained"
              className="close-button"
              onClick={handleCloseModal}
            >
              아니오
            </Button>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={handleDontShowAgainChange}
                color="primary"
              />
            }
            label="다시 보지 않기"
          />
        </div>
      </Modal>

      {/* 도움말 시퀀스 모달 */}
      {showHelpSequence && currentStep > 0 && (
        <HelpSequenceModal
          currentStep={currentStep}
          onNext={handleNextStep}
          onClose={handleEndHelp}
          selectedStockName={selectedStockName}
          setCurrentStep={setCurrentStep}
        />
      )}

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
        <Stock onSelectStock={handleStockSelection} />{" "}
        {/* marketType prop 제거 */}
      </div>
    </div>
  );
}

export default Trade;
