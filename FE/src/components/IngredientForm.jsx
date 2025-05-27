// src/components/IngredientForm.jsx
import React, { useState } from 'react';

const IngredientForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = '이름을 입력하세요';
    if (!form.quantity || isNaN(form.quantity)) errs.quantity = '숫자 수량 입력';
    if (!form.expiryDate) errs.expiryDate = '유통기한 선택';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (onSubmit) onSubmit(form);
    alert("식재료가 등록되었습니다.");
    setForm({ name: '', quantity: '', expiryDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h3>📝 식재료 등록</h3>

      <label>
        이름:
        <input type="text" name="name" value={form.name} onChange={handleChange} />
        <div style={{ color: 'red' }}>{errors.name}</div>
      </label>

      <br />

      <label>
        수량:
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />
        <div style={{ color: 'red' }}>{errors.quantity}</div>
      </label>

      <br />

      <label>
        유통기한:
        <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
        <div style={{ color: 'red' }}>{errors.expiryDate}</div>
      </label>

      <br />

      <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>
        등록
      </button>
    </form>
  );
};

export default IngredientForm;
