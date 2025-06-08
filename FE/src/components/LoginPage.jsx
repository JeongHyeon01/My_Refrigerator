import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인 성공!');
      navigate('/main');
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert('구글 로그인 성공!');
      navigate('/main');
    } catch (error) {
      alert('구글 로그인 실패: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="form-card max-w-md w-full p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🍳</span>
          <h1 className="text-3xl font-bold text-gray-800">나의 냉장고</h1>
        </div>
        <h2 className="text-lg text-gray-600 mb-6">로그인</h2>
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mb-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            로그인
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition mb-4"
        >
          Google로 로그인
        </button>
        <div className="flex gap-4 text-blue-500 text-sm mt-2">
          <Link to="/signup" className="hover:underline">회원가입</Link>
          <Link to="/find-id" className="hover:underline">아이디 찾기</Link>
          <Link to="/reset-password" className="hover:underline">비밀번호 재설정</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
