import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import FrontPage from './pages/FrontPage';
import ProfilePage from './pages/ProfilePage';
import WeightRecordPage from './pages/WeightRecordPage';
import BPRecordPage from './pages/BPRecordPage';
import SugarLogPage from './pages/SugarLogPage';
import AdvicePage from './pages/AdvicePage';
import RegisterPage from './pages/RegisterPage';
import VerifySuccess from './pages/VerifySuccess';
import AdminDashboard from './pages/AdminDashboard'; // ✅ 新增管理者後台頁面

function App() {
  const { user } = useAuth(); // ✅ 從登入狀態取得登入者資訊

  // ✅ 權限保護元件：僅允許 ADMIN 進入
  const RequireAdmin = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (user.role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // ✅ 檢查後端是否連線（開發測試用）
  useEffect(() => {
    fetch('http://localhost:8082/health/ping', {
      credentials: 'include'
    })
      .then(res => res.text())
      .then(data => console.log('✅ 後端連線成功：', data))
      .catch(err => console.error('❌ 後端連線失敗：', err));
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/weight" element={<WeightRecordPage />} />
        <Route path="/blood-pressure" element={<BPRecordPage />} />
        <Route path="/blood-sugar" element={<SugarLogPage />} />
        <Route path="/advice" element={<AdvicePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-success" element={<VerifySuccess />} />

        {/* ✅ 管理者專用頁面：需為 ADMIN 身份 */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        {/* ✅ 沒有路徑時導回首頁 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
