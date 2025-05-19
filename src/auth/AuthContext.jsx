import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔹 登入：呼叫後端 /rest/login
  const login = async ({ username, password }) => {
    try {
      const response = await fetch('http://localhost:8082/rest/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.user); // 將使用者名稱寫入 context
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (e) {
      return { success: false, message: '連線失敗' };
    }
  };

  // 🔹 登出
  const logout = async () => {
    await fetch('http://localhost:8082/rest/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  // 🔹 一進入網站就檢查是否已登入
  useEffect(() => {
    fetch('http://localhost:8082/rest/user', {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);