import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    goal: '',
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
      .then(data => setForm(data));
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
        alert('更新成功！');
        navigate('/Weight'); // ✅ 儲存後導向體重紀錄
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">使用者設定</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>姓名：</label>
          <input name="name" value={form.name} onChange={handleChange} className="border p-1" />
        </div>
        <div>
          <label>年齡：</label>
          <input
            name="age"
            type="number"
            min="0"
            max="100"
            value={form.age}
            onChange={handleChange}
            className="border p-1"
          />
        </div>
        <div>
          <label>性別：</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="border p-1">
            <option value="">請選擇</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div>
          <label>目標：</label>
          <select name="goal" value={form.goal} onChange={handleChange} className="border p-1">
            <option value="">請選擇</option>
            <option value="減脂">減脂</option>
            <option value="增肌">增肌</option>
            <option value="維持">維持</option>
          </select>
        </div>
        <div>
          <label>目標體重：</label>
          <input
            name="targetWeight"
            type="number"
            min="0"
            value={form.targetWeight}
            onChange={handleChange}
            className="border p-1"
          />
        </div>
        <div>
          <label>年齡區間：</label>
          <input name="ageGroup" value={form.ageGroup} disabled className="border p-1 bg-gray-100" />
        </div>
        <div>
          <label>Email：</label>
          <input value={form.email} disabled className="border p-1 bg-gray-100" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">儲存</button>
      </form>
    </div>
  );
}

export default ProfilePage;