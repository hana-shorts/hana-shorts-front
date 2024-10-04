import React, { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./MyPage.css"; // 페이지 전용 CSS

import profile from "../../assets/images/profile.png";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [holdings, setHoldings] = useState([]);

  // Additional state variables
  const [creditOrders, setCreditOrders] = useState([]); // Credit order history
  const [creditHoldings, setCreditHoldings] = useState([]); // Credit holdings
  const [creditHoldingsData, setCreditHoldingsData] = useState([]); // Data for credit holdings pie chart

  // State variables for preliminary education and mock trading sections
  const [isEducationDropdownOpen, setEducationDropdownOpen] = useState(false);
  const [isMockTradingDropdownOpen, setMockTradingDropdownOpen] =
    useState(false);

  // Preliminary education input state
  const [educationCompletionNumber, setEducationCompletionNumber] =
    useState("");

  // Mock trading input state
  const [mockTradingRegistrationStatus, setMockTradingRegistrationStatus] =
    useState("미등록"); // Default '미등록'
  const [mockTradingInstitution, setMockTradingInstitution] = useState("");
  const [mockTradingCompletionDate, setMockTradingCompletionDate] =
    useState("");
  const [mockTradingCompletionTime, setMockTradingCompletionTime] =
    useState("");
  const [mockTradingCustomerID, setMockTradingCustomerID] = useState("");
  const [mockTradingAuthenticationKey, setMockTradingAuthenticationKey] =
    useState("");

  const educationDropdownRef = useRef(null);
  const mockTradingDropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check user login status
        const response = await axios.get("/api/user/status");
        if (response.data.success) {
          setUser(response.data.user);

          // Fetch account information
          const accountResponse = await axios.get(
            `/api/account/${response.data.user.userId}`
          );
          if (accountResponse.data) {
            setAccount(accountResponse.data);
          }

          // Fetch balance and holdings information
          const [balanceResponse, holdingsResponse] = await Promise.all([
            axios.get("http://localhost:5002/api/balance_info"),
            axios.get("http://localhost:5002/api/holdings"),
          ]);

          setBalanceInfo(balanceResponse.data);
          setHoldings(holdingsResponse.data);

          // Fetch credit order history
          const creditResponse = await axios.get(
            "http://localhost:8080/api/order_history_credit"
          );
          if (creditResponse.data && creditResponse.data.length > 0) {
            setCreditOrders(creditResponse.data);

            // Extract stock codes from credit orders
            const creditStockCodes = creditResponse.data.map(
              (order) => order.stock_code
            );

            // Fetch current price data
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

            // Construct credit holdings information
            const creditHoldingsData = creditResponse.data.map((order) => {
              const priceData = currentPrices.find(
                (cp) => cp.stock_code === order.stock_code
              );
              return {
                stock_name: order.stock_name,
                quantity: order.quantity,
                price: order.price,
                current_price: priceData ? priceData.current_price : 0,
                total_price: order.quantity * order.price,
                total_current_price:
                  order.quantity * (priceData ? priceData.current_price : 0),
                loan_date: order.loan_date,
                maturity_date: order.maturity_date,
              };
            });

            setCreditHoldings(creditHoldingsData);

            // Prepare data for credit holdings pie chart
            const creditPieData = creditHoldingsData.map((holding) => ({
              name: holding.stock_name,
              value: holding.total_current_price,
            }));
            setCreditHoldingsData(creditPieData);
          }

          // Fetch mock trading registration status
          const fetchMockTradingStatus = async () => {
            try {
              const response = await axios.get(
                `/api/mock_trading/status/${response.data.user.userId}`
              );
              if (response.data && response.data.isRegistered) {
                setMockTradingRegistrationStatus("등록");
                // Set other mock trading data if needed
              } else {
                setMockTradingRegistrationStatus("미등록");
              }
            } catch (err) {
              console.error(
                "Failed to fetch mock trading registration status:",
                err
              );
            }
          };
          fetchMockTradingStatus();
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (
        educationDropdownRef.current &&
        !educationDropdownRef.current.contains(event.target)
      ) {
        setEducationDropdownOpen(false);
      }
      if (
        mockTradingDropdownRef.current &&
        !mockTradingDropdownRef.current.contains(event.target)
      ) {
        setMockTradingDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  // Prepare data for cash and stock ratio pie chart
  let cashAndStockData = [];
  if (balanceInfo) {
    const cashAmount = parseFloat(balanceInfo.dnca_tot_amt.replace(/,/g, ""));
    const stockAmount = parseFloat(balanceInfo.scts_evlu_amt.replace(/,/g, ""));
    cashAndStockData = [
      { name: "현금", value: cashAmount },
      { name: "주식", value: stockAmount },
    ];
  }

  // Prepare data for holdings pie chart
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

  // Colors for credit holdings pie chart
  const CREDIT_COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a52a2a",
    "#8a2be2",
    "#5f9ea0",
  ];

  // Function to format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to format dates to 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handlers for registration buttons
  const handleEducationRegistration = () => {
    // Code to handle preliminary education registration (e.g., send data to server)
    console.log("Education Completion Number:", educationCompletionNumber);
    // Implement API call to register education completion
  };

  const handleMockTradingRegistration = () => {
    // Code to handle mock trading registration (e.g., send data to server)
    console.log("Mock Trading Data:", {
      mockTradingInstitution,
      mockTradingCompletionDate,
      mockTradingCompletionTime,
      mockTradingCustomerID,
      mockTradingAuthenticationKey,
    });
    // Implement API call to register mock trading completion
  };

  return (
    <div className="mypage-page fade-in-minus-y">
      <div className="mypage-header">
        <h1 className="mypage-title">마이 페이지</h1>
        <div style={{ width: "180px" }}></div>
      </div>

      {/* 회원 정보 섹션 */}
      <h2 style={{ margin: "50px 0px 0px 120px" }}>회원 정보</h2>
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
                  <td colSpan="2">
                    <strong>이메일:</strong> {user.email}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
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
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 정보 등록 섹션 */}
      <h2 style={{ margin: "50px 0px 0px 120px" }}>
        대주 사전교육 및 모의거래 등록
      </h2>
      <div className="mypage-info-registration-section">
        {/* Preliminary Education Section */}
        <div className="mypage-registration-item" ref={educationDropdownRef}>
          <button
            className="mypage-registration-button"
            onClick={() => setEducationDropdownOpen(!isEducationDropdownOpen)}
          >
            사전교육
          </button>
          {isEducationDropdownOpen && (
            <div className="dropdown-content">
              <h3>사전교육</h3>
              <label>
                사전교육 이수번호:&nbsp;
                <input
                  type="text"
                  value={educationCompletionNumber}
                  onChange={(e) => setEducationCompletionNumber(e.target.value)}
                />
              </label>
              <br />
              <button
                onClick={handleEducationRegistration}
                className="register-button"
              >
                교육 이수 등록
              </button>
            </div>
          )}
        </div>

        {/* Mock Trading Section */}
        <div className="mypage-registration-item" ref={mockTradingDropdownRef}>
          <button
            className="mypage-registration-button"
            onClick={() =>
              setMockTradingDropdownOpen(!isMockTradingDropdownOpen)
            }
          >
            모의거래
          </button>
          {isMockTradingDropdownOpen && (
            <div className="dropdown-content">
              <h3>모의거래</h3>
              <p>
                <strong>모의거래 등록여부:</strong>{" "}
                {mockTradingRegistrationStatus}
              </p>
              <label>
                모의거래 이수기관:&nbsp;
                <select
                  value={mockTradingInstitution}
                  onChange={(e) => setMockTradingInstitution(e.target.value)}
                >
                  <option value="">기관 선택</option>
                  <option value="기관1">기관1</option>
                  <option value="기관2">기관2</option>
                  {/* Add more options as needed */}
                </select>
              </label>
              <br />
              <label>
                모의거래 이수 완료일:&nbsp;
                <input
                  type="date"
                  value={mockTradingCompletionDate}
                  onChange={(e) => setMockTradingCompletionDate(e.target.value)}
                />
              </label>
              <br />
              <label>
                모의거래 이수시간:&nbsp;
                <input
                  type="number"
                  value={mockTradingCompletionTime}
                  onChange={(e) => setMockTradingCompletionTime(e.target.value)}
                />
              </label>
              <br />
              <label>
                모의거래 고객ID:&nbsp;
                <input
                  type="text"
                  value={mockTradingCustomerID}
                  onChange={(e) => setMockTradingCustomerID(e.target.value)}
                />
              </label>
              <br />
              <label>
                모의거래 인증키:&nbsp;
                <input
                  type="text"
                  value={mockTradingAuthenticationKey}
                  onChange={(e) =>
                    setMockTradingAuthenticationKey(e.target.value)
                  }
                />
              </label>
              <br />
              <button
                onClick={handleMockTradingRegistration}
                className="register-button"
              >
                교육 이수 등록
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 계좌 잔고 정보 섹션 */}
      <h2 style={{ margin: "100px 0px 0px 120px" }}>잔고</h2>
      {balanceInfo && (
        <div className="mypage-account-balance-section">
          <div className="mypage-balance-summary">
            <div className="mypage-profit-loss">
              <strong>평가손익</strong>
              <div>
                <span className="amount">
                  {formatNumber(balanceInfo.evlu_pfls_smtl_amt)}
                </span>
                <span className="percentage">
                  ({parseFloat(balanceInfo.asst_icdc_erng_rt).toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="mypage-balance-details">
              <div className="mypage-detail-row">
                <span>평가금액</span>
                <strong>{formatNumber(balanceInfo.tot_evlu_amt)}원</strong>
              </div>
              <div className="mypage-detail-row">
                <span>매입금액</span>
                <strong>{formatNumber(balanceInfo.pchs_amt_smtl_amt)}원</strong>
              </div>
              <div className="mypage-detail-row">
                <span>예수금</span>
                <strong>{formatNumber(balanceInfo.dnca_tot_amt)}원</strong>
              </div>
              <div className="mypage-detail-row">
                <span>D+2 예수금</span>
                <strong>
                  {formatNumber(balanceInfo.prvs_rcdl_excc_amt)}원
                </strong>
              </div>
            </div>
          </div>

          {/* 현금과 주식 비중 차트 */}
          {/* <div className="chart-container">
            <h3>현금과 주식 비중</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={cashAndStockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {cashAndStockData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#8884d8" : "#82ca9d"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div> */}
        </div>
      )}

      {/* 주식 잔고 섹션 */}
      <div className="mypage-holdings-section">
        {/* Left side: 현금 주식 잔고 */}
        <div className="mypage-holdings-container">
          {holdings.length > 0 && (
            <>
              <div style={{ marginBottom: "30px" }}>
                <strong>현금 주식 잔고</strong>
              </div>
              <div style={{ height: "200px" }}>
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
                        <td>{parseFloat(holding.pchs_avg_pric).toFixed(0)}</td>
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
              <strong>현금 주식 비중</strong>
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
            </>
          )}
        </div>

        {/* Right side: 신용 주식 잔고 */}
        <div className="mypage-holdings-container">
          {creditOrders.length > 0 ? (
            <>
              <div style={{ marginBottom: "30px" }}>
                <strong>신용 주식 잔고</strong>
              </div>
              <div style={{ height: "200px" }}>
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
                    {creditHoldings.map((holding, index) => {
                      // Calculate profit or loss and profit rate
                      const purchaseAmount = parseFloat(holding.total_price);
                      const evaluationAmount = parseFloat(
                        holding.total_current_price
                      );
                      const profitOrLoss = evaluationAmount - purchaseAmount;
                      const profitRate =
                        ((evaluationAmount - purchaseAmount) / purchaseAmount) *
                        100;

                      return (
                        <tr key={index}>
                          <td>{holding.stock_name}</td>
                          <td>{formatNumber(holding.quantity)}</td>
                          <td>{formatNumber(holding.price)}</td>
                          <td>{formatNumber(holding.current_price)}</td>
                          <td>{formatNumber(holding.total_price)}</td>
                          <td>{formatNumber(holding.total_current_price)}</td>
                          <td>{formatNumber(profitOrLoss)}</td>
                          <td>{profitRate.toFixed(2)}%</td>
                          <td>{formatDate(holding.loan_date)}</td>
                          <td>{formatDate(holding.maturity_date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <strong>신용 주식 비중</strong>
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
            </>
          ) : (
            <p>신용 주문 내역이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
