// components/research/ResearchBox.jsx
import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import "./ResearchBox.css";

// 수정된 KOSDAQ 업종명
const kosdaqSectors = [
  "기계·장비",
  "기타서비스",
  "일반전기전자",
  "의료·정밀기기",
  "출판·매체복제",
  "제약",
  "유통",
  "오락·문화",
  "섬유·의류",
  "건설",
  "비금속",
  "금속",
  "화학",
  "기타제조",
  "금융",
  "음식료·담배",
  "운송장비·부품",
  "종이·목재",
  "운송",
  "숙박·음식",
  "전기·가스·수도",
  "농업, 임업 및 어업",
];

// ResearchBox component
const ResearchBox = () => {
  const steps = ["시장 선택", "업종 선택", "지표 선택", "결과"]; // Stepper 단계

  const kospiSectors = [
    "음식료품",
    "유통업",
    "운수창고업",
    "기계",
    "종이목재",
    "섬유의복",
    "철강금속",
    "화학",
    "서비스업",
    "전기전자",
    "전기가스업",
    "기타금융",
    "의약품",
    "건설업",
    "증권",
    "비금속광물",
    "운수장비",
    "은행",
    "의료정밀",
    "보험",
    "농업, 임업 및 어업",
    "기타제조업",
    "통신업",
  ];

  const indicators = [
    "Moving Average (MA)",
    "Relative Strength Index (RSI)",
    "Bollinger Bands",
    "MACD",
    "Stochastic Oscillator",
    "Average Directional Index (ADX)",
    "Commodity Channel Index (CCI)",
    "Momentum",
    "On-Balance Volume (OBV)",
    "Ichimoku Cloud",
    "VWAP",
    "Price Channel",
  ];

  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [recommendations, setRecommendations] = useState({ buy: [], sell: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 시작 화면 제거하고 1단계부터 시작
  const [kospiData, setKospiData] = useState([]);
  const [kosdaqData, setKosdaqData] = useState([]);
  const [graphsVisible, setGraphsVisible] = useState(false); // 그래프 표시 여부

  useEffect(() => {
    // KOSPI 데이터 불러오기
    fetch("http://localhost:5002/api/index_data?market_id=1001")
      .then((response) => response.json())
      .then((data) => setKospiData(data))
      .catch((error) => console.error("Error fetching KOSPI data:", error));

    // KOSDAQ 데이터 불러오기
    fetch("http://localhost:5002/api/index_data?market_id=2001")
      .then((response) => response.json())
      .then((data) => setKosdaqData(data))
      .catch((error) => console.error("Error fetching KOSDAQ data:", error));

    // 초기 로드 후 0.5초 대기
    const timer = setTimeout(() => {
      setGraphsVisible(true);
    }, 500); // 0.5초 후에 그래프 표시

    return () => clearTimeout(timer);
  }, []);

  const handleMarketChange = (market) => {
    setSelectedMarkets((prevSelected) =>
      prevSelected.includes(market)
        ? prevSelected.filter((item) => item !== market)
        : [...prevSelected, market]
    );
  };

  const handleSectorChange = (sector) => {
    setSelectedSectors((prevSelected) =>
      prevSelected.includes(sector)
        ? prevSelected.filter((item) => item !== sector)
        : [...prevSelected, sector]
    );
  };

  const handleIndicatorChange = (indicator) => {
    setSelectedIndicators((prevSelected) =>
      prevSelected.includes(indicator)
        ? prevSelected.filter((item) => item !== indicator)
        : [...prevSelected, indicator]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedMarkets.length === 0) {
        setError("시장을 선택해주세요.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedSectors.length === 0) {
        setError("업종을 선택해주세요.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (selectedIndicators.length === 0) {
        setError("지표를 선택해주세요.");
        return;
      }
      fetchRecommendations();
    }
  };

  const fetchRecommendations = () => {
    setLoading(true);
    fetch("http://localhost:5002/api/get_recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        indicators: selectedIndicators,
        selected_sectors: selectedSectors,
      }),
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "서버 에러가 발생했습니다.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setRecommendations(data);
        setStep(4);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleStartOver = () => {
    setSelectedMarkets([]);
    setSelectedSectors([]);
    setSelectedIndicators([]);
    setRecommendations({ buy: [], sell: [] });
    setStep(1);
  };

  const handleCloseError = () => {
    setError(null);
  };

  // 단계에 따른 내용 렌더링
  const renderStepContent = () => {
    switch (step) {
      case 1:
        // Prepare content for KOSPI
        let kospiContent;
        if (kospiData.length === 0) {
          kospiContent = (
            <Card className="researchbox-market-card">
              <CardContent>
                <div className="researchbox-loading-container">
                  <CircularProgress size={24} />
                </div>
              </CardContent>
            </Card>
          );
        } else {
          const latestPrice = kospiData[kospiData.length - 1]["종가"];
          const previousPrice = kospiData[kospiData.length - 2]["종가"];
          const priceChange = latestPrice - previousPrice;
          const percentChange = ((priceChange / previousPrice) * 100).toFixed(
            2
          );

          const priceChangeFormatted =
            priceChange > 0
              ? `+${priceChange.toFixed(2)}`
              : `${priceChange.toFixed(2)}`;
          const percentChangeFormatted =
            priceChange > 0 ? `+${percentChange}%` : `${percentChange}%`;
          const changeColor = priceChange > 0 ? "red" : "blue";

          kospiContent = (
            <Card
              onClick={() => handleMarketChange("KOSPI")}
              className={`researchbox-market-card ${
                selectedMarkets.includes("KOSPI") ? "selected" : ""
              }`}
            >
              <CardContent className="researchbox-market-card-content">
                <div className="researchbox-market-name">KOSPI</div>
                <div className="researchbox-market-price">
                  {latestPrice.toLocaleString()}
                </div>
                <div
                  className="researchbox-market-change"
                  style={{ color: changeColor }}
                >
                  {priceChangeFormatted} ({percentChangeFormatted})
                </div>
                <div className="researchbox-market-card-chart">
                  <ResponsiveContainer width="100%" height={80}>
                    <AreaChart data={kospiData}>
                      <defs>
                        <linearGradient
                          id={`colorLine-KOSPI`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="red" stopOpacity={0} />
                          <stop
                            offset="100%"
                            stopColor="red"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="종가"
                        stroke="red"
                        fill={`url(#colorLine-KOSPI)`}
                        dot={false}
                        isAnimationActive={graphsVisible}
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        }

        // Prepare content for KOSDAQ
        let kosdaqContent;
        if (kosdaqData.length === 0) {
          kosdaqContent = (
            <Card className="researchbox-market-card">
              <CardContent>
                <div className="researchbox-loading-container">
                  <CircularProgress size={24} />
                </div>
              </CardContent>
            </Card>
          );
        } else {
          const latestPrice = kosdaqData[kosdaqData.length - 1]["종가"];
          const previousPrice = kosdaqData[kosdaqData.length - 2]["종가"];
          const priceChange = latestPrice - previousPrice;
          const percentChange = ((priceChange / previousPrice) * 100).toFixed(
            2
          );

          const priceChangeFormatted =
            priceChange > 0
              ? `+${priceChange.toFixed(2)}`
              : `${priceChange.toFixed(2)}`;
          const percentChangeFormatted =
            priceChange > 0 ? `+${percentChange}%` : `${percentChange}%`;
          const changeColor = priceChange > 0 ? "red" : "blue";

          kosdaqContent = (
            <Card
              onClick={() => handleMarketChange("KOSDAQ")}
              className={`researchbox-market-card ${
                selectedMarkets.includes("KOSDAQ") ? "selected" : ""
              }`}
            >
              <CardContent className="researchbox-market-card-content">
                <div className="researchbox-market-name">KOSDAQ</div>
                <div className="researchbox-market-price">
                  {latestPrice.toLocaleString()}
                </div>
                <div
                  className="researchbox-market-change"
                  style={{ color: changeColor }}
                >
                  {priceChangeFormatted} ({percentChangeFormatted})
                </div>
                <div className="researchbox-market-card-chart">
                  <ResponsiveContainer width="100%" height={80}>
                    <AreaChart data={kosdaqData}>
                      <defs>
                        <linearGradient
                          id={`colorLine-KOSDAQ`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="blue" stopOpacity={0} />
                          <stop
                            offset="100%"
                            stopColor="blue"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="종가"
                        stroke="blue"
                        fill={`url(#colorLine-KOSDAQ)`}
                        dot={false}
                        isAnimationActive={graphsVisible}
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        }

        return (
          <>
            <div className="researchbox-header">
              추천받고자 하는 시장을 선택해주세요
            </div>
            <div className="researchbox-market-container">
              {kospiContent}
              {kosdaqContent}
            </div>
            <div className="researchbox-button-container">
              <Button variant="contained" color="primary" onClick={handleNext}>
                다음으로
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="researchbox-header">
              관심 있는 업종은 무엇인가요?
            </div>
            <div className="researchbox-step-content">
              {selectedMarkets.map((market) => {
                const sectorsToDisplay =
                  market === "KOSPI" ? kospiSectors : kosdaqSectors;
                return (
                  <div key={market} className="researchbox-sector-section">
                    <div className="researchbox-sector-header">
                      {market} 업종:
                    </div>
                    <div className="researchbox-sectors">
                      {sectorsToDisplay.map((sector, index) => (
                        <div
                          className="researchbox-sector-item"
                          key={`${market}-${index}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSectors.includes(sector)}
                            onChange={() => handleSectorChange(sector)}
                            id={`${market}-${sector}`}
                          />
                          <label htmlFor={`${market}-${sector}`}>
                            {sector}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="researchbox-button-container">
              <Button variant="contained" color="primary" onClick={handleNext}>
                다음으로
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="researchbox-header">
              분석에 활용할 지표를 선택해 주세요
            </div>
            <div className="researchbox-step-content">
              <div className="researchbox-indicators">
                {indicators.map((indicator, index) => (
                  <div className="researchbox-indicator-item" key={index}>
                    <input
                      type="checkbox"
                      checked={selectedIndicators.includes(indicator)}
                      onChange={() => handleIndicatorChange(indicator)}
                      id={`indicator-${index}`}
                    />
                    <label htmlFor={`indicator-${index}`}>{indicator}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="researchbox-button-container">
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={loading}
              >
                결과 보기
              </Button>
            </div>
            {loading && (
              <div className="researchbox-loading-container">
                <CircularProgress />
              </div>
            )}
          </>
        );
      case 4:
        return (
          <>
            {loading ? (
              <div className="researchbox-loading-container">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="researchbox-header">
                  매수 추천 종목 상위 5개:
                </div>
                <div className="researchbox-recommendations-container">
                  {recommendations.buy.slice(0, 5).map((item, index) => (
                    <Card
                      className="researchbox-recommendation-card"
                      key={`buy-${index}`}
                    >
                      <CardContent>
                        <div className="researchbox-rank">#{index + 1}</div>
                        <div className="researchbox-stock-name">{item}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="researchbox-header">
                  매도 추천 종목 상위 5개:
                </div>
                <div className="researchbox-recommendations-container">
                  {recommendations.sell.slice(0, 5).map((item, index) => (
                    <Card
                      className="researchbox-recommendation-card"
                      key={`sell-${index}`}
                    >
                      <CardContent>
                        <div className="researchbox-rank">#{index + 1}</div>
                        <div className="researchbox-stock-name">{item}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="researchbox-button-container">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStartOver}
                  >
                    처음으로
                  </Button>
                </div>
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Customized Stepper */}
      <Box sx={{ width: "100%", marginTop: "100px", marginBottom: "100px" }}>
        <Stepper activeStep={step - 1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <div className="researchbox-content-box">{renderStepContent()}</div>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResearchBox;
