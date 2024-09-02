import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Main from "./pages/main/Main";
import Article from "./pages/article/Article";
import Market from "./pages/market/Market";
import Trade from "./pages/trade/Trade";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/article" element={<Article />} />
          <Route path="/market" element={<Market />} />
          <Route path="/trade" element={<Trade />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
