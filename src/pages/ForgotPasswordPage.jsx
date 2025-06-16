// ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!email.trim()) {
      setError('請輸入註冊時使用的 Email');
      return;
    }
    try {
      await axios.post('http://localhost:8082/rest/health/forgot-password/send', { email });
      Swal.fire('已寄出驗證碼', '請查看信箱', 'success');
      navigate('/verify-code', { state: { email } });
    } catch (err) {
      Swal.fire('錯誤', err.response?.data?.message || '寄送失敗', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ 阻止表單預設重新整理
    handleSend();       // ✅ 呼叫寄送函式
  };

  return (
    <div className="p-6 pt-24 max-w-md mx-auto shadow rounded bg-white">
      <h2 className="text-xl font-bold mb-4">🔐 忘記密碼 - 步驟 1</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入註冊信箱"
          className="border p-2 w-full rounded"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">
          寄送驗證碼
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;