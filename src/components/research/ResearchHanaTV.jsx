// src/components/research/ResearchHanaTV.jsx
import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import videoData from './videoData'; // videoData 파일에서 불러옴
import './ResearchHanaTV.css';

const ResearchHanaTV = ({ videoId }) => {
  // videoId prop 받기
  const navigate = useNavigate();

  // 초기 주제 설정
  const initialTopic = '리서치 모닝브리프';

  const [mainVideo, setMainVideo] = useState({
    id: videoId || videoData[initialTopic][0].id,
    title: videoId ? 'Loading...' : videoData[initialTopic][0].title, // 초기 타이틀 설정
  });
  const [currentTopic, setCurrentTopic] = useState(initialTopic);

  const opts = {
    height: '680',
    width: '1230',
    playerVars: {
      autoplay: 0,
    },
  };

  // 다른 주제 목록을 역순으로 정렬
  const otherTopics = Object.keys(videoData)
    .filter((topic) => topic !== currentTopic)
    .slice()
    .reverse(); // 역순 추가

  // 메인 영상 변경 함수
  const handleVideoClick = (video, topic) => {
    setMainVideo({ id: video.id, title: video.title });
    setCurrentTopic(topic);
    // URL 업데이트
    navigate(`/research/hanatv/${video.id}`);
  };

  // videoId prop이 변경될 때 메인 비디오 업데이트
  useEffect(() => {
    let foundVideo;
    let foundTopic = initialTopic;

    if (videoId) {
      const entry = Object.entries(videoData).find(([topic, videos]) => videos.find((v) => v.id === videoId));
      if (entry) {
        const [topic, videos] = entry;
        foundVideo = videos.find((v) => v.id === videoId);
        foundTopic = topic;
      }
    }

    if (foundVideo) {
      setMainVideo({ id: foundVideo.id, title: foundVideo.title });
      setCurrentTopic(foundTopic);
    } else {
      // videoId가 없거나 찾을 수 없을 때 초기 비디오로 설정
      const defaultVideo = videoData[initialTopic][0];
      setMainVideo({ id: defaultVideo.id, title: defaultVideo.title });
      setCurrentTopic(initialTopic);
    }
  }, [videoId, initialTopic]);

  return (
    <div className="research-hanatv">
      <div className="research-hanatv-main-content">
        <div className="research-hanatv-main-video">
          <YouTube videoId={mainVideo.id} opts={opts} />
          <h2>{mainVideo.title}</h2>
        </div>
        <div className="research-hanatv-related-videos">
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#009178',
              marginBottom: '20px',
            }}
          >
            관련 영상
          </div>
          {videoData[currentTopic]
            .slice() // 원본 배열을 변경하지 않기 위해 복사
            .reverse() // 역순으로 정렬
            .map((video, index) => (
              <div
                key={index}
                className="research-hanatv-related-video-item"
                onClick={() => handleVideoClick(video, currentTopic)}
              >
                <div className="research-hanatv-related-video-thumbnail">
                  <img src={`https://img.youtube.com/vi/${video.id}/default.jpg`} alt={video.title} />
                </div>
                <div className="research-hanatv-related-video-title">{video.title}</div>
              </div>
            ))}
        </div>
      </div>
      {otherTopics.map((topic, index) => (
        <div key={index} className="research-hanatv-other-topic-section">
          <h3>{topic}</h3>
          <div className="research-hanatv-videos-row">
            {videoData[topic]
              .slice() // 원본 배열을 변경하지 않기 위해 복사
              .reverse() // 역순으로 정렬
              .map((video, idx) => (
                <div key={idx} className="research-hanatv-video-item" onClick={() => handleVideoClick(video, topic)}>
                  <div className="research-hanatv-thumbnail">
                    <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={video.title} />
                  </div>
                  <div className="research-hanatv-video-title">{video.title}</div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResearchHanaTV;
