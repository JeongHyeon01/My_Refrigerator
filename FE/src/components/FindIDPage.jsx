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
    <div style={{ padding: '2rem' }}>
      <h2>🔎 아이디 찾기</h2>
      <form onSubmit={handleFindID}>
        <input
          type="text"
          placeholder="가입 시 입력한 이름(닉네임)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: '10px' }}>아이디 찾기</button>
      </form>
      {email && <p>📧 등록된 이메일: {email}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p style={{ textAlign: 'center', marginTop: 15 }}>
        <a href="/login" style={{ textDecoration: 'underline', color: '#6666ff' }}>로그인 페이지로 돌아가기</a>
      </p>
    </div>
  );
};

export default FindIDPage;
