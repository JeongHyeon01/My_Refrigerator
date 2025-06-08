import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const FindIDPage = () => {
  const [name, setName] = useState('');
  const [foundEmail, setFoundEmail] = useState('');

  const handleFindID = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, 'users'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setFoundEmail(userData.email);
      } else {
        alert('해당 이름의 사용자를 찾을 수 없습니다.');
        setFoundEmail('');
      }
    } catch (error) {
      alert('아이디 찾기 실패: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="form-card max-w-md w-full p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🍳</span>
          <h1 className="text-3xl font-bold text-gray-800">나의 냉장고</h1>
        </div>
        <h2 className="text-lg text-gray-600 mb-6">🔍 아이디(이메일) 찾기</h2>
        <form onSubmit={handleFindID} className="w-full flex flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder="가입 시 입력한 이름(닉네임)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            아이디 찾기
          </button>
        </form>
        {foundEmail && (
          <p className="text-center mt-2 text-green-700 font-semibold">
            ✔️ 가입된 이메일: <strong>{foundEmail}</strong>
          </p>
        )}
        <div className="text-blue-500 text-sm mt-2">
          <Link to="/login" className="hover:underline">로그인 페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default FindIDPage;
