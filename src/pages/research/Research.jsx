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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Research = () => {
  const sectors = [
    // 업종 리스트
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

  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [recommendations, setRecommendations] = useState({ buy: [], sell: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = () => {
    if (selectedIndicators.length === 0 || selectedSectors.length === 0) {
      setError("업종 및 지표를 선택해주세요.");
      return;
    }

    setLoading(true);
    fetch("http://localhost:5002/api/get_recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        indicators: selectedIndicators,
        selected_sectors: selectedSectors, // 선택된 업종 정보 추가
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
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Paper style={{ padding: "2rem", maxWidth: "800px", margin: "2rem auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        주식 추천 시스템
      </Typography>
      <Typography variant="h6" gutterBottom>
        업종을 선택하세요:
      </Typography>
      <FormGroup>
        <Grid container spacing={2}>
          {sectors.map((sector, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
      </FormGroup>

      <Typography variant="h6" gutterBottom style={{ marginTop: "1rem" }}>
        기술 지표를 선택하세요:
      </Typography>
      <FormGroup>
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

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          추천 종목 보기
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <CircularProgress />
        </div>
      )}

      {recommendations.buy.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <Typography variant="h6" gutterBottom>
            매수 추천 종목 상위 5개:
          </Typography>
          <List>
            {recommendations.buy.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={item} // 종목명만 표시
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}

      {recommendations.sell.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <Typography variant="h6" gutterBottom>
            매도 추천 종목 상위 5개:
          </Typography>
          <List>
            {recommendations.sell.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={item} // 종목명만 표시
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}

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

export default Research;
