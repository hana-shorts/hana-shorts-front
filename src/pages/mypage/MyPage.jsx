import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [holdings, setHoldings] = useState([]);

  // 추가된 상태 변수
  const [creditOrders, setCreditOrders] = useState([]); // 유통대주신규 주문 내역
  const [creditHoldings, setCreditHoldings] = useState([]); // 신용 보유 주식
  const [creditHoldingsData, setCreditHoldingsData] = useState([]); // 신용 보유 주식 비중 데이터

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 사용자 로그인 상태 확인
        const response = await axios.get('/api/user/status');
        if (response.data.success) {
          setUser(response.data.user);

          // 계좌 정보 가져오기
          const accountResponse = await axios.get(`/api/account/${response.data.user.userId}`);
          if (accountResponse.data) {
            setAccount(accountResponse.data);
          }

          // 잔고 및 보유 종목 정보 가져오기
          const [balanceResponse, holdingsResponse] = await Promise.all([
            axios.get('http://localhost:5002/api/balance_info'),
            axios.get('http://localhost:5002/api/holdings'),
          ]);

          setBalanceInfo(balanceResponse.data);
          setHoldings(holdingsResponse.data);

          // 신용 주문 내역 가져오기
          const creditResponse = await axios.get('http://localhost:8080/api/order_history_credit');
          if (creditResponse.data && creditResponse.data.length > 0) {
            setCreditOrders(creditResponse.data);

            // 신용 주문에 해당하는 종목 코드 추출
            const creditStockCodes = creditResponse.data.map((order) => order.stock_code);

            // 현재가 데이터 가져오기
            const currentPricePromises = creditStockCodes.map((code) =>
              axios
                .get(`http://localhost:5002/api/current_price?code=${code}`)
                .then((res) => ({
                  stock_code: code,
                  current_price: res.data.closing_price || 0,
                }))
                .catch((err) => {
                  console.error(`현재가 가져오기 실패 (${code}):`, err);
                  return { stock_code: code, current_price: 0 };
                })
            );

            const currentPrices = await Promise.all(currentPricePromises);

            // 신용 보유 주식 정보 구성
            const creditHoldingsData = creditResponse.data.map((order) => {
              const priceData = currentPrices.find((cp) => cp.stock_code === order.stock_code);
              return {
                stock_name: order.stock_name, // 주문 내역에 stock_name이 포함되어야 함
                quantity: order.quantity,
                price: order.price, // 주문 단가
                current_price: priceData ? priceData.current_price : 0,
                total_price: order.quantity * order.price,
                total_current_price: order.quantity * (priceData ? priceData.current_price : 0),
                loan_date: order.loan_date,
                maturity_date: order.maturity_date,
              };
            });

            setCreditHoldings(creditHoldingsData);

            // 파이 차트 데이터 준비
            // const totalCreditAmount = creditHoldingsData.reduce((acc, holding) => acc + holding.total, 0);
            const creditPieData = creditHoldingsData.map((holding) => ({
              name: holding.stock_name,
              value: holding.total_current_price,
            }));
            setCreditHoldingsData(creditPieData);
          }
        }
      } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  // 현금과 주식 비중 데이터 준비
  let cashAndStockData = [];
  if (balanceInfo) {
    const cashAmount = parseFloat(balanceInfo.dnca_tot_amt.replace(/,/g, ''));
    const stockAmount = parseFloat(balanceInfo.scts_evlu_amt.replace(/,/g, ''));
    cashAndStockData = [
      { name: '현금', value: cashAmount },
      { name: '주식', value: stockAmount },
    ];
  }

  // 보유 주식 비중 데이터 준비
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A52A2A', '#8A2BE2', '#5F9EA0'];
  const holdingsData = holdings.map((holding) => ({
    name: holding.prdt_name,
    value: parseFloat(holding.evlu_amt.replace(/,/g, '')),
  }));

  // 신용 보유 주식 비중 데이터 색상 설정
  const CREDIT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a52a2a', '#8a2be2', '#5f9ea0'];

  // 숫자에 천단위 구분 기호 추가하는 함수
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>마이 페이지</h1>
      <p>
        <strong>아이디:</strong> {user.userId}
      </p>
      <p>
        <strong>이름:</strong> {user.name}
      </p>
      <p>
        <strong>이메일:</strong> {user.email}
      </p>
      <p>
        <strong>전화번호:</strong> {user.phoneNumber}
      </p>
      <p>
        <strong>가입일:</strong> {new Date(user.signupDate).toLocaleDateString()}
      </p>
      <p>
        <strong>마지막 로그인:</strong> {new Date(user.lastLogin).toLocaleString()}
      </p>

      {account && (
        <>
          <h2>계좌 정보</h2>
          <p>
            <strong>계좌번호:</strong> {account.accountNumber}
          </p>
          <p>
            <strong>계좌 개설일:</strong> {new Date(account.accountRegistrationDate).toLocaleDateString()}
          </p>
          <p>
            <strong>계좌 상태:</strong> {account.accountStatus}
          </p>
        </>
      )}

      {balanceInfo && (
        <>
          <h2>계좌 잔고 정보</h2>
          <p>
            <strong>평가 금액:</strong> {balanceInfo.tot_evlu_amt}
          </p>
          <p>
            <strong>매입 금액:</strong> {balanceInfo.pchs_amt_smtl_amt}
          </p>
          <p>
            <strong>예수금:</strong> {balanceInfo.dnca_tot_amt}
          </p>
          <p>
            <strong>D+2 예수금:</strong> {balanceInfo.prvs_rcdl_excc_amt}
          </p>
          <p>
            <strong>평가 손익:</strong> {balanceInfo.evlu_pfls_smtl_amt}
          </p>
          <p>
            <strong>평가 수익률:</strong> {parseFloat(balanceInfo.asst_icdc_erng_rt).toFixed(2)}%
          </p>

          <h3>현금과 주식 비중</h3>
          <PieChart width={400} height={300}>
            <Pie data={cashAndStockData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {cashAndStockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </>
      )}

      {/* 현금 보유 주식 정보 및 비중 */}
      {holdings.length > 0 && (
        <>
          <h2>현금 주식 잔고</h2>
          <table border="1" cellPadding="5" cellSpacing="0">
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
                  <td>{holding.hldg_qty}</td>
                  <td>{(parseFloat(holding.pchs_avg_pric) * 1).toFixed(0)}</td>
                  <td>{holding.prpr}</td>
                  <td>{formatNumber(holding.pchs_amt)}</td>
                  <td>{formatNumber(holding.evlu_amt)}</td>
                  <td>{formatNumber(holding.evlu_pfls_amt)}</td>
                  <td>{(parseFloat(holding.evlu_erng_rt) * 1).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>현금 주식 비중</h3>
          <PieChart width={400} height={300}>
            <Pie data={holdingsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {holdingsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </>
      )}

      {/* 추가된 신용 탭 섹션 */}
      {creditOrders.length > 0 && (
        <>
          <h2>신용 주문 잔고</h2>
          <table border="1" cellPadding="5" cellSpacing="0">
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
                // 매입 금액과 평가 금액을 가져와 평가 손익과 수익률 계산
                const purchaseAmount = parseFloat(holding.total_price);
                const evaluationAmount = parseFloat(holding.total_current_price);

                // 평가 손익 계산
                const profitOrLoss = evaluationAmount - purchaseAmount;

                // 수익률 계산
                const profitRate = ((evaluationAmount - purchaseAmount) / purchaseAmount) * 100;

                return (
                  <tr key={index}>
                    <td>{holding.stock_name}</td>
                    <td>{holding.quantity}</td>
                    <td>{holding.price}</td>
                    <td>{holding.current_price}</td>
                    <td>{holding.total_price}</td>
                    <td>{holding.total_current_price}</td>
                    {/* 평가 손익 표시 */}
                    <td>{profitOrLoss.toFixed(0)}</td>
                    {/* 계산된 수익률을 소수점 둘째 자리까지 표시 */}
                    <td>{profitRate.toFixed(2)}%</td>
                    <td>{formatDate(holding.loan_date)}</td> {/* 대출일 포맷팅 */}
                    <td>{formatDate(holding.maturity_date)}</td> {/* 만기일 포맷팅 */}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3>신용 보유 비중</h3>
          <PieChart width={400} height={300}>
            <Pie data={creditHoldingsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {creditHoldingsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CREDIT_COLORS[index % CREDIT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </>
      )}

      {/* 신용 주문 내역이 없을 때 */}
      {creditOrders.length === 0 && <p>신용 주문 내역이 없습니다.</p>}
    </div>
  );
};

export default MyPage;
