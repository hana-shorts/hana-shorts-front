import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 사용자 로그인 상태 확인
        const response = await axios.get("/api/user/status");
        if (response.data.success) {
          setUser(response.data.user);

          // 계좌 정보 가져오기
          const accountResponse = await axios.get(
            `/api/account/${response.data.user.userId}`
          );
          if (accountResponse.data) {
            setAccount(accountResponse.data);
          }

          // 잔고 및 보유 종목 정보 가져오기
          const [balanceResponse, holdingsResponse] = await Promise.all([
            axios.get("http://localhost:5002/api/balance_info"),
            axios.get("http://localhost:5002/api/holdings"),
          ]);

          setBalanceInfo(balanceResponse.data);
          setHoldings(holdingsResponse.data);
        }
      } catch (err) {
        console.error("사용자 정보 가져오기 실패:", err);
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
    const cashAmount = parseFloat(balanceInfo.dnca_tot_amt.replace(/,/g, ""));
    const stockAmount = parseFloat(balanceInfo.scts_evlu_amt.replace(/,/g, ""));
    cashAndStockData = [
      { name: "현금", value: cashAmount },
      { name: "주식", value: stockAmount },
    ];
  }

  // 보유 주식 비중 데이터 준비
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

  return (
    <div style={{ padding: "20px" }}>
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
        <strong>가입일:</strong>{" "}
        {new Date(user.signupDate).toLocaleDateString()}
      </p>
      <p>
        <strong>마지막 로그인:</strong>{" "}
        {new Date(user.lastLogin).toLocaleString()}
      </p>

      {account && (
        <>
          <h2>계좌 정보</h2>
          <p>
            <strong>계좌번호:</strong> {account.accountNumber}
          </p>
          <p>
            <strong>계좌 개설일:</strong>{" "}
            {new Date(account.accountRegistrationDate).toLocaleDateString()}
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
            <strong>평가 수익률:</strong>{" "}
            {parseFloat(balanceInfo.asst_icdc_erng_rt).toFixed(2)}%
          </p>

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
        </>
      )}

      {holdings.length > 0 && (
        <>
          <h2>보유 주식 정보</h2>
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>종목명</th>
                <th>보유 수량</th>
                <th>매입가</th>
                <th>현재가</th>
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
                  <td>{holding.pchs_avg_pric}</td>
                  <td>{holding.prpr}</td>
                  <td>{holding.evlu_amt}</td>
                  <td>{holding.evlu_pfls_amt}</td>
                  <td>
                    {(parseFloat(holding.evlu_erng_rt) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>보유 주식 비중</h3>
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
        </>
      )}
    </div>
  );
};

export default MyPage;
