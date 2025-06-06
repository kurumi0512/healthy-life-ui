import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react'; // ❗若未使用 icon 可改為 emoji

function VerifyFail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center text-red-700">
        <XCircle className="mx-auto text-red-500" size={60} />
        <h1 className="text-2xl font-bold mt-4">驗證失敗</h1>
        <p className="mt-2 text-sm">
          驗證連結可能已過期，或帳號資訊錯誤。<br />請確認信件連結是否正確，或重新註冊帳號。
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}

export default VerifyFail;