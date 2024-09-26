// components/research/YouTubeShorts.jsx
import React, { useEffect, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "./YouTubeShorts.css"; // 별도의 CSS 파일 분리
import { Typography } from "@mui/material";

const YouTubeShorts = () => {
  // useMemo를 사용하여 videos 배열 캐싱
  const videos = useMemo(
    () => [
      { id: "K6DJVS4-oVc", title: "손정의 [별프로의 경제 인물사전]" },
      {
        id: "Ixnq73O72wA",
        title:
          "(9/2~9/8)일정체크! 일주일에!! 일분만!!! 연준 베이지북#3국 연례 경제대회 #독일 IFA",
      },
      {
        id: "XSj5mgKed-o",
        title:
          "먼 미래에 다녀와도 투자가 너무 답답하고 막막할 땐? 쇼츠한 돈으로 만드는 쇼츠! 해답하라, 하나증권#shorts #인터스텔라#해답하라",
      },
      {
        id: "JpmuW_FGsSs",
        title:
          "(8/26~9/1)일정체크! 일주일에!! 일분만!!! #뱅크홀리데이#엔비디아 #MSCI# 현대차",
      },
      { id: "y5pk01uWx2E", title: "리사 수 [별프로의 경제 인물사전]" },
      {
        id: "qnIyRs45gDw",
        title:
          "8/19~8/25)일정체크! 일주일에!! 일분만!!! #전당대회#게임스컴 #잭슨홀미팅#금융통화위원회",
      },
      {
        id: "zVNV5hsIn-A",
        title:
          "너무 답답하고 막막할 땐? 쇼츠한 돈으로 만드는 쇼츠! 해답하라, 하나증권#shorts #시그널#해답하라",
      },
      {
        id: "zA9TE9oYOvQ",
        title:
          "(8/12~8/18)일정체크! 일주일에!! 일분만!!! #MSCI#미국 CPI#광복절",
      },
      {
        id: "Bmr5NhvRB4s",
        title:
          "(8/5~8/11)일정체크! 일주일에!! 일분만!!! #RBA#통화정책회의#옵션만기일",
      },
      {
        id: "USVdksyRjlg",
        title:
          "내가 정말 되고 싶은건~ 행복한~ 쇼츠한 돈으로 만드는 쇼츠! 챌린지에 챌린지하다 #shorts #해피#challenge",
      },
      {
        id: "mjLjbFw9Nmo",
        title:
          "(7/29~8/3)일정체크! 일주일에!! 일분만!!! #BOE #BOJ #미국고용지표",
      },
      { id: "avcF0hca9DU", title: "도널드 트럼프 [별프로의 경제 인물사전]" },
    ],
    []
  );

  const loadAllPlayers = useCallback(() => {
    videos.forEach((video, index) => {
      const playerElement = document.getElementById(
        `youtube-shorts-player-${index}`
      );
      if (playerElement) {
        new window.YT.Player(playerElement, {
          height: "200",
          width: "100%",
          videoId: video.id,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
          },
        });
      }
    });
  }, [videos]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        loadAllPlayers();
      };
    } else {
      loadAllPlayers();
    }

    return () => {
      // Clean up players
      videos.forEach((_, index) => {
        const playerElement = document.getElementById(
          `youtube-shorts-player-${index}`
        );
        if (playerElement) {
          playerElement.innerHTML = ""; // Remove IFrame
        }
      });
    };
  }, [loadAllPlayers, videos]);

  return (
    <div className="youtube-shorts-container">
      <Typography variant="h6" gutterBottom>
        관련 유튜브 숏츠
      </Typography>
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={3}
        loop={true}
        navigation={true}
        breakpoints={{
          600: {
            slidesPerView: 4,
          },
          900: {
            slidesPerView: 5,
          },
        }}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id}>
            <div className="shorts-card">
              <div
                id={`youtube-shorts-player-${index}`}
                className="youtube-player"
              ></div>
              <Typography variant="body2" className="shorts-title">
                {video.title}
              </Typography>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default YouTubeShorts;
