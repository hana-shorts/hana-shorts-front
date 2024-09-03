import React, { useState } from "react";
import "./Sector.css";

const sectors = [
  {
    name: "플랫폼 코인",
    description: "응용 서비스의 플랫폼 블록체인",
    coins: [
      "TON",
      "BNB",
      "SOL",
      "NEAR",
      "KLAY",
      "ALGO",
      "EOS",
      "XRP",
      "ETH",
      "DOT",
      "AVAX",
      "ADA",
      "SUI",
      "INJ",
      "ROSE",
      "WAVES",
      "FLR",
      "XCH",
      "ATOM",
      "CHR",
      "WEMIX",
      "GALAXIS",
      "SEI",
      "TIA",
    ],
  },
  {
    name: "레이어2",
    description: "블록체인 확장성 솔루션",
    coins: [
      "BOBA",
      "MNT",
      "TAIKO",
      "LRC",
      "CELR",
      "TON",
      "MATIC",
      "BLAST",
      "ZERO",
      "SKL",
      "SNX",
      "METIS",
      "MANTA",
      "MODE",
      "MYRIA",
      "MERL",
      "STRK",
      "ZK",
    ],
  },
  {
    name: "중국",
    description: "중국 관련 암호화폐",
    coins: [
      "SUN",
      "BCH",
      "TRX",
      "QKC",
      "JST",
      "ONG",
      "ACH",
      "NEO",
      "PHB",
      "BTT",
      "QTUM",
      "ONT",
      "CKB",
      "BSV",
      "COMBO",
      "VET",
      "GAS",
      "IRIS",
      "SC",
    ],
  },
  {
    name: "솔라나",
    description: "솔라나 생태계 암호화폐",
    coins: [
      "PONKE",
      "RAY",
      "JUP",
      "BONK",
      "POPCAT",
      "JTO",
      "MEW",
      "MYRO",
      "WIF",
      "KMO",
      "SRM",
      "ACS",
      "SLERF",
      "AUDIO",
      "PYTH",
      "ELIX",
      "MNDE",
      "FOXY",
      "BOME",
      "ZBCN",
      "NYAN",
      "HONY",
      "MOBILE",
      "ORCA",
      "ZEUS",
      "TNSR",
      "SHDW",
      "SAROS",
      "SHARK",
      "MXM",
      "GUMMY",
    ],
  },
];

const performanceData = {
  "1일": ["+1.23%", "+2.34%", "+0.56%", "+3.45%"],
  "1주일": ["+5.67%", "+10.12%", "+2.98%", "+7.89%"],
  "1개월": ["+12.45%", "+20.34%", "+6.78%", "+15.23%"],
  "3개월": ["+20.12%", "+30.45%", "+10.67%", "+25.89%"],
  "6개월": ["+31.30%", "+63.17%", "+28.00%", "+40.49%"],
};

const Sector = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1일");

  const sectorsWithPerformance = sectors.map((sector, index) => ({
    ...sector,
    performance: performanceData[selectedPeriod][index],
  }));

  // 섹터를 성과 기준으로 정렬
  const sortedSectors = sectorsWithPerformance.sort(
    (a, b) =>
      parseFloat(b.performance.replace("%", "")) -
      parseFloat(a.performance.replace("%", ""))
  );

  return (
    <div className="sector-container">
      <div className="sector-tabs">
        {["1일", "1주일", "1개월", "3개월", "6개월"].map((period) => (
          <button
            key={period}
            className={selectedPeriod === period ? "sector-active" : ""}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>
      {sortedSectors.map((sector, index) => (
        <div className="sector-item" key={index}>
          <div className="sector-header">
            <div className="sector-title">
              <div className="sector-icon"></div> {/* 아이콘 자리 */}
              <div>
                <h3>{sector.name}</h3>
                <p>{sector.description}</p>
              </div>
            </div>
            <div className="sector-performance">{sector.performance}</div>
          </div>
          <div className="sector-coins">
            {sector.coins.map((coin, i) => (
              <div className="sector-coin-item" key={i}>
                {coin}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sector;
