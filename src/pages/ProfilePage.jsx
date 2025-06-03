import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    birthDate: '', // yyyy-MM-dd 字串
    gender: '',
    goal: '',
    height: '', 
    targetWeight: '',
    ageGroup: '',
    email: ''
  });

  const navigate = useNavigate();

  // 計算年齡
  const calculateAge = (birthDateStr) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    fetch('http://localhost:8082/rest/profile', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || '',
          birthDate: data.birthDate || '',
          gender: data.gender || '',
          goal: data.goal || '',
          height: data.height || '', 
          targetWeight: data.targetWeight || '',
          ageGroup: data.ageGroup || '',
          email: data.email || ''
        });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === "birthDate") {
      const age = calculateAge(value);
      let ageGroup = "";

      if (age >= 0 && age <= 12) ageGroup = "兒童";
      else if (age <= 19) ageGroup = "青少年";
      else if (age <= 29) ageGroup = "青年";
      else if (age <= 64) ageGroup = "壯年";
      else if (age >= 65) ageGroup = "老年";

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
        }, 1500);
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
            <label className="block mb-1">出生年月日：</label>
            <DatePicker
              selected={form.birthDate ? new Date(form.birthDate) : null}
              onChange={(date) => {
                const isoString = date.toISOString().split('T')[0];
                handleChange({ target: { name: "birthDate", value: isoString } });
              }}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              placeholderText="請選擇生日"
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
