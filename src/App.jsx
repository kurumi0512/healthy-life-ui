import React from 'react';
import { Routes, Route } from 'react-router-dom';  // 只需要引入 Routes 和 Route
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