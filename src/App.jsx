import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import VerifyFail from './pages/VerifyFail';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminUsersPage from './pages/AdminUsersPage';
import ChatbotFloatingButton from './components/ChatbotFloatingButton';
import ProteinAdvicePage from './pages/ProteinAdvicePage'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyCodePage from './pages/VerifyCodePage';
import ResetPasswordPage from './pages/ResetPasswordPage';

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
  const { user, loading } = useAuth();

  if (loading) return <div>載入中...</div>;

  return (
    <>
      <Navbar />
      <ToastContainer
        limit={1}
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-success" element={<VerifySuccess />} />
        <Route path="/verify-fail" element={<VerifyFail />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 需登入的頁面 */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/weight" element={<ProtectedRoute><WeightRecordPage /></ProtectedRoute>} />
        <Route path="/blood-pressure" element={<ProtectedRoute><BPRecordPage /></ProtectedRoute>} />
        <Route path="/blood-sugar" element={<ProtectedRoute><SugarLogPage /></ProtectedRoute>} />
        <Route path="/advice" element={<ProtectedRoute><AdvicePage /></ProtectedRoute>} />
        <Route path="/protein-advice" element={<ProtectedRoute><ProteinAdvicePage /></ProtectedRoute>} />

        {/* 管理員專用頁面 */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />

        {/* 其他路徑導回首頁 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* 聊天機器人浮動出現 */}
      {user && <ChatbotFloatingButton />}

    </>
  );
}

export default App;