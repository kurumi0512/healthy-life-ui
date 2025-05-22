import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <div className="p-6 text-red-600 font-bold">您沒有權限存取此頁面。</div>;
  }

  return children;
}

export default AdminRoute;
