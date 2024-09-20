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

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/article" element={<Article />} />
          <Route path="/market" element={<Market />} />
          {/* <Route path="/trade" element={<Trade />} /> */}
          <Route path="/trade/:stockCode" element={<Trade />} />
          <Route path="/trade" element={<Navigate to="/trade/005930" />} />
          <Route path="/research" element={<Research />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
