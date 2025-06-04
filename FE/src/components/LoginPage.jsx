// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

const googleProvider = new GoogleAuthProvider();

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/main');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/main');
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/main');
    } catch (error) {
      alert('SNS 로그인 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>🔐 로그인</h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.5rem' }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.5rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.6rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none'
            }}
          >
            {loading ? '로딩 중...' : '로그인'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/signup">회원가입</a> | <a href="/find-id">아이디 찾기</a> | <a href="/reset-password">비밀번호 재설정</a>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={handleGoogleLogin} style={{ padding: '0.6rem', backgroundColor: '#4285F4', color: 'white', border: 'none' }}>
            구글로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
