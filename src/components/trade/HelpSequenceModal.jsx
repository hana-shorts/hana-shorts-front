// src/components/trade/HelpSequenceModal.jsx
import React, { useEffect, useRef } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import './HelpSequenceModal.css';

const HelpSequenceModal = ({ currentStep, onNext, onClose, selectedStockName, setCurrentStep }) => {
  const modalRef = useRef(null);

  // 각 단계별로 타겟이 되는 요소의 위치를 계산하여 모달 위치 설정
  useEffect(() => {
    const setPosition = () => {
      let targetElement = null;
      let modalPosition = {};
      let highlightClass = '';

      switch (currentStep) {
        case 1:
          targetElement = document.querySelector('.trade-stock-list-wrapper');
          modalPosition = {
            top: targetElement.offsetTop,
            left: targetElement.offsetLeft - 320, // 왼쪽에 모달 표시
          };
          highlightClass = 'highlight-component';
          break;
        case 2:
          targetElement = document.querySelector('.trade-stock-info-wrapper');
          modalPosition = {
            top: targetElement.offsetTop,
            left: targetElement.offsetLeft + targetElement.offsetWidth + 20, // 오른쪽에 모달 표시
          };
          highlightClass = 'highlight-component';
          break;
        case 3:
          targetElement = document.querySelector('.trade-order-book-wrapper');
          modalPosition = {
            top: targetElement.offsetTop,
            left: targetElement.offsetLeft + targetElement.offsetWidth + 20, // 오른쪽에 모달 표시
          };
          highlightClass = 'highlight-component';
          break;
        case 4:
          targetElement = document.querySelector('.trade-market-data-wrapper');
          modalPosition = {
            top: targetElement.offsetTop - 220, // 위쪽에 모달 표시
            left: targetElement.offsetLeft,
          };
          highlightClass = 'highlight-component';
          break;
        case 5:
          targetElement = document.querySelector('.trade-panel-wrapper');
          modalPosition = {
            top: targetElement.offsetTop - 220, // 위쪽에 모달 표시
            left: targetElement.offsetLeft,
          };
          highlightClass = 'highlight-component';
          break;
        default:
          break;
      }

      if (targetElement && modalRef.current) {
        const rect = targetElement.getBoundingClientRect();
        modalRef.current.style.position = 'absolute';
        modalRef.current.style.top = `${window.scrollY + rect.top + modalPosition.top}px`;
        modalRef.current.style.left = `${window.scrollX + rect.left + modalPosition.left}px`;
        modalRef.current.style.maxWidth = `300px`;
        modalRef.current.style.width = `300px`;
        modalRef.current.style.height = `auto`;
        modalRef.current.style.zIndex = 1000;

        // 모달이 화면에 보이도록 스크롤
        window.scrollTo({
          top: rect.top + window.scrollY - 100,
          behavior: 'smooth',
        });

        // 강조 효과 추가
        targetElement.classList.add(highlightClass);
      }

      // 다음 단계로 넘어갈 때 강조 효과 제거
      return () => {
        if (targetElement) {
          targetElement.classList.remove(highlightClass);
        }
      };
    };

    setPosition();
    window.addEventListener('resize', setPosition);
    return () => {
      window.removeEventListener('resize', setPosition);
    };
  }, [currentStep]);

  // 각 단계별 상세한 소개 내용
  const stepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2>주식 목록</h2>
            <p>
              이곳은 다양한 종목의 주식 목록을 보여주는 영역입니다. 상단의 검색창을 통해 원하는 종목을 빠르게 찾아볼 수
              있으며, KOSPI와 KOSDAQ 시장을 선택하여 조회할 수 있습니다. 종목을 클릭하면 해당 주식의 상세 정보와 거래를
              진행할 수 있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <h2>주식 정보</h2>
            <p>
              선택하신 <strong>{selectedStockName}</strong>의 상세 정보를 확인하는 영역입니다. 시세 탭에서는 현재 가격,
              등락률, 거래량 등의 정보를 확인할 수 있으며, 정보 탭에서는 기업의 재무 정보, PER, PBR 등의 지표를 볼 수
              있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <h2>호가 창</h2>
            <p>
              실시간 매수 및 매도 호가를 확인할 수 있는 영역입니다. 각 가격대별로 매수와 매도 주문이 얼마나 있는지
              파악하여 시장의 흐름을 읽을 수 있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 4:
        return (
          <>
            <h2>시장 데이터</h2>
            <p>
              체결 탭에서는 실시간 거래 체결 정보를, 일별 탭에서는 과거의 일별 시세 정보를 확인할 수 있습니다. 이를 통해
              주식의 단기 및 장기 추세를 분석할 수 있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 5:
        return (
          <>
            <h2>거래 패널</h2>
            <p>
              매수, 매도 등의 거래를 실제로 진행하는 영역입니다. 거래 유형, 주문 유형, 가격, 수량 등을 설정하여 주문을
              제출할 수 있습니다. 각 탭을 통해 정정/취소, 체결/예약 주문도 관리할 수 있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 6:
        return (
          <>
            <h2>매수 탭</h2>
            <p>
              주식을 구매하는 화면입니다. 거래 유형을 선택하고, 지정가 또는 시장가 주문을 선택하여 원하는 가격과
              수량으로 매수 주문을 제출할 수 있습니다. 주문 총액과 최대 매수 가능 수량을 확인하여 거래 계획을 세우세요.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 7:
        return (
          <>
            <h2>매도 탭</h2>
            <p>
              보유한 주식을 판매하는 화면입니다. 매도하고자 하는 수량과 가격을 설정하여 매도 주문을 제출할 수 있습니다.
              현재 보유 수량과 매도 가능 수량을 확인하여 적절한 매도 전략을 수립하세요.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 8:
        return (
          <>
            <h2>정정/취소 탭</h2>
            <p>
              제출한 주문 중 아직 체결되지 않은 주문을 정정하거나 취소할 수 있는 화면입니다. 주문 내역을 확인하고 필요에
              따라 가격이나 수량을 변경하거나 주문을 취소할 수 있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 9:
        return (
          <>
            <h2>체결/예약 탭</h2>
            <p>
              체결된 주문 내역과 예약된 주문을 확인할 수 있는 화면입니다. 거래의 진행 상황을 모니터링하고, 예약 주문을
              관리할 수 있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 10:
        // 공매도 도움말 여부를 묻는 단계
        return (
          <>
            <h2>공매도 도움말</h2>
            <p>공매도에 대한 자세한 설명을 보시겠습니까?</p>
            <div className="modal-buttons">
              <Button variant="contained" color="primary" onClick={() => setCurrentStep(11)}>
                예
              </Button>
              <Button variant="contained" color="secondary" onClick={onClose}>
                아니오
              </Button>
            </div>
          </>
        );
      case 11:
        return (
          <>
            <h2>공매도란?</h2>
            <p>
              공매도는 주식을 보유하지 않은 상태에서 주식을 빌려서 매도하는 거래 방식입니다. 주가 하락이 예상될 때
              수익을 낼 수 있는 방법으로, 이후에 주가가 하락하면 낮은 가격에 주식을 구매하여 빌린 주식을 반환하고 차익을
              실현합니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 12:
        return (
          <>
            <h2>공매도의 장단점</h2>
            <p>
              <strong>장점:</strong> 시장의 유동성을 높이고, 주가 버블을 방지하며, 하락장에서도 수익을 낼 수 있습니다.
              <br />
              <strong>단점:</strong> 주가 상승 시 손실이 무한대로 커질 수 있으며, 시장 변동성을 높일 수 있습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onNext}>
              다음
            </Button>
          </>
        );
      case 13:
        return (
          <>
            <h2>공매도 주의사항</h2>
            <p>
              공매도는 높은 위험을 수반하므로 충분한 이해와 전략이 필요합니다. 초보자의 경우 작은 규모로 시작하여 경험을
              쌓는 것이 좋습니다.
            </p>
            <Button variant="contained" color="primary" onClick={onClose}>
              도움말 종료
            </Button>
          </>
        );
      default:
        onClose();
        return null;
    }
  };

  return (
    <Modal open={true} disableBackdropClick disableEscapeKeyDown>
      <div className="help-modal" ref={modalRef}>
        {stepContent()}
      </div>
    </Modal>
  );
};

export default HelpSequenceModal;
