import React, { useEffect, useRef, memo } from "react";

const TradingViewWidget = () => {
  const container = useRef();

  useEffect(() => {
    // 스크립트가 이미 추가된 경우 중복 추가하지 않도록 조건 설정
    if (!container.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
          {
            "autosize": true,
            "symbol": "NASDAQ:IXIC",
            "interval": "1",
            "timezone": "Asia/Seoul",
            "theme": "light",
            "style": "3",
            "locale": "kr",
            "withdateranges": true,
            "hide_side_toolbar": false,
            "allow_symbol_change": false,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
          }`;
      // 자식 요소가 중복되지 않도록 초기화 (필요 시 적용)
      container.current.innerHTML = "";
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </div>
  );
};

export default memo(TradingViewWidget);
