import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // ⬅️ 引入登入狀態

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // 控制漢堡選單開關

  const navItemStyle = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-bold border-b-2 border-blue-600'
      : 'text-gray-600 hover:text-blue-600';

  const handleLogout = () => {
    logout(); // 清空登入狀態
    navigate('/login'); // 導回登入頁
  };

  const handleLinkClick = () => {
    setIsOpen(false); // 點擊後關閉漢堡選單
  };

  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 左邊：品牌標題 / 漢堡選單按鈕 */}
        <div className="flex justify-between w-full md:w-auto">
          <div>
            <NavLink to="/" className={navItemStyle}>
              首頁
            </NavLink>
          </div>

          {/* 漢堡選單按鈕 */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 中央導覽列：在大螢幕時顯示 */}
        <div className="hidden md:flex flex-wrap justify-center gap-6">
          <NavLink to="/weight" className={navItemStyle}>
            體重紀錄
          </NavLink>
          <NavLink to="/blood-pressure" className={navItemStyle}>
            血壓紀錄
          </NavLink>
          <NavLink to="/blood-sugar" className={navItemStyle}>
            血糖紀錄
          </NavLink>
          <NavLink to="/advice" className={navItemStyle}>
            健康建議
          </NavLink>
        </div>
        
        {/* 右上角：登入/登出 */}
        <div className="flex items-center gap-4 hidden md:flex">
          {user ? (
            <>
              <span className="text-gray-700">您好，{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                登出
              </button>
            </>
          ) : (
            <NavLink to="/login" className="text-blue-600 hover:underline">
              登入
            </NavLink>
          )}
        </div>
      </div>

      {/* 在小螢幕顯示的選單 */}
      <div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'} mt-4 flex flex-col gap-4`}
      >
        {/* 漢堡選單左邊加入登入/登出 */}
        <div className="flex items-center gap-4 p-4">
          {user ? (
            <>
              <span className="text-gray-700">您好，{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                登出
              </button>
            </>
          ) : (
            <NavLink to="/login" className="text-blue-600 hover:underline">
              登入
            </NavLink>
          )}
        </div>

        <NavLink to="/weight" className={navItemStyle} onClick={handleLinkClick}>
          體重紀錄
        </NavLink>
        <NavLink to="/blood-pressure" className={navItemStyle} onClick={handleLinkClick}>
          血壓紀錄
        </NavLink>
        <NavLink to="/blood-sugar" className={navItemStyle} onClick={handleLinkClick}>
          血糖紀錄
        </NavLink>
        <NavLink to="/advice" className={navItemStyle} onClick={handleLinkClick}>
          健康建議
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;