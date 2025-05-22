import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* 側邊欄 */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">後台選單</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block hover:underline">📊 管理首頁</Link>
          <Link to="/admin/users" className="block hover:underline">👥 使用者管理</Link>
          {/* 可擴充其他管理項目 */}
        </nav>
      </aside>

      {/* 主內容 */}
      <main className="flex-1 bg-white p-6">
        {children}
      </main>
    </div>
  );
}

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8082/rest/users', {
        credentials: 'include'
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      alert('載入使用者失敗：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這位使用者嗎？')) return;
    try {
      const res = await fetch(`http://localhost:8082/rest/user/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const result = await res.json();
      alert(result.message);
      fetchUsers();
    } catch (err) {
      alert('刪除失敗：' + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">👥 使用者管理</h1>
      {loading ? (
        <p>載入中...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">帳號</th>
              <th className="border px-3 py-2">姓名</th>
              <th className="border px-3 py-2">信箱</th>
              <th className="border px-3 py-2">狀態</th>
              <th className="border px-3 py-2">角色</th>
              <th className="border px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-2 py-1 text-center">{user.id}</td>
                <td className="border px-2 py-1">{user.username}</td>
                <td className="border px-2 py-1">{user.name}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1 text-center">{user.status}</td>
                <td className="border px-2 py-1 text-center">{user.role}</td>
                <td className="border px-2 py-1 text-center">
                  <button className="text-red-500 hover:underline" onClick={() => handleDelete(user.id)}>刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}

export default AdminUsersPage;