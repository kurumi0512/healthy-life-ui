import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItemStyle = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-bold border-b-2 border-blue-600'
      : 'text-gray-600 hover:text-blue-600';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 左側 LOGO 或標題 */}
        <div className="flex justify-between w-full md:w-auto">
          <div>
            <NavLink to="/" className={navItemStyle}>
              首頁
            </NavLink>
          </div>

          {/* 手機漢堡按鈕 */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 中央導覽列（桌機版） */}
        <div className="hidden md:flex flex-wrap justify-center gap-6">
          {user?.role === 'USER' && (
            <>
              <NavLink to="/weight" className={navItemStyle}>體重紀錄</NavLink>
              <NavLink to="/blood-pressure" className={navItemStyle}>血壓紀錄</NavLink>
              <NavLink to="/blood-sugar" className={navItemStyle}>血糖紀錄</NavLink>
              <NavLink to="/advice" className={navItemStyle}>健康建議</NavLink>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin/dashboard" className={navItemStyle}>後台管理</NavLink>
          )}
        </div>

        {/* 右上登入區（桌機版） */}
        <div className="flex items-center gap-4 hidden md:flex">
          {user ? (
            <>
              <span className="text-gray-700">您好，{user.username}</span>
              <NavLink to="/profile" className="text-blue-600 hover:underline">使用者設定</NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-blue-600 hover:underline">登入</NavLink>
              <NavLink to="/register" className="text-blue-600 hover:underline">註冊</NavLink>
            </>
          )}
        </div>
      </div>

      {/* 手機選單展開 */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} mt-4 flex flex-col gap-4`}>
        <div className="flex items-center gap-4 p-4">
          {user ? (
            <>
              <span className="text-gray-700">您好，{user.username}</span>
              <NavLink to="/profile" className="text-blue-600 hover:underline" onClick={handleLinkClick}>使用者設定</NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-blue-600 hover:underline">登入</NavLink>
              <NavLink to="/register" className="text-blue-600 hover:underline">註冊</NavLink>
            </>
          )}
        </div>

        {user?.role === 'USER' && (
          <>
            <NavLink to="/weight" className={navItemStyle} onClick={handleLinkClick}>體重紀錄</NavLink>
            <NavLink to="/blood-pressure" className={navItemStyle} onClick={handleLinkClick}>血壓紀錄</NavLink>
            <NavLink to="/blood-sugar" className={navItemStyle} onClick={handleLinkClick}>血糖紀錄</NavLink>
            <NavLink to="/advice" className={navItemStyle} onClick={handleLinkClick}>健康建議</NavLink>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <NavLink to="/admin/dashboard" className={navItemStyle} onClick={handleLinkClick}>後台管理</NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
