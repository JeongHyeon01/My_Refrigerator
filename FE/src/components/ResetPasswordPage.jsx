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
    <div style={{ padding: '2rem' }}>
      <h2>🔐 비밀번호 재설정</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="가입한 이메일 주소 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>재설정 메일 보내기</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPasswordPage;
