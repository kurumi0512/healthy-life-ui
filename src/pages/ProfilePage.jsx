import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    goal: '',
    height: '', 
    targetWeight: '',
    ageGroup: '',
    email: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
  fetch('http://localhost:8082/rest/profile', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      setForm({
        name: data.name || '',
        age: data.age || '',
        gender: data.gender || '',
        goal: data.goal || '',
        height: data.height ||'', 
        targetWeight: data.targetWeight || '',
        ageGroup: data.ageGroup || '',
        email: data.email || ''
      });
    });
}, []);

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // 自動設定年齡群組
    if (name === "age") {
      const ageNum = parseInt(value, 10);
      let ageGroup = "";

      if (ageNum >= 0 && ageNum <= 12) ageGroup = "兒童";
      else if (ageNum <= 19) ageGroup = "青少年";
      else if (ageNum <= 29) ageGroup = "青年";
      else if (ageNum <= 64) ageGroup = "壯年";
      else if (ageNum >= 65) ageGroup = "老年";

      updatedForm.ageGroup = ageGroup;
    }

    setForm(updatedForm);
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch('http://localhost:8082/rest/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })
      .then(() => {
        toast.success('更新成功！');
        setTimeout(() => {
          navigate('/weight');
        }, 5000); // 延遲 1.5 秒跳轉
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 pt-24 sm:p-8 max-w-md w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 text-blue-600">👤 使用者設定</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm sm:text-base">
          <div>
            <label className="block mb-1">姓名：</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">年齡：</label>
            <input
              name="age"
              type="number"
              min="0"
              max="100"
              value={form.age}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">性別：</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">請選擇</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">目標：</label>
            <select name="goal" value={form.goal} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">請選擇</option>
              <option value="減脂">減脂</option>
              <option value="增肌">增肌</option>
              <option value="維持">維持</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">身高（cm）：</label>
            <input
              name="height"
              type="number"
              min="0"
              value={form.height}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">目標體重：</label>
            <input
              name="targetWeight"
              type="number"
              min="0"
              value={form.targetWeight}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">年齡區間：</label>
            <input
              name="ageGroup"
              value={form.ageGroup}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">Email：</label>
            <input value={form.email} disabled className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4 transition"
          >
            💾 儲存
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;