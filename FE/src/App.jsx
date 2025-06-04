// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import RecipeRecommendation from './components/RecipeRecommendation';
import WasteReport from './components/WasteReport';
import FindIDPage from './components/FindIDPage'; // 아이디 찾기 페이지 추가

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/recipes" element={<RecipeRecommendation />} />
        <Route path="/report" element={<WasteReport />} />
        <Route path="/find-id" element={<FindIDPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
