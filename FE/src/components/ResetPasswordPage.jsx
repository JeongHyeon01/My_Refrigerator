import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('비밀번호 재설정 이메일이 전송되었습니다.');
      setEmail('');
    } catch (error) {
      alert('비밀번호 재설정 실패: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="form-card max-w-md w-full p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🍳</span>
          <h1 className="text-3xl font-bold text-gray-800">나의 냉장고</h1>
        </div>
        <h2 className="text-lg text-gray-600 mb-6">🔐 비밀번호 재설정</h2>
        <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4 mb-4">
          <input
            type="email"
            placeholder="가입한 이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            재설정 이메일 보내기
          </button>
        </form>
        <div className="text-blue-500 text-sm mt-2">
          <Link to="/login" className="hover:underline">로그인 페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
