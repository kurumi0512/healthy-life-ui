import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const email = location.state?.email || '';

  const handleVerify = async () => {
    try {
      await axios.post('http://localhost:8082/rest/health/forgot-password/verify', { email, code });
      Swal.fire('驗證成功', '請設定新密碼', 'success');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      Swal.fire('錯誤', err.response?.data?.message || '驗證失敗', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 防止頁面重新整理
    handleVerify();
  };

  return (
    <div className="p-6 pt-24 max-w-md mx-auto shadow rounded bg-white">
      <h2 className="text-xl font-bold mb-4">🧾 驗證碼確認 - 步驟 2</h2>
      <p className="text-sm text-gray-600">已寄至：{email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="請輸入驗證碼"
          className="mt-2 border p-2 w-full rounded"
        />
        <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full">
          驗證
        </button>
      </form>
    </div>
  );
}

export default VerifyCodePage;