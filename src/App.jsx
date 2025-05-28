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
import AdminUsersPage from './pages/AdminUsersPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>載入中...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>載入中...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "ADMIN") return <Navigate to="/" />;
  return children;
}

function App() {
  const { loading } = useAuth();

  if (loading) return <div>載入中...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-success" element={<VerifySuccess />} />

        {/* 需登入的頁面 */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/weight" element={<ProtectedRoute><WeightRecordPage /></ProtectedRoute>} />
        <Route path="/blood-pressure" element={<ProtectedRoute><BPRecordPage /></ProtectedRoute>} />
        <Route path="/blood-sugar" element={<ProtectedRoute><SugarLogPage /></ProtectedRoute>} />
        <Route path="/advice" element={<ProtectedRoute><AdvicePage /></ProtectedRoute>} />

        {/* 管理員專用頁面 */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />

        {/* 其他路徑導回首頁 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;