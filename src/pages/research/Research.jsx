// pages/research/Research.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResearchBox from '../../components/research/ResearchBox';
import ResearchAnalysis from '../../components/research/ResearchAnalysis';
import ResearchHanaTV from '../../components/research/ResearchHanaTV';
import './Research.css'; // 페이지 전용 CSS

const Research = () => {
  const navigate = useNavigate();
  const { tabName, videoId } = useParams(); // videoId 추출
  const [activeTab, setActiveTab] = useState(tabName || 'recommend');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef({}); // 각 탭의 ref를 저장

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'hanatv') {
      navigate(`/research/${tabName}`); // hanatv 탭 클릭 시 videoId 없이 이동
    } else {
      navigate(`/research/${tabName}`);
    }
  };

  useEffect(() => {
    // 활성화된 탭의 ref 가져오기
    const activeTabRef = tabsRef.current[activeTab];
    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;
      setIndicatorStyle({
        left: offsetLeft,
        width: clientWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="research-page fade-in-minus-y">
      <div className="research-header">
        <h1 className="research-title">리서치센터</h1>
        <div className="research-tabs">
          <button
            ref={(el) => (tabsRef.current['recommend'] = el)}
            className={activeTab === 'recommend' ? 'research-active' : ''}
            onClick={() => handleTabClick('recommend')}
          >
            <div>추천 서비스</div>
          </button>
          <button
            ref={(el) => (tabsRef.current['analysis'] = el)}
            className={activeTab === 'analysis' ? 'research-active' : ''}
            onClick={() => handleTabClick('analysis')}
          >
            <div>분석 데스크</div>
          </button>
          <button
            ref={(el) => (tabsRef.current['hanatv'] = el)}
            className={activeTab === 'hanatv' ? 'research-active' : ''}
            onClick={() => handleTabClick('hanatv')}
          >
            <div>하나 TV</div>
          </button>
          {/* 슬라이딩 인디케이터 */}
          <span
            className="research-tab-indicator"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          ></span>
        </div>
        <div style={{ width: '160px' }}></div>
      </div>
      <div className="researchbox-container">
        {activeTab === 'recommend' && <ResearchBox />}
        {activeTab === 'analysis' && <ResearchAnalysis />}
        {activeTab === 'hanatv' && <ResearchHanaTV videoId={videoId} />} {/* videoId 전달 */}
      </div>
    </div>
  );
};

export default Research;
