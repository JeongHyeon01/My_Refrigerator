// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import RecipeRecommendation from './components/RecipeRecommendation';
import WasteReport from './components/WasteReport';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* 초기 접속 시 로그인으로 이동 */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/recipes" element={<RecipeRecommendation />} />
        <Route path="/report" element={<WasteReport />} />
      </Routes>
    </Router>
  );
};

export default App;
