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
    <div className="page-center">
      <div className="form-card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>🔐 비밀번호 재설정</h2>
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="가입한 이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            재설정 이메일 보내기
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login">로그인 페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
