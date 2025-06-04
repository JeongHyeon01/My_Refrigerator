import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('📧 비밀번호 재설정 이메일이 발송되었습니다.');
    } catch (err) {
      setError('오류: ' + err.message);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>🔐 비밀번호 재설정</h2>

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input
            type="email"
            placeholder="가입한 이메일 주소 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.5rem' }}
          />
          <button
            type="submit"
            style={{
              padding: '0.6rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none'
            }}
          >
            재설정 메일 보내기
          </button>
        </form>

        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/login">로그인 페이지로 돌아가기</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
