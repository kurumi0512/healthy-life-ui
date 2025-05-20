import React, { useEffect } from 'react';  // ← 記得引入 useEffect
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import FrontPage from './pages/FrontPage';
import ProfilePage from './pages/ProfilePage';
import WeightRecordPage from './pages/WeightRecordPage';
import BPRecordPage from './pages/BPRecordPage';
import SugarLogPage from './pages/SugarLogPage';
import AdvicePage from './pages/AdvicePage';
import RegisterPage from './pages/RegisterPage';

function App() {

  // 🔍 這裡放測試後端是否有連上
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
      </Routes>
    </>
  );
}

export default App;