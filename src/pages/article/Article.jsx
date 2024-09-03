import React, { useState } from "react";
import ArticleList from "../../components/article/ArticleList";
import "./Article.css";

const Article = () => {
  const [selectedTab, setSelectedTab] = useState("latest");

  const latestNews = [
    {
      id: 1,
      title: '암호화폐 교육 전문가 "알트코인 시즌 절대 없을 수도" 비관론 제시',
      date: "2024년 8월 14일 수요일",
      time: "00:30",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 2,
      title:
        "비트코인 $20억 보유 지갑 테스트 전송 실시 ... 비트코인 마운트곡스 채권 배분 준비 추정",
      date: "2024년 8월 14일 수요일",
      time: "00:24",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 3,
      title: '美 민주당 유권자 54% "암호화폐 투자 전혀 생각 없다"',
      date: "2024년 8월 14일 수요일",
      time: "00:05",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 4,
      title: "플랜 B “비트코인 2024-2028 평균 50만 달러”",
      date: "2024년 8월 11일 일요일",
      time: "14:12",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 5,
      title: '美 민주당 유권자 54% "암호화폐 투자 전혀 생각 없다"',
      date: "2024년 8월 14일 수요일",
      time: "00:05",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image1.jpg",
    },
    {
      id: 6,
      title: "스테이블코인 PYUSD, 솔라나가 이더리움 공급량 추월",
      date: "2024년 8월 14일 수요일",
      time: "00:03",
      description:
        "페이팔 홀딩스의 미국 달러 연동 스테이블코인 PYUSD가 솔라나 블록체인에서 이더리움보다 많은 공급량을 기록했...",
      img: "path/to/image2.jpg",
    },
    {
      id: 7,
      title: "거래소 스테이블코인 비율 하락 ... 비트코인 매도 압력 완화 시사",
      date: "2024년 8월 13일 화요일",
      time: "23:59",
      description:
        "거래소 스테이블코인 비율(exchange stablecoins ratio)이 하락 추세를 이어가며 비트코인에 대한 매도 압력 감소를 시사...",
      img: "path/to/image3.jpg",
    },
    {
      id: 8,
      title:
        "엘살바도르, 16억 달러 투자로 ‘비트코인 시티’ 개발 가속화...암호화폐 커뮤니티 환영",
      date: "2024년 8월 13일 화요일",
      time: "23:30",
      description:
        "RadarHits제이엘살바도르는 최근 ‘비트코인시티’(BitcoinCity) 개발을 위한 16억달러의 투자 발표했다...",
      img: "path/to/image4.jpg",
    },
  ];

  const popularNews = [
    {
      id: 9,
      title:
        "리플(XRP), 2017년 불장 재현하며 80달러까지 상승할 수도... 법적 승리 후 시장 기대감 고조",
      date: "2024년 8월 12일 월요일",
      time: "02:30",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 10,
      title:
        '도지코인 게임 다가오고 있다…”시바이누 설립자 "SHIB, DOGE 넘어설 것" 찬물',
      date: "2024년 8월 12일 월요일",
      time: "01:30",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 11,
      title:
        "리플, 스테이블코인 RLUSD 베타 테스트 시작... SEC 소송 승리 이후 XRP 26% 급등",
      date: "2024년 8월 12일 월요일",
      time: "11:35",
      description:
        "디지털투데이 김예솔 기자 미국 민주당 유권자들을 대상으로 한 여론 조사 결과가 공개됐다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 12,
      title: "리플(XRP), 골든크로스 발생 가능성 ↑ ... 2017년 불장 재현할까?",
      date: "2024년 8월 12일 월요일",
      time: "12:30",
      description:
        "리플(XRP)이 최근 미국 증권거래위원회(SEC)와의 법적 분쟁을 마무리하면서 XRP 가격 전망에 관심이 집중되고 있다...",
      img: "path/to/image5.jpg",
    },
    {
      id: 13,
      title: '"꿀잠 보장" 일본 머스크, 트럼프와 생방송...가상자산 논의하나',
      date: "2024년 8월 12일 월요일",
      time: "17:46",
      description:
        "한국 시간 13일 오전 10시, X 스페이스에서 진행될 트럼프 자녀들 ‘디파이 사랑해’ 기대감 부추겨...",
      img: "path/to/image6.jpg",
    },
    {
      id: 14,
      title: "[블록체인 칼럼]리플과 SEC 소송",
      date: "2024년 8월 13일 화요일",
      time: "16:00",
      description:
        "2024년 7월, 리플(Ripple)과 미국 증권거래위원회(SEC) 간 소송이 마침내 종결됐다. 이 사건은 가상자산 업계 전체에 큰...",
      img: "path/to/image7.jpg",
    },
    {
      id: 15,
      title: "비트코인, 최대 86% 폭발적 상승 가능성 – 데일리호들",
      date: "2024년 8월 11일 일요일",
      time: "07:38",
      description:
        "암호화폐 트레이더 케빈 스벤슨은 최근 시장 전반의 하락 이후 비트코인(BTC)이 약 10만 달러에 이를 가능성이...",
      img: "path/to/image8.jpg",
    },
    {
      id: 16,
      title: "리플(XRP), 골든크로스 발생 가능성 ↑ ... 2017년 불장 재현할까?",
      date: "2024년 8월 12일 월요일",
      time: "12:30",
      description:
        "리플(XRP)이 최근 미국 증권거래위원회(SEC)와의 법적 분쟁을 마무리하면서 XRP 가격 전망에 관심이 집중되고 있다...",
      img: "path/to/image5.jpg",
    },
  ];

  const articleList = selectedTab === "latest" ? latestNews : popularNews;

  return (
    <div className="article-page">
      <h1 className="article-title">뉴스룸</h1>
      <div className="article-tabs">
        <button
          onClick={() => setSelectedTab("latest")}
          className={selectedTab === "latest" ? "article-active" : ""}
        >
          최신 뉴스
        </button>
        <button
          onClick={() => setSelectedTab("popular")}
          className={selectedTab === "popular" ? "article-active" : ""}
        >
          많이 본 뉴스
        </button>
      </div>

      <ArticleList articleList={articleList} />
      <button className="article-load-more-button">더보기</button>
    </div>
  );
};

export default Article;
