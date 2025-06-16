import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async () => {
    if (password !== confirm) {
      Swal.fire('錯誤', '兩次輸入的密碼不一致', 'error');
      return;
    }
    try {
      await axios.post('http://localhost:8082/rest/health/forgot-password/reset', {
        email,
        newPassword: password,
      });
      Swal.fire('成功', '密碼已更新，請重新登入', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('錯誤', err.response?.data?.message || '重設失敗', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止預設行為（重新整理）
    handleReset();
  };

  return (
    <div className="p-6 pt-24 max-w-md mx-auto shadow rounded bg-white">
      <h2 className="text-xl font-bold mb-4">🔑 設定新密碼 - 步驟 3</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="輸入新密碼"
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="再次輸入新密碼"
          className="mt-2 border p-2 w-full rounded"
        />
        <button type="submit" className="mt-4 bg-purple-600 text-white px-4 py-2 rounded w-full">
          確認重設密碼
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;