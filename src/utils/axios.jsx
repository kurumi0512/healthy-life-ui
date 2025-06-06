import axios from 'axios';
import { toast } from 'react-toastify';

//建立實例
const instance = axios.create({
  baseURL: 'http://localhost:8082/rest/health',
  withCredentials: true
});

//設定攔截器
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      toast.error("登入已過期，請重新登入");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;