// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
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

  const handleLogout = async () => {
    await signOut(auth);
    alert('로그아웃 되었습니다.');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>로그인</h2>

      <form onSubmit={handleLogin}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300 }}>
          <label>
            아이디 (이메일)
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            비밀번호
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '로딩 중...' : '로그인'}
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <a href="/signup" style={{ color: '#ffcc00', textDecoration: 'underline' }}>
          회원가입
        </a>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <a href="/find-id" style={{ color: '#00ccff', textDecoration: 'underline' }}>
          아이디(이메일) 찾기
        </a>
      </div>

      <div className="section sns-buttons" style={{ marginTop: '2rem' }}>
        <h2>SNS 로그인으로 간편하게 시작하기</h2>
        <button onClick={handleGoogleLogin} disabled={loading}>
          구글로 로그인
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default LoginPage;
