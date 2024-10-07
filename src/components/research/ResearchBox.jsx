// components/research/ResearchBox.jsx
import React, { useState, useEffect } from "react";
import {
  Snackbar,
  Alert,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  StepConnector,
  Modal,
  Button,
  Tooltip,
} from "@mui/material";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { styled } from "@mui/system"; // Import for styled
import { useNavigate } from "react-router-dom";
import "./ResearchBox.css";

// Custom StepConnector with dynamic coloring
const CustomStepConnector = styled(StepConnector)(() => ({
  [`& .MuiStepConnector-line`]: {
    borderColor: "#bdbdbd", // 기본 회색 색상
    borderTopWidth: 4, // 선 두께
    transition: "border-color 1s ease-in-out", // 색상 전환 효과
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    borderColor: "#009178", // 활성화된 단계의 색상
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    borderColor: "#009178", // 완료된 단계의 색상
  },
}));

// Custom Tooltip with adjusted size and font
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .MuiTooltip-tooltip`]: {
    fontSize: "16px", // 원하는 글자 크기
    padding: "10px 12px", // 원하는 패딩
    maxWidth: "500px", // 최대 너비 조정
  },
});

const kospiSectors = [
  "건설업",
  "기계",
  "기타금융",
  "기타제조업",
  "농업, 임업 및 어업",
  "보험",
  "비금속광물",
  "서비스업",
  "섬유의복",
  "운수장비",
  "운수창고업",
  "유통업",
  "은행",
  "음식료품",
  "의료정밀",
  "의약품",
  "전기가스업",
  "전기전자",
  "종이목재",
  "증권",
  "철강금속",
  "통신업",
  "화학",
];

const kosdaqSectors = [
  "건설",
  "금속",
  "금융",
  "기계·장비",
  "기타서비스",
  "기타제조",
  "농업, 임업 및 어업",
  "비금속",
  "섬유·의류",
  "숙박·음식",
  "오락·문화",
  "운송",
  "운송장비·부품",
  "유통",
  "음식료·담배",
  "의료·정밀기기",
  "일반전기전자",
  "전기·가스·수도",
  "제약",
  "종이·목재",
  "출판·매체복제",
  "화학",
];

// Updated indicators with Korean display names and descriptions
const indicators = [
  {
    name: "Moving Average (MA)",
    displayName: "이동 평균선 (MA)",
    description: "가격의 평균을 계산하여 추세를 파악합니다.",
  },
  {
    name: "Relative Strength Index (RSI)",
    displayName: "상대 강도 지수 (RSI)",
    description: "과매수 또는 과매도를 나타냅니다.",
  },
  {
    name: "Bollinger Bands",
    displayName: "볼린저 밴드",
    description: "가격의 변동성을 측정합니다.",
  },
  {
    name: "MACD",
    displayName: "MACD",
    description: "추세의 방향과 모멘텀을 분석합니다.",
  },
  {
    name: "Stochastic Oscillator",
    displayName: "스토캐스틱 오실레이터",
    description: "과매수 또는 과매도 상태를 식별합니다.",
  },
  {
    name: "Average Directional Index (ADX)",
    displayName: "평균 방향 지수 (ADX)",
    description: "추세의 강도를 측정합니다.",
  },
  {
    name: "Commodity Channel Index (CCI)",
    displayName: "상품 채널 지수 (CCI)",
    description: "가격의 변동성을 평가합니다.",
  },
  {
    name: "Momentum",
    displayName: "모멘텀",
    description: "가격 변화의 속도를 측정합니다.",
  },
  {
    name: "On-Balance Volume (OBV)",
    displayName: "온 밸런스 볼륨 (OBV)",
    description: "거래량과 가격 움직임을 연결합니다.",
  },
  {
    name: "Ichimoku Cloud",
    displayName: "일목균형표",
    description: "지지와 저항 수준을 식별합니다.",
  },
  {
    name: "VWAP",
    displayName: "VWAP",
    description: "기간 동안의 평균 거래 가격을 나타냅니다.",
  },
  {
    name: "Price Channel",
    displayName: "가격 채널",
    description: "가격의 고점과 저점을 연결하여 범위를 설정합니다.",
  },
];

// Sort indicators based on displayName (Korean alphabetical order)
const sortedIndicators = indicators.sort((a, b) =>
  a.displayName.localeCompare(b.displayName, "ko")
);

// Recommended indicator combinations
const recommendedCombinations = [
  {
    id: 1,
    name: "추세 추종 조합",
    indicators: [
      "Moving Average (MA)",
      "MACD",
      "Average Directional Index (ADX)",
    ],
    reason: "추세의 방향과 강도를 파악하여 안정적인 매매 신호를 제공합니다.",
  },
  {
    id: 2,
    name: "과매수/과매도 조합",
    indicators: [
      "Relative Strength Index (RSI)",
      "Stochastic Oscillator",
      "Commodity Channel Index (CCI)",
    ],
    reason: "시장 과열 상태를 감지하여 반전 가능성을 예측합니다.",
  },
  {
    id: 3,
    name: "볼륨 기반 조합",
    indicators: ["On-Balance Volume (OBV)", "VWAP", "Price Channel"],
    reason: "거래량과 가격 움직임을 분석하여 매매 타이밍을 포착합니다.",
  },
];

const ResearchBox = () => {
  const steps = ["", "", ""]; // Stepper labels
  const navigate = useNavigate(); // Initialize navigation hook

  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedKospiSectors, setSelectedKospiSectors] = useState([]);
  const [selectedKosdaqSectors, setSelectedKosdaqSectors] = useState([]);
  const combinedSectors = [
    ...new Set([...selectedKospiSectors, ...selectedKosdaqSectors]),
  ];
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [error, setError] = useState(null);
  const [stepState, setStepState] = useState(1); // Start at step 1
  const [kospiData, setKospiData] = useState([]);
  const [kosdaqData, setKosdaqData] = useState([]);
  const [graphsVisible, setGraphsVisible] = useState(false); // Graph visibility
  const [isAIModalOpen, setIsAIModalOpen] = useState(false); // AI Modal state

  useEffect(() => {
    // Fetch KOSPI data
    fetch("http://localhost:5002/api/index_data?market_id=1001")
      .then((response) => response.json())
      .then((data) => setKospiData(data))
      .catch((error) => console.error("KOSPI 데이터 가져오기 오류:", error));

    // Fetch KOSDAQ data
    fetch("http://localhost:5002/api/index_data?market_id=2001")
      .then((response) => response.json())
      .then((data) => setKosdaqData(data))
      .catch((error) => console.error("KOSDAQ 데이터 가져오기 오류:", error));

    // Initial load delay for graph animation
    const timer = setTimeout(() => {
      setGraphsVisible(true);
    }, 500); // Show graphs after 0.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleMarketChange = (market) => {
    setSelectedMarkets((prevSelected) =>
      prevSelected.includes(market)
        ? prevSelected.filter((item) => item !== market)
        : [...prevSelected, market]
    );
  };

  const handleKospiSectorChange = (sector) => {
    setSelectedKospiSectors((prevSelected) =>
      prevSelected.includes(sector)
        ? prevSelected.filter((item) => item !== sector)
        : [...prevSelected, sector]
    );
  };

  const handleKosdaqSectorChange = (sector) => {
    setSelectedKosdaqSectors((prevSelected) =>
      prevSelected.includes(sector)
        ? prevSelected.filter((item) => item !== sector)
        : [...prevSelected, sector]
    );
  };

  const handleIndicatorChange = (indicatorName) => {
    setSelectedIndicators((prevSelected) =>
      prevSelected.includes(indicatorName)
        ? prevSelected.filter((item) => item !== indicatorName)
        : [...prevSelected, indicatorName]
    );
  };

  const handleNext = () => {
    if (stepState === 1) {
      if (selectedMarkets.length === 0) {
        setError("시장을 선택해주세요.");
        return;
      }
      setStepState(2);
      setSelectedKospiSectors([]); // Reset sectors when moving to step 2
      setSelectedKosdaqSectors([]);
    } else if (stepState === 2) {
      if (
        selectedKospiSectors.length === 0 &&
        selectedKosdaqSectors.length === 0
      ) {
        setError("업종을 선택해주세요.");
        return;
      }
      setStepState(3);
      setSelectedIndicators([]); // Reset indicators when moving to step 3
    } else if (stepState === 3) {
      if (selectedIndicators.length === 0) {
        setError("지표를 선택해주세요.");
        return;
      }
      // Show AI Model confirmation modal
      setIsAIModalOpen(true);
    }
  };

  const handlePrevious = () => {
    if (stepState === 1) return;
    setStepState(stepState - 1);
    if (stepState === 3) {
      setSelectedIndicators([]); // Reset indicators when moving back to step 2
    } else if (stepState === 2) {
      setSelectedKospiSectors([]);
      setSelectedKosdaqSectors([]); // Reset sectors when moving back to step 1
    }
  };

  const fetchRecommendations = (indicators = selectedIndicators) => {
    fetch("http://localhost:5002/api/get_recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        indicators: indicators,
        selected_sectors: combinedSectors,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "서버 에러가 발생했습니다.");
          });
        }
        return response.json();
      })
      .then((data) => {
        // Navigate to /research/result with data
        navigate("/research/result", { state: data });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleAIModalClose = () => {
    setIsAIModalOpen(false);
    // Proceed without adding 'AI Model'
    fetchRecommendations();
  };

  const handleAIModalConfirm = () => {
    setIsAIModalOpen(false);
    // Add 'AI Model' to indicators
    const updatedIndicators = [...selectedIndicators, "AI Model"];
    setSelectedIndicators(updatedIndicators);
    fetchRecommendations(updatedIndicators);
  };

  // Handle recommended combination selection
  const handleRecommendedCombination = (combination) => {
    setSelectedIndicators(combination.indicators);
  };

  // Step content rendering with animation classes
  const renderStepContent = () => {
    switch (stepState) {
      case 1:
        // KOSPI Content
        let kospiContent;
        if (kospiData.length === 0) {
          kospiContent = (
            <Card className="researchbox-market-card">
              <CardContent>
                <div className="researchbox-loading-container">
                  <CircularProgress /> {/* CircularProgress 추가 */}
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
          const changeColor = priceChange > 0 ? "#dc3545" : "#007bff";

          kospiContent = (
            <Card
              onClick={() => handleMarketChange("KOSPI")}
              className={`researchbox-market-card ${
                selectedMarkets.includes("KOSPI") ? "selected" : ""
              }`}
            >
              <CardContent className="researchbox-market-card-content">
                <div
                  className="researchbox-market-name"
                  style={{ color: changeColor }}
                >
                  KOSPI
                </div>
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
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={kospiData}>
                      <defs>
                        <linearGradient
                          id={`colorLine-KOSPI`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={changeColor}
                            stopOpacity={0}
                          />
                          <stop
                            offset="100%"
                            stopColor={changeColor}
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                      </defs>
                      <YAxis
                        domain={["dataMin - 100", "dataMax + 100"]}
                        hide={true}
                      />
                      <Area
                        type="monotone"
                        dataKey="종가"
                        stroke={changeColor}
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

        // KOSDAQ Content
        let kosdaqContent;
        if (kosdaqData.length === 0) {
          kosdaqContent = (
            <Card className="researchbox-market-card">
              <CardContent>
                <div className="researchbox-loading-container">
                  <CircularProgress /> {/* CircularProgress 추가 */}
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
          const changeColor = priceChange > 0 ? "#dc3545" : "#007bff";

          kosdaqContent = (
            <Card
              onClick={() => handleMarketChange("KOSDAQ")}
              className={`researchbox-market-card ${
                selectedMarkets.includes("KOSDAQ") ? "selected" : ""
              }`}
            >
              <CardContent className="researchbox-market-card-content">
                <div
                  className="researchbox-market-name"
                  style={{ color: changeColor }}
                >
                  KOSDAQ
                </div>
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
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={kosdaqData}>
                      <defs>
                        <linearGradient
                          id={`colorLine-KOSDAQ`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={changeColor}
                            stopOpacity={0}
                          />
                          <stop
                            offset="100%"
                            stopColor={changeColor}
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                      </defs>
                      <YAxis
                        domain={["dataMin - 100", "dataMax + 100"]}
                        hide={true}
                      />
                      <Area
                        type="monotone"
                        dataKey="종가"
                        stroke={changeColor}
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
              <div style={{ width: "120px" }}></div>
              <button
                onClick={handleNext}
                className="researchbox-button"
                style={{ marginRight: "200px" }}
              >
                다음으로
              </button>
            </div>
          </>
        );
      case 2:
        // 업종 선택 단계
        return (
          <>
            <div className="researchbox-header">
              관심 있는 업종은 무엇인가요?
            </div>

            <div className="researchbox-sectors-container">
              {selectedMarkets.includes("KOSPI") && (
                <div className="researchbox-sector-section">
                  <div className="researchbox-sector-header">KOSPI</div>
                  <div className="researchbox-sectors">
                    {kospiSectors.map((sector, index) => (
                      <button
                        key={`kospi-${index}`}
                        className={`researchbox-sector-button ${
                          selectedKospiSectors.includes(sector)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleKospiSectorChange(sector)}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedMarkets.includes("KOSDAQ") && (
                <div className="researchbox-sector-section">
                  <div className="researchbox-sector-header">KOSDAQ</div>
                  <div className="researchbox-sectors">
                    {kosdaqSectors.map((sector, index) => (
                      <button
                        key={`kosdaq-${index}`}
                        className={`researchbox-sector-button ${
                          selectedKosdaqSectors.includes(sector)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleKosdaqSectorChange(sector)}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="researchbox-button-container">
              <button
                onClick={handlePrevious}
                className="researchbox-button"
                style={{ marginLeft: "200px" }}
              >
                이전으로
              </button>
              <button
                onClick={handleNext}
                className="researchbox-button"
                style={{ marginRight: "200px" }}
              >
                다음으로
              </button>
            </div>
          </>
        );
      case 3:
        // 지표 선택 단계
        return (
          <>
            <div className="researchbox-header">
              분석에 활용할 지표를 선택해 주세요
            </div>
            <div className="researchbox-recommendation-container">
              <div className="researchbox-recommendations">
                {recommendedCombinations.map((combo) => (
                  <CustomTooltip
                    key={combo.id}
                    title={combo.reason}
                    arrow
                    placement="top"
                  >
                    <button
                      className="researchbox-recommendation-button"
                      onClick={() => handleRecommendedCombination(combo)}
                    >
                      {combo.name}
                    </button>
                  </CustomTooltip>
                ))}
              </div>
            </div>
            <div
              className="researchbox-sectors-container"
              style={{ height: "400px" }}
            >
              <div className="researchbox-sector-section">
                <div className="researchbox-sector-header">지표 목록</div>
                <div className="researchbox-sectors">
                  {sortedIndicators.map((indicator, index) => (
                    <CustomTooltip
                      key={index}
                      title={indicator.description}
                      arrow
                      placement="top"
                    >
                      <button
                        className={`researchbox-sector-button ${
                          selectedIndicators.includes(indicator.name)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleIndicatorChange(indicator.name)}
                      >
                        {indicator.displayName}
                      </button>
                    </CustomTooltip>
                  ))}
                </div>
              </div>
            </div>
            <div className="researchbox-button-container">
              <button
                onClick={handlePrevious}
                className="researchbox-button"
                style={{ marginLeft: "200px" }}
              >
                이전으로
              </button>
              <button
                onClick={handleNext}
                className="researchbox-button"
                style={{ marginRight: "200px" }}
              >
                결과보기
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Custom Stepper */}
      <Box sx={{ width: "100%", marginTop: "100px", marginBottom: "100px" }}>
        <Stepper
          activeStep={stepState - 1}
          alternativeLabel
          connector={<CustomStepConnector />} // Apply the custom connector
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepIcon-root": {
                    fontSize: "30px", // 아이콘 크기 설정
                  },
                  "& .Mui-active .MuiStepIcon-root": {
                    color: "#009178", // 활성화된 Step 아이콘의 색상
                  },
                  "& .Mui-completed .MuiStepIcon-root": {
                    color: "#009178", // 완료된 Step 아이콘의 색상
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <div className="researchbox-content-box">{renderStepContent()}</div>

      {/* AI Model Confirmation Modal */}
      <Modal
        open={isAIModalOpen}
        onClose={handleAIModalClose}
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
        disableEnforceFocus
      >
        <div
          className="researchbox-modal"
          style={{
            position: "fixed", // Changed from absolute to fixed for consistent centering
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.98)", // Similar to help-modal
            padding: "30px",
            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.3)",
            border: "2px solid #00796b",
            borderRadius: "16px",
            width: "600px",
            maxHeight: "80vh",
            overflow: "auto",
            opacity: "1", // Ensure it's visible; adjust if using animations
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <h2 id="ai-modal-title">AI 모델을 반영하시겠습니까?</h2>
          <div className="researchbox-modal-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAIModalConfirm}
              style={{
                width: "80px",
                height: "40px",
                backgroundColor: "#009178",
                color: "#fff",
              }}
            >
              예
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAIModalClose}
              style={{
                width: "80px",
                height: "40px",
                backgroundColor: "#d32f2f",
                color: "#fff",
              }}
            >
              아니오
            </Button>
          </div>
        </div>
      </Modal>

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
