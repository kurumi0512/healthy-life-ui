import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Swal from 'sweetalert2';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = '使用者名稱不能為空';
    } else if (form.username.length < 3 || form.username.length > 20) {
      newErrors.username = '使用者名稱長度需介於 3~20 字之間';
    }

    if (!form.email.trim()) {
      newErrors.email = '信箱不能為空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '信箱格式不正確';
    }

    if (!form.password.trim()) {
      newErrors.password = '密碼不能為空';
    } else if (form.password.length < 6 || form.password.length > 30) {
      newErrors.password = '密碼長度需至少 6 個字';
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = '請再次輸入密碼';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = '兩次密碼不一致';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;         // 避免重複送出
  setIsSubmitting(true);            // 鎖定按鈕

  const foundErrors = validate();
  if (Object.keys(foundErrors).length > 0) {
    setErrors(foundErrors);
    setIsSubmitting(false);         // 驗證失敗也要解鎖
    return;
  }

  const result = await register({
    username: form.username,
    password: form.password,
    confirmPassword: form.confirmPassword,
    email: form.email,
  });

  if (result.success) {
    await Swal.fire({
      icon: 'success',
      title: '註冊成功',
      text: '請至信箱完成驗證，才能登入系統',
      confirmButtonText: '前往登入'
    });
    navigate('/login');
  } else {
    await Swal.fire({
      icon: 'error',
      title: '註冊失敗',
      text: result.message || '請稍後再試',
    });
  }

  setIsSubmitting(false); // 最後解除鎖定
};

  return (
    <div className="p-6 pt-24 max-w-md mx-auto shadow-lg rounded bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">註冊</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="使用者名稱"
          value={form.username}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errors.username ? 'border-red-500' : ''}`}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

        <input
          type="email"
          name="email"
          placeholder="電子郵件"
          value={form.email}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="密碼"
          value={form.password}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="確認密碼"
          value={form.confirmPassword}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? '註冊中...' : '註冊'}
        </button>

        <div className="text-right">
          <a href="/login" className="text-sm text-blue-500 hover:underline">
            已有帳號？前往登入
          </a>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;