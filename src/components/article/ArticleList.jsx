import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSpring, animated } from "@react-spring/web";
import "./ArticleList.css";

const ArticleList = ({
  articleList,
  customClassName,
  showImage = true,
  loading = false,
}) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000); // 최소 1초 동안 로딩 스켈레톤 표시

    return () => clearTimeout(timer);
  }, [loading]);

  // `useSpring`을 사용하여 애니메이션 효과 추가
  const springProps = useSpring({
    opacity: showSkeleton ? 0 : 1,
    transform: showSkeleton ? "translateY(10px)" : "translateY(0px)",
    config: { tension: 280, friction: 60 },
  });

  return (
    <div className={`articlelist-section ${customClassName}`}>
      {showSkeleton || loading
        ? Array.from({ length: 31 }).map((_, index) => (
            <Skeleton
              key={index}
              height={120}
              className="skeleton-ui"
              style={{
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))
        : articleList.map((news, index) => {
            return (
              <animated.a
                key={index}
                href={news.link}
                className="articlelist-link"
                target="_blank"
                rel="noopener noreferrer"
                style={springProps}
              >
                <div className="articlelist-item">
                  <div className="articlelist-content">
                    <div className="articlelist-text">
                      <div className="articlelist-header">
                        <div className="articlelist-time">
                          <div
                            style={{
                              backgroundColor: "#e9ebef",
                              fontSize: "14px",
                              padding: "6px 6px 4px 6px",
                              borderRadius: "5px",
                            }}
                          >
                            {news.time}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              padding: "4px 6px",
                              borderRadius: "5px",
                            }}
                          >
                            {news.date}
                          </div>
                        </div>
                        <div className="articlelist-press">{news.press}</div>
                      </div>
                      <div className="articlelist-title">{news.title}</div>
                      <div className="articlelist-description">
                        {news.description}
                      </div>
                    </div>
                    {showImage && news.img && (
                      <img
                        src={news.img}
                        alt={news.title}
                        className="articlelist-img"
                      />
                    )}
                  </div>
                </div>
              </animated.a>
            );
          })}
    </div>
  );
};

export default ArticleList;
