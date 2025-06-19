import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // 儲存登入者資料
  const [loading, setLoading] = useState(true); //登入狀態載入中

  //  登入：帳密 + 驗證碼
  const login = async ({ username, password, captcha }) => {
  try {
    const response = await fetch('http://localhost:8082/rest/health/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, captcha })
    });

    const result = await response.json();

    if (response.ok) {
      console.log("登入成功，後端回傳 user：", result.user);
      setUser(result.user);

      // 登入成功後再次確認登入者資訊
      try {
        const checkRes = await fetch('http://localhost:8082/rest/health/user', {
          credentials: 'include'
        });

        if (checkRes.ok) {
          const userData = await checkRes.json();
          console.log("二次確認登入身分成功：", userData);
          setUser(userData.user);
        } else {
          console.warn("登入後 /user 回傳失敗");
        }
      } catch (err) {
        console.error("登入後確認 /user 時發生錯誤", err);
      }

      return { success: true, user: result.user };
    } else {
      toast.error(result.message || '登入失敗'); // 加上 toast 提示
      return { success: false, message: result.message };
    }
  } catch (error) {
    toast.error('登入失敗，請稍後再試'); // 加上錯誤提示
    return { success: false, message: '登入失敗，請稍後再試' };
  }
};

  // 註冊（觸發後端發送 email 驗證）
  const register = async ({ username, password, confirmPassword, email }) => {
  try {
    const response = await fetch(
      'http://localhost:8082/rest/health/register',
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        // 把 confirmPassword 也一起送給後端
        body: JSON.stringify({ username, password, confirmPassword, email })
      }
    );

    const result = await response.json();
    return response.ok
      ? { success: true, message: result.message }
      : { success: false, message: result.message };
  } catch (error) {
    return { success: false, message: '註冊失敗，請稍後再試' };
  }
};

  // 登出
  const logout = async () => {
    await fetch('http://localhost:8082/rest/health/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  // 初次進站，自動檢查 session 是否已登入
    useEffect(() => {
      fetch('http://localhost:8082/rest/health/user', {
        credentials: 'include'
      })
        .then(res => {
          if (!res.ok) throw new Error("未登入");
          return res.json();
        })
        .then(data => {
          console.log("目前登入狀態", data);
          if (data?.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        })
        .catch(err => {
          console.log("尚未登入或 session 已失效");
          setUser(null);
        })
        .finally(() => {
          setLoading(false); // 畫面跳離「載入中...」
        });
    }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);