// src/components/trade/HelpSequenceModal.jsx
import React, { useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import "./HelpSequenceModal.css";

// 이미지 임포트
import ShortSellingIntroImage from "../../assets/images/short_selling_intro.png";
import ShortSellingProsImage from "../../assets/images/short_selling_pros.png";
import ShortSellingConsImage from "../../assets/images/short_selling_cons.png";

const HelpSequenceModal = ({
  currentStep,
  onNext,
  onClose,
  selectedStockName,
  setCurrentStep,
}) => {
  const modalRef = useRef(null);
  const previousElementRef = useRef(null);
  const highlightClass = "highlight-component";
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태

  useEffect(() => {
    // 페이드 인 애니메이션 시작
    setIsVisible(true);

    const setPosition = () => {
      let targetElement = null;
      let modalPosition = {};

      if (currentStep >= 6) {
        // 스텝 6 이상: 공매도 도움말
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        if (modalRef.current) {
          modalRef.current.style.position = "fixed";
          modalRef.current.style.top = "50%";
          modalRef.current.style.left = "50%";
          modalRef.current.style.transform = "translate(-50%, -50%)";
          modalRef.current.style.zIndex = 1000;
        }
      } else {
        // 스텝 1-5: 기존 도움말 단계
        switch (currentStep) {
          case 1:
            targetElement = document.querySelector(".stock-container");
            modalPosition = {
              top: targetElement.offsetTop,
              left: targetElement.offsetLeft - 605, // 왼쪽 위치 조정
            };
            break;
          case 2:
            targetElement = document.querySelector(".stockinfo-container");
            modalPosition = {
              top: targetElement.offsetTop,
              left: targetElement.offsetLeft + targetElement.offsetWidth + 10, // 오른쪽 위치 조정
            };
            break;
          case 3:
            targetElement = document.querySelector(".orderbook-container");
            modalPosition = {
              top: targetElement.offsetTop - 440, // 위쪽 위치 조정
              left: targetElement.offsetLeft + targetElement.offsetWidth + 10, // 오른쪽 위치 조정
            };
            break;
          case 4:
            targetElement = document.querySelector(".market-data-wrapper");
            modalPosition = {
              top: targetElement.offsetTop - 1000, // 위쪽 위치 조정
              left: targetElement.offsetLeft + 1110, // 오른쪽 위치 조정
            };
            break;
          case 5:
            targetElement = document.querySelector(".trade-panel-container");
            modalPosition = {
              top: targetElement.offsetTop - 465, // 위쪽 위치 조정
              left: targetElement.offsetLeft + 5,
            };
            break;
          default:
            break;
        }

        if (targetElement && modalRef.current) {
          const rect = targetElement.getBoundingClientRect();
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const scrollX = window.scrollX || document.documentElement.scrollLeft;

          modalRef.current.style.position = "absolute";
          modalRef.current.style.top = `${
            rect.top + scrollY + modalPosition.top
          }px`;
          modalRef.current.style.left = `${
            rect.left + scrollX + modalPosition.left
          }px`;
          modalRef.current.style.transform = "none"; // 중앙 배치 해제
          modalRef.current.style.zIndex = 1000;

          window.scrollTo({
            top: rect.top + scrollY - 300, // 여유 공간 확보
            behavior: "smooth",
          });

          // 이전 강조 효과 제거
          if (previousElementRef.current) {
            previousElementRef.current.classList.remove(highlightClass);
          }

          // 현재 요소에 강조 효과 추가
          targetElement.classList.add(highlightClass);
          previousElementRef.current = targetElement;
        }
      }
    };

    // 요소 렌더링 후 위치 설정 지연
    const timeoutId = setTimeout(setPosition, 10);

    // 창 크기 조정 시 위치 재설정
    window.addEventListener("resize", setPosition);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", setPosition);
      if (previousElementRef.current) {
        previousElementRef.current.classList.remove(highlightClass);
      }
    };
  }, [currentStep, highlightClass]);

  // 단계 전환 애니메이션 처리
  const handleNext = () => {
    setIsVisible(false); // 페이드 아웃 시작
    setIsAnimating(true);
    setTimeout(() => {
      onNext(); // 애니메이션 후 다음 단계로 진행
      setIsAnimating(false);
      setIsVisible(true); // 페이드 인 시작
    }, 500); // CSS 전환 시간과 일치 (0.5초)
  };

  const handleClose = () => {
    setIsVisible(false); // 페이드 아웃 시작
    setIsAnimating(true);
    setTimeout(() => {
      onClose(); // 애니메이션 후 모달 닫기
      setIsAnimating(false);
    }, 500); // CSS 전환 시간과 일치 (0.5초)
  };

  // 단계별 콘텐츠 (이미지 추가 및 순서 조정)
  const stepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2>주식 목록</h2>
            <p>
              <strong>
                이곳은 다양한 종목의 주식 목록을 보여주는 영역입니다.
              </strong>
              <br />
              <br />
              상단의 검색창을 통해 원하는 종목을 빠르게 찾아볼 수 있으며,
              <br />
              KOSPI와 KOSDAQ 시장을 선택하여 조회할 수 있습니다.
              <br />
              종목을 클릭하면 해당 주식의 상세 정보와 거래를 진행할 수 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2>주식 정보</h2>
            <p>
              <strong>선택한 종목의 상세 정보를 확인하는 영역입니다.</strong>
              <br />
              <br />
              시세 탭에서는 현재 가격, 등락률, 거래량 등의 정보와 차트를,
              <br />
              정보 탭에서는 기업의 재무 정보, PER, PBR 등의 지표를 볼 수
              있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2>호가 창</h2>
            <p>
              <strong>
                실시간 매수 및 매도 호가를 확인할 수 있는 영역입니다.
              </strong>
              <br />
              <br />각 가격대별로 매수와 매도 주문이 얼마나 있는지 파악하여
              시장의 흐름을 읽을 수 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2>체결 데이터</h2>
            <p>
              <strong>
                실시간 체결과 일별 체결 정보를 확인할 수 있는 영역입니다.
              </strong>
              <br />
              <br />
              체결 탭에서는 체결가, 체결량 등의 실시간 거래 체결 정보를,
              <br />
              일별 탭에서는 일자별 종가, 거래량 등의 일별 시세 정보를 확인할 수
              있습니다. 이를 통해 주식의 단기 및 장기 추세를 분석할 수 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2>거래 패널</h2>
            <p>
              <strong>
                매수, 매도 등의 거래를 실제로 진행하는 영역입니다.
              </strong>
              <br />
              <br />
              매수 - 거래 유형을 선택하고, 지정가 또는 시장가 주문을 선택하여
              원하는 가격과 수량으로 매수 주문을 제출할 수 있습니다. 주문 총액과
              최대 매수 가능 수량을 확인하여 거래 계획을 세우세요.
              <br />
              <br />
              매도 - 매도하고자 하는 수량과 가격을 설정하여 매도 주문을 제출할
              수 있습니다. 현재 보유 수량과 매도 가능 수량을 확인하여 적절한
              매도 전략을 수립하세요.
              <br />
              <br />
              정정/취소 - 주문 내역을 확인하고 필요에 따라 가격이나 수량을
              변경하거나 주문을 취소할 수 있습니다.
              <br />
              <br />
              체결내역 - 체결 및 미체결 주문 내역을 확인하여 거래의 진행 상황을
              모니터링할 수 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 6:
        // 공매도 소개 여부 묻기
        return (
          <>
            <h2>공매도 도움말</h2>
            <p>공매도에 대한 자세한 설명을 보시겠습니까?</p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={() => {
                  setIsVisible(false);
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentStep(7);
                    setIsAnimating(false);
                    setIsVisible(true);
                  }, 500); // 0.5초 지연
                }}
              >
                예
              </Button>
              <Button
                variant="contained"
                className="close-button"
                onClick={handleClose}
              >
                아니오
              </Button>
            </div>
          </>
        );
      case 7:
        // 공매도 소개
        return (
          <>
            <h2>공매도란?</h2>
            <img
              src={ShortSellingIntroImage}
              alt="공매도란?"
              className="help-modal-image"
            />
            <p>
              공매도는 주식을 보유하지 않은 상태에서 주식을 빌려서 매도하는 거래
              방식입니다. 주가 하락이 예상될 때 수익을 낼 수 있는 방법으로,
              이후에 주가가 하락하면 낮은 가격에 주식을 구매하여 빌린 주식을
              반환하고 차익을 실현합니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 8:
        // 대한민국 개인 투자자의 공매도 (대주거래)
        return (
          <>
            <h2>대한민국 개인 투자자의 공매도 (대주거래)</h2>
            <p>
              대한민국에서는 개인 투자자도 <strong>대주거래</strong>를 통해
              공매도가 가능합니다.
              <br />
              <strong>대주거래</strong>는 기관 투자자와 달리 증권사와의 계약을
              통해 주식을 빌려 매도하는 방식으로, 개인 투자자도 이를 활용하여
              주가 하락에 베팅할 수 있습니다. 이를 통해 다양한 투자 전략을
              구사할 수 있으며, 시장의 유동성을 높이는 데 기여합니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 9:
        // 공매도 장점
        return (
          <>
            <h2>공매도 장점</h2>
            <img
              src={ShortSellingProsImage}
              alt="공매도의 장점"
              className="help-modal-image"
            />
            <p>
              <strong>장점:</strong>
              <br />
              - 시장의 유동성을 높입니다.
              <br />
              - 주가 버블을 방지하여 안정적인 시장 형성에 기여합니다.
              <br />
              - 하락장에서도 수익을 창출할 수 있는 기회를 제공합니다.
              <br />- 다양한 투자 전략을 구사할 수 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 10:
        // 공매도 단점 (이미지 포함)
        return (
          <>
            <h2>공매도의 단점</h2>
            <img
              src={ShortSellingConsImage}
              alt="공매도의 장단점"
              className="help-modal-image"
            />
            <p>
              <strong>단점:</strong>
              <br />
              - 주가 상승 시 손실이 무한대로 커질 수 있습니다.
              <br />
              - 시장 변동성을 높여 예측이 어려워질 수 있습니다.
              <br />- 대규모 공매도로 인해 특정 주식의 가격이 급격히 변동할
              위험이 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 11:
        // 사전 조건 (사전 교육, 모의 거래 이수)
        return (
          <>
            <h2>공매도 사전 조건</h2>
            <p>
              공매도를 이용하기 위해서는 다음과 같은 사전 조건을 충족해야
              합니다.
              <br />
              <br />
              <strong>1. 사전 교육:</strong> 공매도의 기본 개념과 리스크 관리에
              대한 교육을 이수해야 합니다.
              <br />
              <br />
              <strong>2. 모의 거래 이수:</strong> 실제 거래 전에 모의 거래를
              통해 공매도 전략을 연습하고 경험을 쌓아야 합니다.
              <br />
              <br />
              이러한 조건을 통해 투자자는 공매도의 복잡한 메커니즘을 이해하고,
              보다 안전하게 거래를 진행할 수 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 12:
        // 대주 거래 방법
        return (
          <>
            <h2>대주 거래 방법</h2>
            <p>
              대주 거래를 통해 공매도를 진행하는 방법은 다음과 같습니다.
              <br />
              <br />
              <strong>1. 대주 계약:</strong> 증권사와 대주 계약을 체결하여
              주식을 빌립니다.
              <br />
              <br />
              <strong>2. 주식 매도:</strong> 빌린 주식을 시장에 매도합니다.
              <br />
              <br />
              <strong>3. 주식 환매:</strong> 주가 하락 시 낮은 가격에 주식을
              구매하여 증권사에 반환합니다.
              <br />
              <br />
              <strong>4. 차익 실현:</strong> 매도 가격과 환매 가격의 차액을
              수익으로 얻습니다.
              <br />
              <br />이 과정을 통해 주가 하락에 베팅할 수 있으며, 시장 상황에
              따라 유연한 전략을 구사할 수 있습니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="next-button"
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        );
      case 13:
        // 주의사항 (대출일 만기일 및 기타 공매도 관련 주의사항 고지) (이미지 없음)
        return (
          <>
            <h2>공매도 주의사항</h2>
            <p>
              공매도는 높은 위험을 수반하므로 다음 사항에 유의해야 합니다.
              <br />
              <br />
              <strong>1. 대출일 및 만기일:</strong> 대출한 주식의 반환 기한을
              반드시 준수해야 합니다. 기한을 넘기면 추가 비용이 발생할 수
              있습니다.
              <br />
              <br />
              <strong>2. 시장 변동성:</strong> 주가가 예상과 다르게 상승할 경우
              손실이 무한대로 커질 수 있습니다. 리스크 관리가 필수적입니다.
              <br />
              <br />
              <strong>3. 규제 준수:</strong> 관련 법규와 증권사의 규정을 철저히
              준수해야 합니다.
              <br />
              <br />
              <strong>4. 추가 비용:</strong> 주식을 빌리는 데 따른 이자 비용이
              발생할 수 있습니다.
              <br />
              <br />
              공매도를 시작하기 전에 충분한 사전 교육과 전략 수립이 필요하며,
              항상 신중하게 접근해야 합니다.
            </p>
            <div className="button-container">
              <Button
                variant="contained"
                className="close-button"
                onClick={handleClose}
              >
                도움말 종료
              </Button>
            </div>
          </>
        );
      default:
        onClose();
        return null;
    }
  };

  return (
    <>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="help-sequence-modal-title"
        aria-describedby="help-sequence-modal-description"
        disableEnforceFocus
      >
        <div
          className={`help-modal ${isVisible ? "show" : ""} ${
            isAnimating ? "animating" : ""
          }`}
          ref={modalRef}
        >
          {stepContent()}
        </div>
      </Modal>
      {/* 필요 시 추가 이미지나 요소 삽입 가능 */}
    </>
  );
};

export default HelpSequenceModal;
