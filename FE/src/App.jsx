// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import RecipeRecommendation from './components/RecipeRecommendation';
import WasteReport from './components/WasteReport';
import FindIDPage from './components/FindIDPage';
import ResetPasswordPage from './components/ResetPasswordPage';

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
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
