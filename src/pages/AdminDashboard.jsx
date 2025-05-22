import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛠️ 管理者後台</h1>
      <p className="mb-4">這是只有 ADMIN 可以看到的後台頁面。</p>

      <div className="space-y-2">
        <Link to="/admin/users" className="text-blue-600 underline">
          ➤ 使用者管理
        </Link>
        {/* 以後可加更多管理項目 */}
      </div>
    </div>
  );
}

export default AdminDashboard;