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
    <div className="page-center">
      <div className="form-card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>로그인</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="이메일"
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
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              borderRadius: '5px',
              marginBottom: '1rem'
            }}
          >
            로그인
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.6rem',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            margin: '0 auto 1rem auto',
            display: 'block'
          }}
        >
           Google로 로그인
        </button>

        <div style={{ textAlign: 'center' }}>
          <Link to="/signup" style={{ marginRight: '1rem' }}>회원가입</Link>
          <Link to="/find-id" style={{ marginRight: '1rem' }}>아이디 찾기</Link>
          <Link to="/reset-password">비밀번호 재설정</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
