import React from 'react';
import { Link } from 'react-router-dom';

function VerifyFail() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800">
      <h1 className="text-3xl font-bold mb-4">驗證失敗</h1>
      <p className="mb-6">驗證連結可能已過期，或帳號不存在。</p>
      <Link
        to="/"
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        返回首頁
      </Link>
    </div>
  );
}

export default VerifyFail;