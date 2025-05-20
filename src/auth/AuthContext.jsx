import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ 登入：帳密 + 驗證碼
  const login = async ({ username, password, captcha }) => {
    try {
      const response = await fetch('http://localhost:8082/health/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, captcha })
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: '登入失敗，請稍後再試' };
    }
  };

  // ✅ 註冊（會觸發後端發送 email 驗證）
  const register = async ({ username, password, email }) => {
    try {
      const response = await fetch('http://localhost:8082/health/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: '註冊失敗，請稍後再試' };
    }
  };

  // ✅ 登出
  const logout = async () => {
    await fetch('http://localhost:8082/health/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  // ✅ 初次進站，自動檢查 session 是否已登入
  useEffect(() => {
    fetch('http://localhost:8082/health/user', {
      credentials: 'include'
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.user) setUser(data.user);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
