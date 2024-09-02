import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-guide-group">
          <ul className="footer-link-list">
            <li>
              <a
                href="http://openhanafn.ttmap.co.kr/content_dt.jsp"
                target="_blank"
                rel="noopener noreferrer"
              >
                영업점안내
              </a>
            </li>
            <li>
              <a href="/main/customer/customer/CS_100403_P.cmd">
                전자금융거래 이용자 유의사항
              </a>
            </li>
            <li>
              <a href="/main/customer/customer/CS_070100_P.cmd">이용약관</a>
            </li>
            <li>
              <a
                href="/main/customer/customer/CS_070300.cmd"
                className="footer-bold-link"
              >
                개인정보처리방침
              </a>
            </li>
            <li>
              <a href="/main/customer/persnalInfo/CS_170200_P.cmd?tabIndex=0">
                개인(신용)정보 열람 및 이용·제공 현황 조회
              </a>
            </li>
            <li>
              <a href="/main/customer/persnalInfo/CS_170200_P.cmd?tabIndex=1">
                그룹사간 고객정보 제공내역 조회
              </a>
            </li>
            <li>
              <a href="/main/customer/customer/CS_070200.cmd?page=3">
                보호금융상품등록부
              </a>
            </li>
            <li>
              <a href="/main/customer/customer/CS_070200.cmd?page=5">
                신용정보활용체제
              </a>
            </li>
            <li>
              <a
                href="http://dis.kofia.or.kr/fs/dis2/com/COMOutItemAnn.jsp?certifyKey=56b5dcf368687fc83006dbd912ef0320168-7b7e"
                target="_blank"
                rel="noopener noreferrer"
              >
                상품공시실
              </a>
            </li>
            <li>
              <a href="/main/customer/qna/CS_080504_S1.cmd">전자민원접수</a>
            </li>
            <li>
              <a href="/main/company/company/CO_010501_P.cmd">
                스튜어드십 코드
              </a>
            </li>
          </ul>

          <div className="footer-familysite">
            <div className="footer-sbox">
              <a
                href="http://www.hanafn.com"
                className="footer-familysite-opener"
              >
                하나네트워크
              </a>
            </div>
            <ul className="footer-familysite-list">
              <li>
                <a
                  href="http://www.hanafn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나금융그룹
                </a>
              </li>
              <li>
                <a
                  href="https://www.kebhana.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나은행
                </a>
              </li>
              <li>
                <a
                  href="https://www.hanaw.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나증권
                </a>
              </li>
              <li>
                <a
                  href="https://www.hanacard.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나카드
                </a>
              </li>
              <li>
                <a
                  href="https://www.hanacapital.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나캐피탈
                </a>
              </li>
              <li>
                <a
                  href="https://www.hanalife.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나생명
                </a>
              </li>
              <li>
                <a
                  href="https://www.hanasavings.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나저축은행
                </a>
              </li>
              <li>
                <a
                  href="http://www.hanatrust.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나자산신탁
                </a>
              </li>
              <li>
                <a
                  href="https://hana-aamc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나대체투자자산운용
                </a>
              </li>
              <li>
                <a
                  href="http://www.hanais.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나펀드서비스
                </a>
              </li>
              <li>
                <a
                  href="https://www.hanati.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나금융티아이
                </a>
              </li>
              <li>
                <a
                  href="https://www.finnq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  핀크
                </a>
              </li>
              <li>
                <a
                  href="http://www.hana-nanum.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나금융나눔재단
                </a>
              </li>
              <li>
                <a
                  href="http://www.hanafoundation.or.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나금융공익재단
                </a>
              </li>
              <li>
                <a
                  href="http://www.hanacarecenter.or.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나케어센터
                </a>
              </li>
              <li>
                <a
                  href="http://www.hanamiso.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나미소금융재단
                </a>
              </li>
              <li>
                <a
                  href="http://www.hana.hs.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  하나고등학교
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-sns">
            <ul>
              <li>
                <a
                  href="https://www.facebook.com/hanadtpage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/templets/main/img/icon_facebook.gif"
                    alt="페이스북"
                  />
                </a>
              </li>
              <li>
                <a
                  href="http://blog.naver.com/hanadtsec"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/templets/main/img/icon_blog.gif" alt="블로그" />
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-cscenter">
            <p>
              하나증권 고객지원센터 1588-3111 | 프라임케어실 투자상담
              02-785-5000
              <br />
              해외선물 02-785-7111(24시간) | 해외주식 02-3771-3771(24시간)
            </p>
            <a
              href="http://www.hanafn.com/main.do"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/templets/main/img/FP/blank.gif"
                alt="하나금융그룹 행복한 금융"
              />
            </a>
          </div>

          <div className="footer-copyright">
            <p>
              서울특별시 영등포구 의사당대로 82(여의도동) | 사업자등록번호 :
              116-81-05992
              <br />
              Copyright ⓒ 2014 Hana Securities Co.,Ltd. All Rights Reserved.
            </p>
            <img src="/templets/main/img/copyright.gif?ver20220630" alt="" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
