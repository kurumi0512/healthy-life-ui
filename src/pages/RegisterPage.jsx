import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  });
  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setForm({ ...form, captcha: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = '請輸入使用者名稱';
    if (!form.email.trim()) newErrors.email = '請輸入電子郵件';
    if (!form.password.trim()) newErrors.password = '請輸入密碼';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = '密碼不一致';
    if (!form.captcha.trim()) newErrors.captcha = '請輸入驗證碼';
    else if (form.captcha.toUpperCase() !== captchaText) newErrors.captcha = '驗證碼錯誤';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }
    // 模擬註冊成功，導向登入
    alert('註冊成功');
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">註冊</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            name="username"
            placeholder="使用者名稱"
            value={form.username}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.username ? 'border-red-500' : ''}`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="電子郵件"
            value={form.email}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="密碼"
            value={form.password}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="確認密碼"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <div>
          <label className="block mb-1">驗證碼</label>
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 text-lg font-mono px-3 py-1 rounded select-none tracking-widest">
              {captchaText}
            </div>
            <button
              type="button"
              onClick={handleRefreshCaptcha}
              className="text-sm text-blue-500 hover:underline"
            >
              重新產生
            </button>
          </div>
          <input
            type="text"
            name="captcha"
            placeholder="請輸入驗證碼"
            value={form.captcha}
            onChange={handleChange}
            className={`mt-2 border p-2 rounded w-full ${errors.captcha ? 'border-red-500' : ''}`}
          />
          {errors.captcha && <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>}
        </div>

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