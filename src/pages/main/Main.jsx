import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css"; // Swiper CSS 가져오기
import ArticleList from "../../components/article/ArticleList";
import Ticker from "../../components/main/Ticker"; // 방금 만든 Ticker 컴포넌트를 임포트
import { Link } from "react-router-dom";
import "./Main.css";

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [buttonText, setButtonText] = useState({
    line1: "",
    line2: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const swiperRef = useRef(null); // Swiper 인스턴스를 참조하기 위한 ref

  const latestNews = [
    {
      id: 1,
      title: '암호화폐 교육 전문가 "알트코인 시즌 절대 없을 수도" 비관론 제시',
      date: "2024년 8월 14일 수요일",
      time: "00:30",
    },
    {
      id: 2,
      title:
        "비트코인 $20억 보유 지갑 테스트 전송 실시 ... 비트코인 마운트곡스 채권 배분 준비 추정",
      date: "2024년 8월 14일 수요일",
      time: "00:24",
    },
    {
      id: 3,
      title: '美 민주당 유권자 54% "암호화폐 투자 전혀 생각 없다"',
      date: "2024년 8월 14일 수요일",
      time: "00:05",
    },
    {
      id: 4,
      title: "플랜 B “비트코인 2024-2028 평균 50만 달러”",
      date: "2024년 8월 11일 일요일",
      time: "14:12",
    },
    {
      id: 5,
      title: '美 민주당 유권자 54% "암호화폐 투자 전혀 생각 없다"',
      date: "2024년 8월 14일 수요일",
      time: "00:05",
    },
    {
      id: 6,
      title: "스테이블코인 PYUSD, 솔라나가 이더리움 공급량 추월",
      date: "2024년 8월 14일 수요일",
      time: "00:03",
    },
    {
      id: 7,
      title: "거래소 스테이블코인 비율 하락 ... 비트코인 매도 압력 완화 시사",
      date: "2024년 8월 13일 화요일",
      time: "23:59",
    },
    {
      id: 8,
      title:
        "엘살바도르, 16억 달러 투자로 ‘비트코인 시티’ 개발 가속화...암호화폐 커뮤니티 환영",
      date: "2024년 8월 13일 화요일",
      time: "23:30",
    },
  ];

  useEffect(() => {
    const buttonTexts = [
      { line1: "Welcome! 하나증권", line2: "거래 시작하기", link: "/trading" },
      { line1: "하나증권이 제안하는", line2: "리서치센터", link: "/research" },
      { line1: "마켓 트렌드를 주도하는", line2: "투자정보", link: "/market" },
    ];

    // 애니메이션 시작
    setIsAnimating(true);

    // 500ms 후 텍스트 변경
    setTimeout(() => {
      setButtonText(buttonTexts[currentSlide]);
      setIsAnimating(false); // 애니메이션 종료
    }, 500); // 애니메이션 시간과 일치
  }, [currentSlide]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.start();

      // 페이지가 로드된 후 첫 슬라이드를 넘어가게 합니다.
      setTimeout(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.slideNext();
        }
      }, 5000); // 5초 후 첫 슬라이드 넘김
    }
  }, []);

  return (
    <div className="main-page">
      <div className="main-content">
        <div className="main-banner">
          <div className="main-banner-swiper">
            <Swiper
              ref={swiperRef} // Swiper 인스턴스를 참조
              modules={[Autoplay]} // Autoplay 모듈 추가
              spaceBetween={0}
              slidesPerView={1}
              loop={true} // 무한 루프
              autoplay={{ delay: 5000, disableOnInteraction: false }} // 5초마다 자동으로 슬라이드
              pagination={{ clickable: true }} // 페이지네이션을 점 모양으로 설정
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)} // 슬라이드 변경 시 currentSlide 상태 업데이트
            >
              <SwiperSlide>
                <img
                  src={require("../../assets/images/banner_1.png")}
                  alt="Banner 1"
                  className="main-banner-image"
                />
                <div className="main-banner-title">
                  보다 더 당신의 <br /> 일상과 가깝게
                </div>
                <div className="main-banner-text">
                  올바름, <br /> 우리의 최우선 가치입니다.
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={require("../../assets/images/banner_2.png")}
                  alt="Banner 2"
                  className="main-banner-image"
                />
                <div className="main-banner-title">
                  하나증권과 <br /> 가까워지다
                </div>
                <div className="main-banner-text">
                  전문적인, <br /> 안전한 투자를 제안합니다.
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={require("../../assets/images/banner_3.png")}
                  alt="Banner 3"
                  className="main-banner-image"
                />
                <div className="main-banner-title">
                  하나증권에서 <br /> 경험하다
                </div>
                <div className="main-banner-text">
                  한결같은, <br /> 오랫동안 쌓아온 신뢰를 제공합니다.
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <Link
            to={buttonText.link}
            className={`main-banner-button ${isAnimating ? "animating" : ""}`}
          >
            <div className="main-banner-button-line1">{buttonText.line1}</div>
            <div className="main-banner-button-line2">{buttonText.line2}</div>
            <div className="main-banner-button-line3">→</div>
          </Link>
        </div>
        <div className="main-breaking-news-container">
          <div className="main-event-wrapper">
            <Link to="/article" className="main-breaking-news-title">
              최신 뉴스 ＞
            </Link>
          </div>
          <div className="main-news-list-container">
            <ArticleList
              articleList={latestNews}
              customClassName="main-news-list"
            />
          </div>
        </div>
      </div>
      <div className="main-ticker-container">
        <Ticker /> {/* Ticker 컴포넌트를 배너 아래에 추가 */}
      </div>
    </div>
  );
};

export default Main;
