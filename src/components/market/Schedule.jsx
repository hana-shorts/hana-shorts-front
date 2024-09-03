import React from "react";
import "./Schedule.css";

const Schedule = () => {
  const scheduleData = [
    {
      time: "하루 종일",
      currency: "룩셈부르크",
      importance: "",
      event: "콜롬비아 - 성모 휴스 순례 축일",
      actual: "",
      forecast: "",
      previous: "",
    },
    {
      time: "07:30",
      currency: "NZD",
      importance: "★★★",
      event: "서비스 구매관리자지수",
      actual: "40.2",
      forecast: "",
      previous: "",
    },
    {
      time: "08:01",
      currency: "GBP",
      importance: "★★",
      event: "Rightmove 주택가격지수 (MoM)",
      actual: "",
      forecast: "",
      previous: "-0.4%",
    },
    {
      time: "08:50",
      currency: "JPY",
      importance: "★★",
      event: "근원 기계주문 (MoM) (8월)",
      actual: "0.6%",
      forecast: "",
      previous: "-3.2%",
    },
    {
      time: "08:50",
      currency: "JPY",
      importance: "★★★",
      event: "근원 기계주문 (YoY) (8월)",
      actual: "1.8%",
      forecast: "",
      previous: "10.8%",
    },
    {
      time: "11:30",
      currency: "THB",
      importance: "★★",
      event: "태국 GDP (YoY) (2분기)",
      actual: "2.1%",
      forecast: "1.5%",
      previous: "",
    },
    {
      time: "11:30",
      currency: "THB",
      importance: "★★",
      event: "GDP (QoQ) (2분기)",
      actual: "0.90%",
      forecast: "",
      previous: "1.10%",
    },
    {
      time: "12:00",
      currency: "NZD",
      importance: "★★★",
      event: "뉴질랜드 중앙은행 역외 지주 (7월)",
      actual: "57.20%",
      forecast: "",
      previous: "",
    },
    {
      time: "13:00",
      currency: "MYR",
      importance: "★★★",
      event: "말레이시아 수출 (YoY) (7월)",
      actual: "7.9%",
      forecast: "",
      previous: "1.7%",
    },
    {
      time: "13:00",
      currency: "MYR",
      importance: "★★★",
      event: "말레이시아 수입 (YoY) (7월)",
      actual: "15.5%",
      forecast: "",
      previous: "17.8%",
    },
    {
      time: "13:00",
      currency: "MYR",
      importance: "★★",
      event: "말레이시아 무역수지 (7월)",
      actual: "12.00B",
      forecast: "",
      previous: "14.30B",
    },
    {
      time: "17:00",
      currency: "EUR",
      importance: "★★",
      event: "스페인 무역수지 (6월)",
      actual: "-2.30B",
      forecast: "",
      previous: "",
    },
    {
      time: "18:00",
      currency: "EUR",
      importance: "★★★",
      event: "중국 외국인직접투자 (7월)",
      actual: "-29.10%",
      forecast: "",
      previous: "",
    },
    {
      time: "18:30",
      currency: "EUR",
      importance: "★★",
      event: "독일 12개월 만기 Bubill 국채 입찰",
      actual: "3.192%",
      forecast: "",
      previous: "",
    },
    {
      time: "19:00",
      currency: "EUR",
      importance: "★★",
      event: "독일 Buba 월간 보고서",
      actual: "",
      forecast: "",
      previous: "",
    },
    {
      time: "19:00",
      currency: "EUR",
      importance: "★★",
      event: "스페인 소비자신뢰지수 (7월)",
      actual: "88.4",
      forecast: "",
      previous: "",
    },
    {
      time: "20:25",
      currency: "BRL",
      importance: "★★",
      event: "BCB 포커스 시장 정보",
      actual: "",
      forecast: "",
      previous: "",
    },
    {
      time: "22:00",
      currency: "EUR",
      importance: "★★★",
      event: "프랑스 1년물 BTF 국채 입찰",
      actual: "3.053%",
      forecast: "",
      previous: "",
    },
    {
      time: "22:00",
      currency: "EUR",
      importance: "★★★",
      event: "프랑스 3개월물 BTF 국채 입찰",
      actual: "3.553%",
      forecast: "",
      previous: "",
    },
    {
      time: "22:00",
      currency: "EUR",
      importance: "★★★",
      event: "프랑스 6개월물 BTF 국채 입찰",
      actual: "3.380%",
      forecast: "",
      previous: "",
    },
    {
      time: "22:15",
      currency: "USD",
      importance: "★★",
      event: "연준 월간 이사회 연설",
      actual: "",
      forecast: "",
      previous: "",
    },
    {
      time: "23:00",
      currency: "USD",
      importance: "★★",
      event: "미국 선행지수 (MoM) (7월)",
      actual: "-0.4%",
      forecast: "",
      previous: "-0.2%",
    },
    {
      time: "23:30",
      currency: "CAD",
      importance: "★★",
      event: "캐나다중앙은행(BoC) 수석 대출 관리자 설문 조사 (2분기)",
      actual: "2.8",
      forecast: "",
      previous: "",
    },
  ];

  return (
    <div className="schedule-rates">
      <div className="schedule-header">
        <div className="schedule-info">시간</div>
        <div className="schedule-currency">외화</div>
        <div className="schedule-importance">중요성</div>
        <div className="schedule-event">이벤트</div>
        <div className="schedule-result">실제</div>
        <div className="schedule-forecast">예측</div>
        <div className="schedule-previous">이전</div>
      </div>
      {scheduleData.map((item, i) => (
        <div className="schedule-item" key={i}>
          <div className="schedule-info">{item.time}</div>
          <div className="schedule-currency">{item.currency}</div>
          <div className="schedule-importance">{item.importance}</div>
          <div className="schedule-event">{item.event}</div>
          <div className="schedule-result">{item.actual}</div>
          <div className="schedule-forecast">{item.forecast}</div>
          <div className="schedule-previous">{item.previous}</div>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
