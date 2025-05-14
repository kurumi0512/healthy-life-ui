import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext'; // ⬅️ 加這行
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ⬅️ 包住 App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);