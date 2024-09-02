import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const messages = [
    "1 트럼프-머스크 대담서 암호...",
    "2 해리스-암호화폐 업계 원탁...",
    "3 디파이 도미넌스 3년래 최저",
    "4 코인베이스 G 상장",
    "5 마라톤디지털 $2.5억 채권...",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true); // 애니메이션 시작
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setAnimate(false); // 애니메이션 끝
      }, 500); // 애니메이션 시간과 일치
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img
              src={require("../assets/images/hanahome.svg").default}
              alt="hanahome"
            />
          </Link>
          <div className="navbar-links">
            <Link to="/article">뉴스룸</Link>
            <Link to="/market">마켓</Link>
            <Link to="/trade">트레이딩</Link>
            <Link to="/research">리서치센터</Link>
          </div>
        </div>
        <div className="navbar-right">
          <button className="navbar-issue">이슈</button>
          <p className={`navbar-notice ${animate ? "navbar-slide-up" : ""}`}>
            {messages[currentIndex]}
          </p>
          <button className="navbar-benefit">혜택</button>
          {/* <div className="navbar-icons">
            <button className="navbar-search-icon">🔍</button>
            <button className="navbar-theme-icon">🌙</button>
          </div> */}
          <button className="navbar-login-button">로그인</button>
          <button className="navbar-signup-button">회원가입</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
