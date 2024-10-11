import React from "react";
import "./Footer.css";

import youtubeIcon from "../assets/images/youtube.png";
import facebookIcon from "../assets/images/facebook.png";
import instagramIcon from "../assets/images/instagram.png";
import hanashortsIcon from "../assets/images/hanahome.svg";

import hanatiIcon from "../assets/images/hanati.png";

const Footer = () => {
  return (
    <div style={{marginTop : "100px"}}>
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-guide-group">
          <div className="footer-link-list">
            <div className="footer-link-item">개인정보처리방침</div>
            <div className="footer-link-item">신용정보활용체제</div>
            <div className="footer-link-item">고객정보취급방침</div>
            <div className="footer-link-item">하나맵</div>
          </div>

          <div className="footer-sns">
            <ul>
              <li>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={youtubeIcon} alt="유튜브" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={instagramIcon} alt="인스타그램" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={facebookIcon} alt="페이스북" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <img
              src={hanashortsIcon}
              alt="Hana 금융그룹 로고"
              className="footer-logo"
            />
            <p>경기도 광명시 철산동 220-1 &nbsp; 02.2139.4800</p>
            <p>Copyright ⓒ 2024 HANA FINANCIAL GROUP. All rights Reserved.</p>
          </div>
          <img
            src={hanatiIcon}
            alt="WA 로고"
            className="wa-logo"
          />
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
