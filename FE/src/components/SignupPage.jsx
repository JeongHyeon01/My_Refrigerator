import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        email: form.email,
        name: form.name,
      });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>회원가입</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              padding: '0.5rem',
              maxWidth: '400px',
              width: '100%',
              marginBottom: '1rem'
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
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
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
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
            회원가입
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login">로그인 페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
