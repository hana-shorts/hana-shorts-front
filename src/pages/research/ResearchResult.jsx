import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import './ResearchResult.css';

// 순위별 CSS 클래스를 반환하는 함수
const getRankClass = (index) => {
  if (index === 0) return 'rank1';
  if (index === 1) return 'rank2';
  if (index === 2) return 'rank3';
  return 'rank-dark'; // 4등부터는 공통 클래스 사용
};

// 변화량에 따라 색상을 결정하는 함수
const getChangeColor = (change) => (change > 0 ? '#dc3545' : '#007bff');

const ResearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { buy = [], sell = [], buy_data = {}, sell_data = {} } = location.state || {};

  // 데이터가 없는 경우 처리
  if (!location.state) {
    return (
      <div className="researchresult-container">
        <h2>추천 종목이 없습니다.</h2>
        <button onClick={() => navigate('/research')} className="researchresult-button">
          처음으로
        </button>
      </div>
    );
  }

  // 변화량 계산 함수
  const calculateChange = (chartData) => {
    if (chartData.length < 2) return { change: 0, changePercent: 0 };
    const lastPrice = chartData[chartData.length - 1].close_price;
    const previousPrice = chartData[chartData.length - 2].close_price;
    const change = lastPrice - previousPrice;
    const changePercent = ((change / previousPrice) * 100).toFixed(2);
    return { change, changePercent };
  };

  // Y축 범위 설정 함수
  const getYDomain = (chartData) => {
    const prices = chartData.map((d) => d.close_price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const buffer = (maxPrice - minPrice) * 0.1; // 최소, 최대값에서 10% 범위 추가
    return [minPrice - buffer, maxPrice + buffer];
  };

  return (
    <div className="researchresult-container fade-in-minus-y">
      {/* 매수 추천 종목 */}
      <div className="researchresult-wrapper">
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>매수 추천 종목</div>
        <div className="researchresult-section">
          {buy.slice(0, 5).map((item, index) => {
            const chartData = buy_data[item.stock_code];
            const { change, changePercent } = calculateChange(chartData);
            const lastPrice = chartData[chartData.length - 1]?.close_price || 0;
            const changeColor = getChangeColor(change);

            return (
              <div key={`buy-${index}`} className="researchresult-card">
                <div className={`researchresult-rank ${getRankClass(index)}`}>
                  <div className="researchresult-rank-number">{index + 1}</div>
                </div>
                <div className="researchresult-header">
                  <div className="researchresult-stock-name">{item.stock_name}</div>
                  <button
                    onClick={() => navigate(`/trade/${item.stock_code}`, { state: { stockName: item.stock_name } })}
                    className="researchresult-trade-button"
                  >
                    바로 가기
                  </button>
                </div>
                <div className="researchresult-content">
                  <div className="researchresult-lastprice">
                    <div style={{ fontSize: '13px' }}>전일 종가</div>
                    <div>{lastPrice.toLocaleString()}</div>
                  </div>
                  <div className="researchresult-change" style={{ color: changeColor }}>
                    <div style={{ fontSize: '13px' }}>전일 대비</div>
                    <div>
                      {change > 0 ? `+${change}` : change} &nbsp;
                      {changePercent}%
                    </div>
                  </div>
                </div>
                <div className="researchresult-chart">
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`colorLine-${item.stock_code}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#dc3545" stopOpacity={0} />
                          <stop offset="100%" stopColor="#dc3545" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <YAxis
                        domain={getYDomain(chartData)} // Y축 범위 설정
                        hide={true}
                      />
                      <Area
                        type="monotone"
                        dataKey="close_price"
                        stroke="#dc3545"
                        fill={`url(#colorLine-${item.stock_code})`}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 매도 추천 종목 */}
      <div className="researchresult-wrapper">
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>매도 추천 종목</div>
        <div className="researchresult-section">
          {sell.slice(0, 5).map((item, index) => {
            const chartData = sell_data[item.stock_code];
            const { change, changePercent } = calculateChange(chartData);
            const lastPrice = chartData[chartData.length - 1]?.close_price || 0;
            const changeColor = getChangeColor(change);

            return (
              <div key={`sell-${index}`} className="researchresult-card">
                <div className={`researchresult-rank ${getRankClass(index)}`}>
                  <div className="researchresult-rank-number">{index + 1}</div>
                </div>
                <div className="researchresult-header">
                  <div className="researchresult-stock-name">{item.stock_name}</div>
                  <button
                    onClick={() => navigate(`/trade/${item.stock_code}`, { state: { stockName: item.stock_name } })}
                    className="researchresult-trade-button"
                  >
                    바로 가기
                  </button>
                </div>
                <div className="researchresult-content">
                  <div className="researchresult-lastprice">
                    <div style={{ fontSize: '13px' }}>전일 종가</div>
                    <div>{lastPrice.toLocaleString()}</div>
                  </div>
                  <div className="researchresult-change" style={{ color: changeColor }}>
                    <div style={{ fontSize: '13px' }}>전일 대비</div>
                    <div>
                      {change > 0 ? `+${change}` : change} &nbsp;
                      {changePercent}%
                    </div>
                  </div>
                </div>
                <div className="researchresult-chart">
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`colorLine-${item.stock_code}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#007bff" stopOpacity={0} />
                          <stop offset="100%" stopColor="#007bff" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <YAxis domain={getYDomain(chartData)} hide={true} />
                      <Area
                        type="monotone"
                        dataKey="close_price"
                        stroke="#007bff"
                        fill={`url(#colorLine-${item.stock_code})`}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => navigate('/research/recommend')} className="researchresult-button">
        처음으로
      </button>
    </div>
  );
};

export default ResearchResult;
