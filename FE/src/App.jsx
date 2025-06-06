import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import RecipeRecommendation from './components/RecipeRecommendation';
import RecipeDetail from './components/RecipeDetail'; // 추가
import WasteReport from './components/WasteReport';
import AdminPage from './components/AdminPage';
import ConsumedIngredients from './components/ConsumedIngredients';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/recipes" element={<RecipeRecommendation />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} /> {/* 추가 */}
        <Route path="/report" element={<WasteReport />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/consumed" element={<ConsumedIngredients />} />
      </Routes>
    </Router>
  );
};

export default App;
