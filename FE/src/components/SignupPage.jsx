import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = '이메일을 입력하세요';
    if (!form.password) errs.password = '비밀번호를 입력하세요';
    if (form.password !== form.confirmPassword) errs.confirmPassword = '비밀번호가 일치하지 않습니다';
    if (!form.nickname) errs.nickname = '닉네임을 입력하세요';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: form.email,
        nickname: form.nickname,
        uid: userCredential.user.uid,
      });
      alert('회원가입 성공');
      navigate('/login');
    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>📝 회원가입</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
          <div style={{ color: 'red' }}>{errors.email}</div>

          <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
          <div style={{ color: 'red' }}>{errors.password}</div>

          <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} />
          <div style={{ color: 'red' }}>{errors.confirmPassword}</div>

          <input type="text" name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} />
          <div style={{ color: 'red' }}>{errors.nickname}</div>

          <button type="submit" style={{ padding: '0.6rem', backgroundColor: '#4caf50', color: 'white', border: 'none' }}>
            회원가입
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/login">로그인 페이지로 돌아가기</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
