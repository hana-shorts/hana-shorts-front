// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import axios from './api/axios'; // Axios 인스턴스 사용

import Main from './pages/main/Main';
import Article from './pages/article/Article';
import Market from './pages/market/Market';
import Trade from './pages/trade/Trade';
import Research from './pages/research/Research';
import ResearchIntro from './pages/research/ResearchIntro';
import ResearchResult from './pages/research/ResearchResult';
import MyPage from './pages/mypage/MyPage'; // 마이 페이지 컴포넌트 임포트

function App() {
  const [user, setUser] = useState(null);

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/user/status');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/article" element={<Article />} />
          <Route path="/market" element={<Market />} />
          <Route path="/trade/:stockCode" element={<Trade />} />
          <Route path="/trade" element={<Navigate to="/trade/005930" />} />
          <Route path="/research/:tabName/:videoId" element={<Research />} />
          <Route path="/research/:tabName" element={<Research />} />
          <Route path="/research" element={<ResearchIntro />} />
          <Route path="/research/result" element={<ResearchResult />} />
          <Route path="/mypage" element={user ? <MyPage /> : <Navigate to="/" />} />
          {/* 추가적인 라우트 */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
