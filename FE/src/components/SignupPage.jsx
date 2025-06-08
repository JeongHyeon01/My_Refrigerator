import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="form-card max-w-md w-full p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🍳</span>
          <h1 className="text-3xl font-bold text-gray-800">나의 냉장고</h1>
        </div>
        <h2 className="text-lg text-gray-600 mb-6">회원가입</h2>
        <form onSubmit={handleSignup} className="w-full flex flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
            회원가입
          </button>
        </form>
        <div className="text-blue-500 text-sm mt-2">
          <Link to="/login" className="hover:underline">로그인 페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
