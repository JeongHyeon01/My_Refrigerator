import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const FindIDPage = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState(null);
  const [error, setError] = useState('');

  const handleFindID = async (e) => {
    e.preventDefault();
    setEmail(null);
    setError('');

    try {
      const q = query(collection(db, 'users'), where('nickname', '==', nickname.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setEmail(userData.email);
      } else {
        setError('해당 이름으로 등록된 아이디(이메일)를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>🔎 아이디(이메일) 찾기</h2>

        <form onSubmit={handleFindID} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="가입 시 입력한 이름(닉네임)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            style={{ padding: '0.5rem' }}
          />
          <button
            type="submit"
            style={{
              padding: '0.6rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            아이디 찾기
          </button>
        </form>

        {email && <p style={{ color: 'green', marginTop: '1rem' }}>📧 등록된 이메일: {email}</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/login" style={{ textDecoration: 'underline', color: '#2196f3' }}>
            로그인 페이지로 돌아가기
          </a>
        </p>
      </div>
    </div>
  );
};

export default FindIDPage;
