// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Main from "./pages/main/Main";
import Article from "./pages/article/Article";
import Market from "./pages/market/Market";
import Trade from "./pages/trade/Trade";
import Research from "./pages/research/Research";
import ResearchIntro from "./pages/research/ResearchIntro"; // 새로운 컴포넌트 임포트
import ResearchResult from "./pages/research/ResearchResult";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/article" element={<Article />} />
          <Route path="/market" element={<Market />} />
          <Route path="/trade/:stockCode" element={<Trade />} />
          <Route path="/trade" element={<Navigate to="/trade/005930" />} />
          <Route path="/research/:tabName" element={<Research />} />
          <Route path="/research" element={<ResearchIntro />} />
          <Route path="/research/result" element={<ResearchResult />} />
          {/* 새로운 라우트 추가 */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
