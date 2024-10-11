import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/privacy">개인정보처리방침</a>
        <a href="/credit">신용정보활용체제</a>
        <a href="/customer">고객정보취급방침</a>
        <a href="/map">하나맵</a>
      </div>
      <div className="footer-info">
        <div className="footer-logo">
          <img src="/path-to-your-logo.png" alt="하나금융그룹 로고" />
        </div>
        <div className="footer-address">
          <p>서울특별시 중구 을지로 66 &nbsp;&nbsp;&nbsp;&nbsp; 02.2002.1110</p>
          <p>Copyright ⓒ 2022 HANA FINANCIAL GROUP. All rights Reserved.</p>
        </div>
        <div className="footer-badges">
          <img src="/path-to-wa-badge.png" alt="WA 인증 마크" />
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
