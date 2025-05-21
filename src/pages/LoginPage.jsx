import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaImage, setCaptchaImage] = useState('http://localhost:8082/rest/health/captcha');
  const [errors, setErrors] = useState({});

  const { login, user } = useAuth(); // ✅ 加入 user 狀態
  const navigate = useNavigate();

  const refreshCaptcha = () => {
    setCaptchaImage(`http://localhost:8082/rest/health/captcha?${Date.now()}`);
    setCaptcha('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username.trim()) newErrors.username = '請輸入帳號';
    if (!password.trim()) newErrors.password = '請輸入密碼';
    if (!captcha.trim()) newErrors.captcha = '請輸入驗證碼';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login({ username, password, captcha });

    if (result.success) {
      console.log('✅ 登入成功，導向首頁');

      // ✅ 等待 user 狀態更新後再導頁
      setTimeout(() => {
        if (user?.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      }, 300);
    } else {
      alert(result.message);
      refreshCaptcha(); // ❗登入失敗時刷新驗證碼
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">會員登入</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* 帳號 */}
        <input
          type="text"
          placeholder="帳號"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`border p-2 rounded w-full ${errors.username ? 'border-red-500' : ''}`}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

        {/* 密碼 */}
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border p-2 rounded w-full ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        {/* 驗證碼 */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={captchaImage}
              alt="驗證碼"
              className="w-28 h-10 border rounded"
              onClick={refreshCaptcha}
              style={{ cursor: 'pointer' }}
            />
            <span className="text-sm text-gray-500">點選圖片可以刷新</span>
          </div>
          <input
            type="text"
            placeholder="請輸入驗證碼"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            className={`mt-2 border p-2 rounded w-full ${errors.captcha ? 'border-red-500' : ''}`}
          />
          {errors.captcha && <p className="text-red-500 text-sm">{errors.captcha}</p>}
        </div>

        {/* 登入按鈕 */}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          登入
        </button>

        <div className="flex justify-between text-sm">
          <a href="#" className="text-blue-500 hover:underline">忘記密碼？</a>
          <a href="/register" className="text-blue-500 hover:underline">註冊新帳號</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
