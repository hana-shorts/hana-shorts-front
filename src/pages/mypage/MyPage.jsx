import React, { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./MyPage.css"; // 페이지 전용 CSS

import profile from "../../assets/images/profile.png";
import noData from "../../assets/images/nodata.png"; // 주식 잔고 데이터 없을 시 표시할 이미지

// MUI Modal and Tabs 관련 import
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [holdings, setHoldings] = useState([]);

  const [preliminaryEducationCompleted, setPreliminaryEducationCompleted] =
    useState(false);
  const [mockTradingCompleted, setMockTradingCompleted] = useState(false);

  // 추가 상태 변수
  const [creditHoldings, setCreditHoldings] = useState([]); // 신용 보유 내역
  const [creditHoldingsData, setCreditHoldingsData] = useState([]); // 신용 보유 내역 파이 차트 데이터

  // 사전교육 및 모의거래 섹션 상태 변수
  const [isEducationModalOpen, setEducationModalOpen] = useState(false);
  const [isMockTradingModalOpen, setMockTradingModalOpen] = useState(false);

  // 사전교육 입력 상태
  const [educationCompletionNumber, setEducationCompletionNumber] =
    useState("");
  const [educationErrorMessage, setEducationErrorMessage] = useState(""); // 오류 메시지 상태

  // 모의거래 입력 상태
  const [mockTradingInstitution, setMockTradingInstitution] = useState("");
  const [mockTradingCompletionDate, setMockTradingCompletionDate] =
    useState("");
  const [mockTradingCompletionTime, setMockTradingCompletionTime] =
    useState("");
  const [mockTradingCustomerID, setMockTradingCustomerID] = useState("");
  const [mockTradingAuthenticationKey, setMockTradingAuthenticationKey] =
    useState("");
  const [mockTradingErrorMessage, setMockTradingErrorMessage] = useState(""); // 오류 메시지 상태

  // 계좌 드롭다운 상태
  const [isAccountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);

  // 보유 내역 총합
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalEvaluationAmount, setTotalEvaluationAmount] = useState(0);
  const [totalProfitOrLoss, setTotalProfitOrLoss] = useState(0);
  const [totalProfitRate, setTotalProfitRate] = useState(0);

  // 탭 상태 변수
  const [cashTab, setCashTab] = useState(0); // 0: 표 탭, 1: 차트 탭
  const [creditTab, setCreditTab] = useState(0); // 0: 표 탭, 1: 차트 탭

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 사용자 로그인 상태 확인
        const response = await axios.get("/api/user/status");
        if (response.data.success) {
          const userData = response.data.user;
          setUser(userData);

          // 완료 상태 설정
          setPreliminaryEducationCompleted(
            userData.preliminaryEducationCompleted === "YES"
          );
          setMockTradingCompleted(userData.mockTradingCompleted === "YES");

          // 잔고 및 보유 내역 정보 가져오기
          const [balanceResponse, holdingsResponse] = await Promise.all([
            axios.get("http://localhost:5002/api/balance_info"),
            axios.get("http://localhost:5002/api/holdings"),
          ]);

          setBalanceInfo(balanceResponse.data);
          setHoldings(holdingsResponse.data);

          // 신용 주문 내역 가져오기
          const creditResponse = await axios.get(
            "http://localhost:8080/api/order_history_credit"
          );
          if (creditResponse.data && creditResponse.data.length > 0) {
            // 신용 주문에서 주식 코드 추출
            const creditStockCodes = creditResponse.data.map(
              (order) => order.stock_code
            );

            // 현재 가격 데이터 가져오기
            const currentPricePromises = creditStockCodes.map((code) =>
              axios
                .get(`http://localhost:5002/api/current_price?code=${code}`)
                .then((res) => ({
                  stock_code: code,
                  current_price: res.data.closing_price || 0,
                }))
                .catch((err) => {
                  console.error(
                    `Failed to fetch current price (${code}):`,
                    err
                  );
                  return { stock_code: code, current_price: 0 };
                })
            );

            const currentPrices = await Promise.all(currentPricePromises);

            // 신용 보유 내역 정보 구성
            const creditHoldingsData = creditResponse.data.map((order) => {
              const priceData = currentPrices.find(
                (cp) => cp.stock_code === order.stock_code
              );
              const currentPrice = priceData ? priceData.current_price : 0;
              // const currentPrice = 113700;
              const purchaseAmount = order.quantity * order.price;
              const evaluationAmount = order.quantity * currentPrice;
              const profitOrLoss = evaluationAmount - purchaseAmount;
              const profitRate =
                purchaseAmount !== 0
                  ? (profitOrLoss / purchaseAmount) * 100
                  : 0;

              return {
                stock_name: order.stock_name,
                quantity: order.quantity,
                price: order.price,
                current_price: currentPrice,
                total_price: purchaseAmount,
                total_current_price: evaluationAmount,
                profit_or_loss: profitOrLoss,
                profit_rate: profitRate,
                loan_date: order.loan_date,
                maturity_date: order.maturity_date,
              };
            });

            setCreditHoldings(creditHoldingsData);

            // 신용 보유 내역 파이 차트 데이터 준비
            const creditPieData = creditHoldingsData.map((holding) => ({
              name: holding.stock_name,
              value: holding.total_current_price,
            }));
            setCreditHoldingsData(creditPieData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // 계좌 드롭다운 외부 클릭 시 닫기
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // 보유 내역 및 신용 보유 내역의 총합 계산
    if (balanceInfo && holdings.length >= 0 && creditHoldings.length >= 0) {
      // 현금 보유 내역 총합
      const totalCashPurchaseAmount = holdings.reduce(
        (sum, holding) => sum + parseFloat(holding.pchs_amt.replace(/,/g, "")),
        0
      );

      const totalCashEvaluationAmount = holdings.reduce(
        (sum, holding) => sum + parseFloat(holding.evlu_amt.replace(/,/g, "")),
        0
      );

      const totalCashProfitOrLoss = holdings.reduce(
        (sum, holding) =>
          sum + parseFloat(holding.evlu_pfls_amt.replace(/,/g, "")),
        0
      );

      // 신용 보유 내역 총합
      const totalCreditPurchaseAmount = creditHoldings.reduce(
        (sum, holding) => sum + holding.total_price,
        0
      );

      const totalCreditEvaluationAmount = creditHoldings.reduce(
        (sum, holding) => sum + holding.total_current_price,
        0
      );

      const totalCreditProfitOrLoss = creditHoldings.reduce(
        (sum, holding) => sum + holding.profit_or_loss,
        0
      );

      // 총합 계산
      const totalPurchase = totalCashPurchaseAmount + totalCreditPurchaseAmount;
      const totalEvaluation =
        totalCashEvaluationAmount + totalCreditEvaluationAmount;
      const totalProfitLoss = totalCashProfitOrLoss - totalCreditProfitOrLoss;
      const totalProfitRateCalc =
        totalPurchase !== 0 ? (totalProfitLoss / totalPurchase) * 100 : 0;

      // 상태 업데이트
      setTotalPurchaseAmount(totalPurchase);
      setTotalEvaluationAmount(totalEvaluation);
      setTotalProfitOrLoss(totalProfitLoss);
      setTotalProfitRate(totalProfitRateCalc);
    }
  }, [balanceInfo, holdings, creditHoldings]);

  if (!user) {
    return <div className="mypage-loading">로딩 중...</div>;
  }

  // 보유 내역 파이 차트 데이터 준비
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A52A2A",
    "#8A2BE2",
    "#5F9EA0",
  ];
  const holdingsData = holdings.map((holding) => ({
    name: holding.prdt_name,
    value: parseFloat(holding.evlu_amt.replace(/,/g, "")),
  }));

  // 신용 보유 내역 파이 차트 색상
  const CREDIT_COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a52a2a",
    "#8a2be2",
    "#5f9ea0",
  ];

  // 숫자를 천 단위로 포맷팅하는 함수
  const formatNumber = (num) => {
    if (isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 날짜를 'YYYY-MM-DD' 형식으로 포맷팅하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const handleEducationRegistration = async () => {
    try {
      const response = await axios.post(
        "/api/user/registerPreliminaryEducation",
        {
          completionNumber: educationCompletionNumber,
          // 필요한 다른 데이터 포함
        }
      );
      if (response.status === 200) {
        setPreliminaryEducationCompleted(true);
        setEducationErrorMessage(""); // 오류 메시지 초기화
        setEducationModalOpen(false); // 모달 닫기
      }
    } catch (error) {
      console.error("Error registering preliminary education:", error);
      setEducationErrorMessage("올바르지 않은 정보입니다.");
    }
  };

  const handleMockTradingRegistration = async () => {
    try {
      console.log("authenticationKey:", mockTradingAuthenticationKey);
      const response = await axios.post("/api/user/registerMockTrading", {
        authenticationKey: mockTradingAuthenticationKey,
        userId: mockTradingCustomerID,
        // 필요한 다른 데이터 포함
      });
      if (response.status === 200) {
        setMockTradingCompleted(true);
        setMockTradingErrorMessage(""); // 오류 메시지 초기화
        setMockTradingModalOpen(false); // 모달 닫기
      }
    } catch (error) {
      console.error("Error registering mock trading:", error);
      setMockTradingErrorMessage("올바르지 않은 정보입니다.");
    }
  };

  // MUI Box 스타일링
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #009178",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  return (
    <div className="mypage-page fade-in-minus-y">
      <div className="mypage-header">
        <h1 className="mypage-title">마이 페이지</h1>
        <div style={{ width: "180px" }}></div>
      </div>

      {/* 회원 정보 섹션 */}
      <h2 className="section-title">회원 정보</h2>
      <div className="mypage-info-section">
        <div className="mypage-info-container">
          {/* 왼쪽 이미지 */}
          <div className="mypage-profile-image-wrapper">
            <img src={profile} alt="Profile" className="mypage-profile-image" />
          </div>
          {/* 오른쪽 회원 정보 */}
          <div className="mypage-profile-details">
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>아이디:</strong> {user.userId}
                  </td>
                  <td>
                    <strong>이름:</strong> {user.name}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>이메일:</strong> {user.email}
                  </td>
                  <td>
                    <strong>전화번호:</strong> {user.phoneNumber}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>가입일:</strong>{" "}
                    {new Date(user.signupDate).toLocaleDateString()}
                  </td>
                  <td>
                    <strong>마지막 로그인:</strong>{" "}
                    {new Date(user.lastLogin).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <strong>계좌정보:</strong>{" "}
                    <span>
                      <button
                        className="mypage-account-button"
                        onClick={() =>
                          setAccountDropdownOpen(!isAccountDropdownOpen)
                        }
                      >
                        {user.userId === "hanashorts"
                          ? "39756818-010"
                          : user.userId === "hanatop"
                          ? "58651262-010"
                          : "계좌 없음"}
                      </button>
                      {isAccountDropdownOpen && (
                        <div className="mypage-dropdown-content">
                          <p>추가 계좌 정보가 없습니다.</p>
                        </div>
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 정보 등록 섹션 */}
      <h2 className="section-title">대주 사전교육 및 모의거래 등록</h2>
      <div className="mypage-info-registration-section">
        {/* 사전교육 섹션 */}
        <div className="mypage-registration-item">
          <button
            className={`mypage-registration-button ${
              preliminaryEducationCompleted ? "completed" : "active"
            }`}
            onClick={() => {
              setEducationModalOpen(true);
              setEducationErrorMessage(""); // 모달 열 때 오류 메시지 초기화
            }}
            disabled={preliminaryEducationCompleted} // 완료 시 비활성화
          >
            사전교육
          </button>
          <Modal
            open={isEducationModalOpen}
            onClose={() => setEducationModalOpen(false)}
            aria-labelledby="education-modal-title"
            aria-describedby="education-modal-description"
          >
            <Box sx={modalStyle}>
              <div className="mypage-modal-title">사전교육</div>
              <div className="mypage-modal-description">
                <label>
                  사전교육 이수번호:&nbsp;
                  <input
                    type="text"
                    value={educationCompletionNumber}
                    onChange={(e) =>
                      setEducationCompletionNumber(e.target.value)
                    }
                    className="mypage-input"
                  />
                </label>
              </div>

              {/* 사전교육 안내 문구 */}
              <div className="mypage-modal-information">
                <ul>
                  <li>
                    대주 사전교육 및 모의거래 이수정보를 등록하는 화면입니다.
                  </li>
                  <li>
                    금융투자협회 사전교육(
                    <a
                      href="https://www.kifin.or.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.kifin.or.kr
                    </a>
                    ) 및 한국거래소 (
                    <a
                      href="http://strn.krx.co.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      http://strn.krx.co.kr
                    </a>
                    ) 또는 각 증권사 모의거래 시스템을 이용한 모의거래 이수완료
                    후, 해당 이수정보를 화면에 등록하시기 바랍니다.
                  </li>
                  <li>
                    대주거래는 신용약정(대주거래위험고지 포함) 및 사전투자경험을
                    충족하셔야 대주거래가 가능합니다.
                  </li>
                  <li>
                    온라인을 통해 사전교육/모의거래를 등록한 경우, 영업점 승인이
                    완료되어야 거래 가능합니다.
                  </li>
                  <li className="mypage-red-text">
                    승인절차는 영업점 업무 마감시점에 일괄 처리되오니, 등록 후
                    바로 거래를 원하시는 고객은 계좌개설영업점 또는
                    고객센터(1588-3111)로 연락하시기 바랍니다.
                  </li>
                </ul>
              </div>

              {educationErrorMessage && (
                <div className="mypage-error-message">
                  {educationErrorMessage}
                </div>
              )}
              <button
                className="register-button"
                onClick={handleEducationRegistration}
                style={{ marginTop: "20px" }}
              >
                교육 이수 등록
              </button>
            </Box>
          </Modal>
          {preliminaryEducationCompleted ? (
            <div className="mypage-completion-message">
              사전교육 이수가 완료되었습니다.
            </div>
          ) : (
            <div className="mypage-warning-message">
              사전교육을 아직 등록하지 않았습니다.
            </div>
          )}
        </div>

        {/* 모의거래 섹션 */}
        <div className="mypage-registration-item">
          <button
            className={`mypage-registration-button ${
              mockTradingCompleted ? "completed" : "active"
            }`}
            onClick={() => {
              setMockTradingModalOpen(true);
              setMockTradingErrorMessage(""); // 모달 열 때 오류 메시지 초기화
            }}
            disabled={mockTradingCompleted} // 완료 시 비활성화
          >
            모의거래
          </button>
          <Modal
            open={isMockTradingModalOpen}
            onClose={() => setMockTradingModalOpen(false)}
            aria-labelledby="mocktrading-modal-title"
            aria-describedby="mocktrading-modal-description"
          >
            <Box sx={modalStyle}>
              <div className="mypage-modal-title">모의거래</div>
              <div className="mypage-modal-description">
                <label>
                  모의거래 이수기관:&nbsp;
                  <select
                    value={mockTradingInstitution}
                    onChange={(e) => setMockTradingInstitution(e.target.value)}
                    className="mypage-select"
                  >
                    <option value="">기관 선택</option>
                    <option value="교보증권">교보증권</option>
                    <option value="대신증권">대신증권</option>
                    <option value="미래에셋증권">미래에셋증권</option>
                    <option value="메리츠증권">메리츠증권</option>
                    <option value="삼성증권">삼성증권</option>
                    <option value="상상인증권">상상인증권</option>
                    <option value="신영증권">신영증권</option>
                    <option value="신한투자증권">신한투자증권</option>
                    <option value="유안타증권">유안타증권</option>
                    <option value="하나증권">하나증권</option>
                    <option value="한국거래소">한국거래소</option>
                    <option value="한화투자증권">한화투자증권</option>
                    <option value="KB증권">KB증권</option>
                    <option value="NH투자증권">NH투자증권</option>
                    <option value="SK증권">SK증권</option>
                    {/* 필요한 추가 옵션 */}
                  </select>
                </label>
                <label>
                  모의거래 이수 완료일:&nbsp;
                  <input
                    type="date"
                    value={mockTradingCompletionDate}
                    onChange={(e) =>
                      setMockTradingCompletionDate(e.target.value)
                    }
                    className="mypage-input"
                  />
                </label>
                <label>
                  모의거래 이수시간:&nbsp;
                  <input
                    type="number"
                    value={mockTradingCompletionTime}
                    onChange={(e) =>
                      setMockTradingCompletionTime(e.target.value)
                    }
                    className="mypage-input"
                  />
                </label>
                <label>
                  모의거래 고객ID:&nbsp;
                  <input
                    type="text"
                    value={mockTradingCustomerID}
                    onChange={(e) => setMockTradingCustomerID(e.target.value)}
                    className="mypage-input"
                  />
                </label>
                <label>
                  모의거래 인증키:&nbsp;
                  <input
                    type="text"
                    value={mockTradingAuthenticationKey}
                    onChange={(e) =>
                      setMockTradingAuthenticationKey(e.target.value)
                    }
                    className="mypage-input"
                  />
                </label>
              </div>

              {/* 사전교육 안내 문구 */}
              <div className="mypage-modal-information">
                <ul>
                  <li>
                    대주 사전교육 및 모의거래 이수정보를 등록하는 화면입니다.
                  </li>
                  <li>
                    금융투자협회 사전교육(
                    <a
                      href="https://www.kifin.or.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.kifin.or.kr
                    </a>
                    ) 및 한국거래소 (
                    <a
                      href="http://strn.krx.co.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      http://strn.krx.co.kr
                    </a>
                    ) 또는 각 증권사 모의거래 시스템을 이용한 모의거래 이수완료
                    후, 해당 이수정보를 화면에 등록하시기 바랍니다.
                  </li>
                  <li>
                    대주거래는 신용약정(대주거래위험고지 포함) 및 사전투자경험을
                    충족하셔야 대주거래가 가능합니다.
                  </li>
                  <li>
                    온라인을 통해 사전교육/모의거래를 등록한 경우, 영업점 승인이
                    완료되어야 거래 가능합니다.
                  </li>
                  <li className="mypage-red-text">
                    승인절차는 영업점 업무 마감시점에 일괄 처리되오니, 등록 후
                    바로 거래를 원하시는 고객은 계좌개설영업점 또는
                    고객센터(1588-3111)로 연락하시기 바랍니다.
                  </li>
                </ul>
              </div>

              {mockTradingErrorMessage && (
                <div className="mypage-error-message">
                  {mockTradingErrorMessage}
                </div>
              )}
              <button
                className="register-button"
                onClick={handleMockTradingRegistration}
                style={{ marginTop: "20px" }}
              >
                교육 이수 등록
              </button>
            </Box>
          </Modal>
          {mockTradingCompleted ? (
            <div className="mypage-completion-message">
              모의거래 이수가 완료되었습니다.
            </div>
          ) : (
            <div className="mypage-warning-message">
              모의거래를 아직 등록하지 않았습니다.
            </div>
          )}
        </div>
      </div>

      {/* 계좌 잔고 정보 섹션 */}
      <h2 className="section-title">잔고</h2>
      <div className="mypage-account-balance-section">
        <div className="mypage-balance-summary">
          <div className="mypage-profit-loss">
            <strong>평가손익</strong>
            <div>
              <span
                className="amount"
                style={{
                  color: totalProfitOrLoss > 0 ? "#c84a31" : "#0066ff", // 양수면 파란색, 음수면 빨간색
                }}
              >
                {formatNumber(totalProfitOrLoss)}
              </span>
              <span
                className="percentage"
                style={{
                  color: totalProfitRate > 0 ? "#c84a31" : "#0066ff", // 양수면 파란색, 음수면 빨간색
                }}
              >
                ({totalProfitRate.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="mypage-balance-details">
            <div className="mypage-detail-row">
              <span>평가금액</span>
              <strong>{formatNumber(totalEvaluationAmount)}원</strong>
            </div>
            <div className="mypage-detail-row">
              <span>매입금액</span>
              <strong>{formatNumber(totalPurchaseAmount)}원</strong>
            </div>
            <div className="mypage-detail-row">
              <span>예수금</span>
              <strong>{formatNumber(balanceInfo?.dnca_tot_amt)}원</strong>
            </div>
            <div className="mypage-detail-row">
              <span>D+2 예수금</span>
              <strong>{formatNumber(balanceInfo?.prvs_rcdl_excc_amt)}원</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 주식 잔고 섹션 */}
      <div className="mypage-holdings-section">
        {/* 왼쪽: 현금 주식 잔고 */}
        <div className="mypage-holdings-container">
          <div className="holdings-title">
            <strong>현금 주식 잔고</strong>
          </div>
          {/* 현금 주식 탭 */}
          <Tabs
            value={cashTab}
            onChange={(event, newValue) => setCashTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="TABLE" />
            <Tab label="CHART" />
          </Tabs>
          {/* 탭에 따른 콘텐츠 표시 */}
          {cashTab === 0 && holdings.length > 0 ? (
            <>
              <div className="holdings-table-wrapper">
                <table className="mypage-table">
                  <thead>
                    <tr>
                      <th>종목명</th>
                      <th>보유 수량</th>
                      <th>매입 단가</th>
                      <th>현재가</th>
                      <th>매입 금액</th>
                      <th>평가 금액</th>
                      <th>평가 손익</th>
                      <th>수익률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding, index) => (
                      <tr key={index}>
                        <td>{holding.prdt_name}</td>
                        <td>{formatNumber(holding.hldg_qty)}</td>
                        <td>
                          {formatNumber(
                            Number(parseFloat(holding.pchs_avg_pric).toFixed(0))
                          )}
                        </td>
                        <td>{formatNumber(holding.prpr)}</td>
                        <td>{formatNumber(holding.pchs_amt)}</td>
                        <td>{formatNumber(holding.evlu_amt)}</td>
                        <td>{formatNumber(holding.evlu_pfls_amt)}</td>
                        <td>
                          {(parseFloat(holding.evlu_erng_rt) * 1).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : cashTab === 1 && holdings.length > 0 ? (
            <div className="chart-wrapper">
              <PieChart width={400} height={300}>
                <Pie
                  data={holdingsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {holdingsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <div className="no-data-container">
              <div>지금은 잠시 쉬는시간</div>
              <img src={noData} alt="No Data" className="no-data-image" />
            </div>
          )}
        </div>

        {/* 오른쪽: 신용 주식 잔고 */}
        <div className="mypage-holdings-container">
          <div className="holdings-title">
            <strong>신용 주식 잔고</strong>
          </div>
          {/* 신용 주식 탭 */}
          <Tabs
            value={creditTab}
            onChange={(event, newValue) => setCreditTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="TABLE" />
            <Tab label="CHART" />
          </Tabs>
          {/* 탭에 따른 콘텐츠 표시 */}
          {creditTab === 0 && creditHoldings.length > 0 ? (
            <>
              <div className="holdings-table-wrapper">
                <table className="mypage-table">
                  <thead>
                    <tr>
                      <th>종목명</th>
                      <th>보유 수량</th>
                      <th>매입 단가</th>
                      <th>현재가</th>
                      <th>매입 금액</th>
                      <th>평가 금액</th>
                      <th>평가 손익</th>
                      <th>수익률</th>
                      <th>대출일</th>
                      <th>만기일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditHoldings.map((holding, index) => (
                      <tr key={index}>
                        <td>{holding.stock_name}</td>
                        <td>{formatNumber(holding.quantity)}</td>
                        <td>{formatNumber(holding.price)}</td>
                        <td>{formatNumber(holding.current_price)}</td>
                        <td>{formatNumber(holding.total_price)}</td>
                        <td>{formatNumber(holding.total_current_price)}</td>
                        <td>{formatNumber(holding.profit_or_loss * -1)}</td>
                        <td>{(holding.profit_rate * -1).toFixed(2)}%</td>
                        <td>{formatDate(holding.loan_date)}</td>
                        <td>{formatDate(holding.maturity_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : creditTab === 1 && creditHoldings.length > 0 ? (
            <div className="chart-wrapper">
              <PieChart width={400} height={300}>
                <Pie
                  data={creditHoldingsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {creditHoldingsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CREDIT_COLORS[index % CREDIT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <div className="no-data-container">
              <div>지금은 잠시 쉬는시간~</div>
              <img src={noData} alt="No Data" className="no-data-image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
