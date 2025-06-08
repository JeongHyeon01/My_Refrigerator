import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from 'react-router-dom';
import PreferenceSelection from './components/PreferenceSelection';
import LoginPage from './components/LoginPage';
import FindIDPage from './components/FindIDPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import RecipeRecommendation from './components/RecipeRecommendation';
import WasteReport from './components/WasteReport';
import ConsumedIngredients from './components/ConsumedIngredients';
import RecipeDetail from './components/RecipeDetail';

const Home: React.FC = () => {
  return null; // 홈 컴포넌트도 필요 없으므로 비워둡니다.
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/preferences" element={<PreferenceSelection />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/find-id" element={<FindIDPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/recipes" element={<RecipeRecommendation />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/report" element={<WasteReport />} />
            <Route path="/consumed" element={<ConsumedIngredients />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 