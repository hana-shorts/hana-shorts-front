import React, { useEffect, useState } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  ChartCanvas,
  Chart,
  XAxis,
  YAxis,
  CandlestickSeries,
  BarSeries,
  LineSeries,
  CurrentCoordinate,
  EdgeIndicator,
  MovingAverageTooltip,
  OHLCTooltip,
  CrossHairCursor,
  ZoomButtons,
  discontinuousTimeScaleProviderBuilder,
  ema,
  withDeviceRatio,
  lastVisibleItemBasedZoomAnchor,
} from "react-financial-charts";
import CircularProgress from "@mui/material/CircularProgress"; // MUI 로딩 스피너 임포트

// 스타일링 요소들
const axisStyles = {
  strokeStyle: "#383E55", // Gray color for axes
  strokeWidth: 2,
  tickLabelFill: "#000000", // Black color for tick labels
  tickStrokeStyle: "#383E55",
};

const crossHairStyles = {
  strokeStyle: "#9EAAC7",
};

const zoomButtonStyles = {
  fill: "#383E55",
  fillOpacity: 0.75,
  strokeWidth: 0,
  textFill: "#9EAAC7",
};

const StockChart = ({ stockCode }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    if (stockCode) {
      setLoading(true);
      fetch(`http://localhost:5002/api/chart?code=${stockCode}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedChartData = prepareData(data);
          setChartData(formattedChartData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching chart data:", error);
          setLoading(false);
        });
    }
  }, [stockCode, resetCount]);

  const prepareData = (data) => {
    return data.map((item) => ({
      date: new Date(item.date),
      open: item.시가,
      high: item.고가,
      low: item.저가,
      close: item.종가,
      volume: item.거래량,
    }));
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
        }}
      >
        <CircularProgress size={60} thickness={1.5} />
      </div>
    );
  }

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d, c) => {
      d.ema12 = c;
    })
    .accessor((d) => d.ema12);

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d, c) => {
      d.ema26 = c;
    })
    .accessor((d) => d.ema26);

  const calculatedData = ema26(ema12(chartData));
  const scaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => d.date);
  const { data, xScale, xAccessor, displayXAccessor } =
    scaleProvider(calculatedData);

  const pricesDisplayFormat = format(".0f"); // 소수점 없는 가격 표시
  const volumeDisplayFormat = format(".1s"); // 거래량 k 단위로 소수점 첫째 자리까지 표시
  const dateTimeFormat = "%Y-%m-%d";
  const timeDisplayFormat = timeFormat(dateTimeFormat);

  // 봉 색깔 설정 함수
  const openCloseColor = (d) => (d.close > d.open ? "#c84a31" : "#0062df");

  // 최근 6개월치 데이터를 표시하도록 xExtents를 설정하되, 오른쪽에 여유 공간 추가
  const endDate = xAccessor(data[data.length - 1]);
  // const extraSpace = Math.ceil((data.length - 1) * 0.05); // 데이터의 5% 정도를 여유 공간으로 추가
  const xExtents = [
    xAccessor(data[Math.max(0, data.length - 130)]),
    endDate + 20,
  ];

  const handleResetZoom = () => {
    setResetCount((prev) => prev + 1);
  };

  return (
    <div className="stockinfo-chart-wrapper">
      <ChartCanvas
        height={500} // 전체 캔버스 높이 설정
        width={1097} // 전체 캔버스 너비 설정
        ratio={window.devicePixelRatio || 1} // 디바이스 픽셀 비율 설정
        margin={{ left: 5, right: 51, top: 0, bottom: 30 }} // 여백 설정
        seriesName={`Stock Chart ${resetCount}`}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
      >
        {/* Candlestick Chart */}
        <Chart
          id={1}
          yExtents={(d) => [d.high, d.low]}
          height={350} // 가로 세로 비율 조정
          origin={[0, 0]}
        >
          <XAxis {...axisStyles} tickFormat={timeDisplayFormat} />
          <YAxis {...axisStyles} tickFormat={pricesDisplayFormat} />
          <CandlestickSeries
            fill={openCloseColor}
            stroke={openCloseColor}
            wickStroke={openCloseColor}
          />
          <LineSeries
            yAccessor={ema26.accessor()}
            strokeStyle={ema26.stroke()}
          />
          <LineSeries
            yAccessor={ema12.accessor()}
            strokeStyle={ema12.stroke()}
          />
          {ema26 && (
            <CurrentCoordinate
              yAccessor={ema26.accessor()}
              fillStyle={ema26.stroke()}
            />
          )}
          {ema12 && (
            <CurrentCoordinate
              yAccessor={ema12.accessor()}
              fillStyle={ema12.stroke()}
            />
          )}
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.close}
            fill={openCloseColor}
            displayFormat={pricesDisplayFormat}
          />
          <MovingAverageTooltip
            origin={[8, 15]}
            options={[
              {
                yAccessor: ema26.accessor(),
                type: "EMA",
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize,
              },
              {
                yAccessor: ema12.accessor(),
                type: "EMA",
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize,
              },
            ]}
          />
          <OHLCTooltip origin={[8, 15]} />
          <ZoomButtons onReset={handleResetZoom} {...zoomButtonStyles} />
        </Chart>

        {/* Volume Chart */}
        <Chart
          id={2}
          height={100} // 가로 세로 비율 조정
          yExtents={(d) => d.volume}
          origin={(w, h) => [0, 350]} // Y축 위치 조정
        >
          <XAxis {...axisStyles} tickFormat={timeDisplayFormat} />
          <YAxis {...axisStyles} tickFormat={volumeDisplayFormat} />
          <BarSeries
            yAccessor={(d) => d.volume}
            fillStyle={(d) => (d.close > d.open ? "#c84a31" : "#0062df")}
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.volume}
            fill={openCloseColor}
            displayFormat={volumeDisplayFormat}
          />
        </Chart>
        <CrossHairCursor {...crossHairStyles} />
      </ChartCanvas>
    </div>
  );
};

// 성능 최적화를 위해 withDeviceRatio HOC 적용
export default withDeviceRatio()(StockChart);
