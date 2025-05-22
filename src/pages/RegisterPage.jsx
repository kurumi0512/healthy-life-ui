import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth(); // ✅ 從 context 呼叫後端 register

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = '請輸入使用者名稱';
    if (!form.email.trim()) newErrors.email = '請輸入電子郵件';
    if (!form.password.trim()) newErrors.password = '請輸入密碼';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = '密碼不一致';
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const foundErrors = validate();
  if (Object.keys(foundErrors).length > 0) {
    setErrors(foundErrors);
    return;
  }

  // ✅ 改用 context 裡的 register（網址、credentials 都設定好了）
  const result = await register({
    username: form.username,
    password: form.password,
    email: form.email,
  });

  if (result.success) {
    alert('註冊成功！請至信箱點擊驗證連結完成帳號啟用');
    navigate('/login');
  } else {
    alert(result.message);
  }
};


  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded bg-white">
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

        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          註冊
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