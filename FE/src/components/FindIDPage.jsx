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
    <div className="page-center">
      <div className="form-card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>🔍 아이디(이메일) 찾기</h2>
        <form onSubmit={handleFindID} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="가입 시 입력한 이름(닉네임)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: '0.5rem',
              maxWidth: '400px',
              width: '100%',
              marginBottom: '1rem'
            }}
          />
          <button
            type="submit"
            className="action-btn"
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.6rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            아이디 찾기
          </button>
        </form>

        {foundEmail && (
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#333' }}>
            ✔️ 가입된 이메일: <strong>{foundEmail}</strong>
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login">로그인 페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default FindIDPage;
