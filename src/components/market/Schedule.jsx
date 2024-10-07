import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Schedule.css";

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 날짜 문자열을 Date 객체로 변환하는 함수
  const parseDateString = (dateStr) => {
    const regex = /^(\d{2})\.(\d{2})/;
    const match = dateStr.match(regex);
    if (match) {
      const month = parseInt(match[1], 10);
      const day = parseInt(match[2], 10);
      const year = new Date().getFullYear(); // 현재 연도 사용
      return new Date(year, month - 1, day);
    } else {
      return null;
    }
  };

  useEffect(() => {
    // 스켈레톤 로딩을 제일 먼저 시작
    setLoading(true);

    // CSV 파일 경로는 public 폴더를 기준으로 설정
    const csvFilePath = process.env.PUBLIC_URL + "/schedule.csv";

    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((item) => {
          const dateObj = parseDateString(item["날짜"]);
          return { ...item, dateObj };
        });

        // 고유한 날짜 추출 및 정렬 (최신 날짜가 먼저 오도록)
        const dates = data
          .filter((item) => item.dateObj)
          .map((item) => item.dateObj.getTime());
        const uniqueDateTimes = [...new Set(dates)].sort((a, b) => b - a);
        const uniqueDateObjects = uniqueDateTimes.map((time) => new Date(time));

        setScheduleData(data);
        setUniqueDates(uniqueDateObjects);

        // 현재 날짜에 해당하는 데이터가 있으면 선택, 없으면 최신 날짜 선택
        const today = new Date();
        const formattedToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ).getTime();

        const todayIndex = uniqueDateTimes.findIndex(
          (time) => time === formattedToday
        );

        if (todayIndex !== -1) {
          setSelectedDate(new Date(uniqueDateTimes[todayIndex]));
        } else if (uniqueDateObjects.length > 0) {
          setSelectedDate(uniqueDateObjects[0]); // 가장 최신 날짜로 설정
        }

        setLoading(false); // 데이터 로딩 완료 후 스켈레톤 로딩 종료
      },
      error: (error) => {
        console.error("CSV 파싱 오류:", error);
        setLoading(false); // 오류 발생 시에도 로딩 종료
      },
    });
  }, []);

  // 선택된 날짜의 데이터 필터링
  const getDataByDate = (date) => {
    return scheduleData.filter(
      (item) => item.dateObj && item.dateObj.getTime() === date.getTime()
    );
  };

  // 이전 날짜로 이동
  const handlePrevDate = () => {
    const currentIndex = uniqueDates.findIndex(
      (date) => date.getTime() === selectedDate.getTime()
    );
    if (currentIndex < uniqueDates.length - 1) {
      setSelectedDate(uniqueDates[currentIndex + 1]);
    }
  };

  // 다음 날짜로 이동
  const handleNextDate = () => {
    const currentIndex = uniqueDates.findIndex(
      (date) => date.getTime() === selectedDate.getTime()
    );
    if (currentIndex > 0) {
      setSelectedDate(uniqueDates[currentIndex - 1]);
    }
  };

  if (!selectedDate) {
    return <div>로딩 중...</div>; // 로딩 상태 표시
  }

  const dataForSelectedDate = getDataByDate(selectedDate);

  // 중요도에 따른 클래스 지정
  const getImportanceClass = (importance) => {
    if (importance === "상") return "schedule-importance-high";
    if (importance === "중") return "schedule-importance-medium";
    if (importance === "하") return "schedule-importance-low";
    return "";
  };

  // 선택된 날짜를 포맷팅하여 표시
  const formatSelectedDate = (date) => {
    const options = { month: "2-digit", day: "2-digit" };
    const dateStr = date.toLocaleDateString("ko-KR", options);
    const dayNames = ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"];
    const dayName = dayNames[date.getDay()];
    return `${dateStr} ${dayName}`;
  };

  return (
    <div style={{ minHeight: "1000px" }}>
      <div className="schedule-container">
        <div className="schedule-navigation">
          <button
            onClick={handlePrevDate}
            disabled={uniqueDates.length === 0 || uniqueDates.length <= 1}
            style={{ backgroundColor: "#009178", marginRight: "20px" }}
          >
            이전 날짜
          </button>
          <span>{formatSelectedDate(selectedDate)}</span>
          <button
            onClick={handleNextDate}
            disabled={uniqueDates.length === 0 || uniqueDates.length <= 1}
            style={{ backgroundColor: "#009178", marginLeft: "20px" }}
          >
            다음 날짜
          </button>
        </div>
        <div className="schedule-rates">
          <div className="schedule-header">
            <div className="schedule-time">시간</div>
            <div className="schedule-country">국가</div>
            <div className="schedule-event">경제지표</div>
            <div className="schedule-actual">실제</div>
            <div className="schedule-expected">예상</div>
            <div className="schedule-previous">이전</div>
            <div className="schedule-importance">중요도</div>
          </div>
          <div className="schedule-item-container">
            {loading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                  key={index}
                  height={106}
                  className="skeleton-ui"
                  style={{
                    borderRadius: "8px",
                    marginBottom: "5px",
                    backgroundColor: "#f0f0f0",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))
            ) : dataForSelectedDate.length > 0 ? (
              dataForSelectedDate.map((item, i) => (
                <div className="schedule-item" key={i}>
                  <div className="schedule-time">{item["시간"]}</div>
                  <div className="schedule-country">{item["국가"]}</div>
                  <div className="schedule-event">{item["경제지표"]}</div>
                  <div className="schedule-actual">{item["실제"]}</div>
                  <div className="schedule-expected">{item["예상"]}</div>
                  <div className="schedule-previous">{item["이전"]}</div>
                  <div
                    className={`schedule-importance ${getImportanceClass(
                      item["중요도"]
                    )}`}
                  >
                    {item["중요도"]}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
