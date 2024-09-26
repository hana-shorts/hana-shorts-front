// components/research/ResearchBox.jsx
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import "./ResearchBox.css"; // 별도의 CSS 파일 분리

const ResearchBox = () => {
  const steps = ["시장 선택", "업종 선택", "지표 선택", "결과"]; // Stepper 단계

  const markets = ["KOSPI", "KOSDAQ"]; // 시장 리스트

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

  const kosdaqSectors = [
    // 임의로 작성한 KOSDAQ 업종 리스트 (추후 업데이트 예정)
    "IT 서비스",
    "바이오 헬스",
    "게임",
    "바이오연구개발",
    "제조업",
  ];

  const indicators = [
    "Moving Average (MA)",
    "Relative Strength Index (RSI)",
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
  const [step, setStep] = useState(0); // 0: 시작 화면, 1: 시장 선택, 2: 업종 선택, 3: 지표 선택, 4: 결과

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

  const handleStart = () => {
    setStep(1);
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
    setStep(0);
  };

  const handleCloseError = () => {
    setError(null);
  };

  // 업종 섹션 컴포넌트
  const SectorSection = ({ market, sectors }) => (
    <div className="research-box-sector-section">
      <Typography variant="subtitle1" gutterBottom className="sector-header">
        {market} 업종:
      </Typography>
      <Grid container spacing={2}>
        {sectors.map((sector, index) => (
          <Grid item xs={12} sm={6} md={4} key={`${market}-${index}`}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedSectors.includes(sector)}
                  onChange={() => handleSectorChange(sector)}
                />
              }
              label={sector}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );

  // 단계에 따른 내용 렌더링
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Button variant="contained" color="primary" onClick={handleStart}>
            시작하기
          </Button>
        );
      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              시장을 선택하세요:
            </Typography>
            <FormGroup className="research-box-step-content">
              <Grid container spacing={2}>
                {markets.map((market, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedMarkets.includes(market)}
                          onChange={() => handleMarketChange(market)}
                        />
                      }
                      label={market}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
            <div className="research-box-button-container">
              <Button variant="contained" color="primary" onClick={handleNext}>
                다음으로
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              업종을 선택하세요:
            </Typography>
            <FormGroup className="research-box-step-content">
              {selectedMarkets.map((market) => {
                const sectorsToDisplay =
                  market === "KOSPI" ? kospiSectors : kosdaqSectors;
                return (
                  <SectorSection
                    key={market}
                    market={market}
                    sectors={sectorsToDisplay}
                  />
                );
              })}
            </FormGroup>
            <div className="research-box-button-container">
              <Button variant="contained" color="primary" onClick={handleNext}>
                다음으로
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              기술 지표를 선택하세요:
            </Typography>
            <FormGroup className="research-box-step-content">
              <Grid container spacing={2}>
                {indicators.map((indicator, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedIndicators.includes(indicator)}
                          onChange={() => handleIndicatorChange(indicator)}
                        />
                      }
                      label={indicator}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
            <div className="research-box-button-container">
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
              <div className="research-box-loading-container">
                <CircularProgress />
              </div>
            )}
          </>
        );
      case 4:
        return (
          <>
            {loading ? (
              <div className="research-box-loading-container">
                <CircularProgress />
              </div>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  매수 추천 종목 상위 5개:
                </Typography>
                <Grid
                  container
                  spacing={2}
                  className="research-box-recommendations-container"
                >
                  {recommendations.buy.slice(0, 5).map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={2.4}
                      key={`buy-${index}`}
                    >
                      <Card className="research-box-recommendation-card">
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="div"
                            className="research-box-rank"
                          >
                            #{index + 1}
                          </Typography>
                          <Typography
                            variant="body1"
                            className="research-box-stock-name"
                          >
                            {item}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h6" gutterBottom>
                  매도 추천 종목 상위 5개:
                </Typography>
                <Grid
                  container
                  spacing={2}
                  className="research-box-recommendations-container"
                >
                  {recommendations.sell.slice(0, 5).map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={2.4}
                      key={`sell-${index}`}
                    >
                      <Card className="research-box-recommendation-card">
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="div"
                            className="research-box-rank"
                          >
                            #{index + 1}
                          </Typography>
                          <Typography
                            variant="body1"
                            className="research-box-stock-name"
                          >
                            {item}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <div className="research-box-button-container">
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
    <Paper className="research-box-large-box" elevation={3}>
      {/* MUI Stepper */}
      {step > 0 && (
        <Stepper activeStep={step - 1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      <div className="research-box-content-box">{renderStepContent()}</div>

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
    </Paper>
  );
};

export default ResearchBox;
