import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react'; 

function VerifySuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-500" size={60} />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">驗證成功</h2>
        <p className="text-gray-600 mt-2">您的帳號已成功啟用，請點擊下方按鈕登入系統。</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          前往登入
        </button>
      </div>
    </div>
  );
}

export default VerifySuccess;