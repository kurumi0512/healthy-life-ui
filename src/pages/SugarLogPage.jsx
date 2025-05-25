import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE = 'http://localhost:8082/rest/health/blood-sugar';

function SugarLogPage() {
  const [fasting, setFasting] = useState('');
  const [postMeal, setPostMeal] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState([]);
  const [warningMessages, setWarningMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_BASE, { withCredentials: true });
      setRecords(res.data);
    } catch (err) {
      console.error('❌ 查詢失敗', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async () => {
    const before = Number(fasting);
    const after = Number(postMeal);

    if (before < 0 || after < 0) {
      alert('❗ 餐前與餐後血糖不能為負數');
      return;
    }

    const warnings = [];
    if (before < 60 || before > 99) warnings.push('⚠️ 餐前血糖異常（60~99 mg/dL）');
    if (after < 60 || after > 139) warnings.push('⚠️ 餐後血糖異常（60~139 mg/dL）');

    setWarningMessages(warnings);
    if (warnings.length > 0) {
      setTimeout(() => {
        setWarningMessages([]);
      }, 5000);
    }

    const payload = { fasting: before, postMeal: after, recordDate, notes };

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post(API_BASE, payload, { withCredentials: true });
      }
      resetForm();
      fetchRecords();
    } catch (err) {
      console.error('❌ 儲存失敗', err);
    }
  };

  const resetForm = () => {
    setFasting('');
    setPostMeal('');
    setRecordDate('');
    setNotes('');
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setFasting(record.fasting);
    setPostMeal(record.postMeal);
    setRecordDate(record.recordDate);
    setNotes(record.notes || '');
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除這筆紀錄嗎？')) {
      try {
        await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
        fetchRecords();
      } catch (err) {
        console.error('❌ 刪除失敗', err);
      }
    }
  };

  const chartData = {
    labels: records.map(r => r.recordDate),
    datasets: [
      {
        label: '餐前血糖',
        data: records.map(r => r.fasting),
        borderColor: '#FF5733',
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: '餐後血糖',
        data: records.map(r => r.postMeal),
        borderColor: '#33A1FF',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">血糖紀錄</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="date" value={recordDate} onChange={e => setRecordDate(e.target.value)} className="input" />
        <input type="number" min="0" placeholder="餐前血糖" value={fasting} onChange={e => setFasting(e.target.value)} className="input" />
        <input type="number" min="0" placeholder="餐後血糖" value={postMeal} onChange={e => setPostMeal(e.target.value)} className="input" />
        <input type="text" placeholder="備註" value={notes} onChange={e => setNotes(e.target.value)} className="input" />
      </div>

      {warningMessages.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded mb-4">
          <ul className="list-disc pl-6 space-y-1">
            {warningMessages.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}

      <div className="flex gap-4 justify-center mb-6">
        <button onClick={handleSave} className="px-6 py-2 bg-green-200 text-green-800 rounded hover:bg-green-300 transition">
          {editingId ? '更新紀錄' : '儲存紀錄'}
        </button>
        {editingId && (
          <button onClick={resetForm} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
            取消編輯
          </button>
        )}
      </div>

      {records.length > 0 ? (
        <div className="mb-6 bg-gray-50 p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-2">血糖變化圖</h3>
          <Line data={chartData} />
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mb-6">目前尚無血糖紀錄，請新增一筆資料 📝</p>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">血糖紀錄列表</h3>
        <ul className="space-y-2">
          {records.slice(0, 5).map(record => (
            <li key={record.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                📅 {record.recordDate}｜餐前: {record.fasting}｜餐後: {record.postMeal} {record.notes && `｜備註: ${record.notes}`}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(record)} className="text-blue-600 hover:underline">編輯</button>
                <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:underline">刪除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>

    
  );
}

export default SugarLogPage;