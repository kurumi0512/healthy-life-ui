import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState(generateCaptcha());

  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setCaptcha('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username.trim()) newErrors.username = '請輸入帳號';
    if (!password.trim()) newErrors.password = '請輸入密碼';
    if (!captcha.trim()) newErrors.captcha = '請輸入驗證碼';
    else if (captcha.toUpperCase() !== captchaText) newErrors.captcha = '驗證碼錯誤';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login({ username, password });
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message); // 顯示錯誤訊息
    }
  };
  
  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">會員登入</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="帳號"
            className={`border p-2 rounded w-full ${errors.username ? 'border-red-500' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="密碼"
            className={`border p-2 rounded w-full ${errors.password ? 'border-red-500' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
            placeholder="請輸入驗證碼"
            className={`mt-2 border p-2 rounded w-full ${errors.captcha ? 'border-red-500' : ''}`}
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
          />
          {errors.captcha && <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>}
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          登入
        </button>
        <div className="flex justify-between text-sm">
          <a href="#" className="text-blue-500 hover:underline">
            忘記密碼？
          </a>
          <a href="/register" className="text-blue-500 hover:underline">
            註冊新帳號
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;