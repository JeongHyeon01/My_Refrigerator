// src/components/SignupPage.jsx
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
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>
          이메일:
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          <div>{errors.email}</div>
        </label>
        <label>
          비밀번호:
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          <div>{errors.password}</div>
        </label>
        <label>
          비밀번호 확인:
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          <div>{errors.confirmPassword}</div>
        </label>
        <label>
          닉네임:
          <input type="text" name="nickname" value={form.nickname} onChange={handleChange} />
          <div>{errors.nickname}</div>
        </label>
        <button type="submit">회원가입</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 15 }}>
        <a href="/login">로그인</a>
      </p>
    </div>
  );
};

export default SignupPage;
