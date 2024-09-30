// src/pages/research/ResearchHanaTV.jsx
import React, { useState } from "react";
import YouTube from "react-youtube";
import videoData from "./videoData"; // videoData 파일에서 불러옴
import "./ResearchHanaTV.css";

const ResearchHanaTV = () => {
  // 초기 상태 설정
  const initialTopic = "리서치 모닝브리프";
  const initialVideo = videoData[initialTopic][0];

  const [mainVideo, setMainVideo] = useState({
    id: initialVideo.id,
    title: initialVideo.title,
  });
  const [currentTopic, setCurrentTopic] = useState(initialTopic);

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  // 다른 주제 목록
  const otherTopics = Object.keys(videoData).filter(
    (topic) => topic !== currentTopic
  );

  // 메인 영상 변경 함수
  const handleVideoClick = (video, topic) => {
    setMainVideo({ id: video.id, title: video.title });
    setCurrentTopic(topic);
  };

  return (
    <div className="research-hana-tv">
      <div className="main-content">
        <div className="main-video">
          <YouTube videoId={mainVideo.id} opts={opts} />
          <h2>{mainVideo.title}</h2>
        </div>
        <div className="related-videos">
          <h3>관련 영상</h3>
          {videoData[currentTopic].map((video, index) => (
            <div
              key={index}
              className="related-video-item"
              onClick={() => handleVideoClick(video, currentTopic)}
            >
              <div className="thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
                  alt={video.title}
                />
              </div>
              <div className="video-title">{video.title}</div>
            </div>
          ))}
        </div>
      </div>
      {otherTopics.map((topic, index) => (
        <div key={index} className="other-topic-section">
          <h3>{topic}</h3>
          <div className="videos-row">
            {videoData[topic].map((video, idx) => (
              <div
                key={idx}
                className="video-item"
                onClick={() => handleVideoClick(video, topic)}
              >
                <div className="thumbnail">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                  />
                </div>
                <div className="video-title">{video.title}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResearchHanaTV;
