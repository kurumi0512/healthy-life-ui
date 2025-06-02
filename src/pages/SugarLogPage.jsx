import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE = 'http://localhost:8082/rest/health/blood-sugar';

function SugarLogPage() {
  const [fasting, setFasting] = useState('');
  const [postMeal, setPostMeal] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [warningMessages, setWarningMessages] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8082/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ STOMP 已連線");

        client.subscribe('/user/queue/alerts', (message) => {
          toast.warning('📢 系統通知：' + message.body);
        });
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}`, {
        withCredentials: true
      });
      setRecords(res.data);
    } catch (err) {
      console.error('查詢失敗', err);
    }
  };

  const saveSugarRecord = async () => {
    const fastingValue = parseFloat(fasting);
    const postMealValue = parseFloat(postMeal);

    if (
      isNaN(fastingValue) || isNaN(postMealValue) ||
      fastingValue < 30 || fastingValue > 250 ||
      postMealValue < 30 || postMealValue > 250
    ) {
      toast.error('❌ 餐前/餐後血糖應介於 30～250 mg/dL 之間');
      return;
    }

    if (notes.length > 50) {
      toast.error('❗備註最多 50 字');
      return;
    }

    const warnings = getSugarStatusFromValues(fastingValue, postMealValue);
    setWarningMessages(warnings);

    const payload = {
      fasting: fastingValue,
      postMeal: postMealValue,
      recordDate: recordDate || new Date().toISOString().split('T')[0],
      notes
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, payload, { withCredentials: true });
        setEditingId(null);
      } else {
        await axios.post(API_BASE, payload, { withCredentials: true });
      }

      await fetchRecords();
      setTimeout(() => clearForm(), 5000);
    } catch (err) {
      console.error('儲存失敗', err);
    }
  };

  const clearForm = () => {
    setFasting('');
    setPostMeal('');
    setRecordDate('');
    setNotes('');
    setEditingId(null);
    setWarningMessages([]);
  };

  const handleEdit = (record) => {
    setFasting(record.fasting);
    setPostMeal(record.postMeal);
    setRecordDate(record.recordDate);
    setNotes(record.notes || '');
    setEditingId(record.id);
  };

  const getSugarStatusFromValues = (fasting, postMeal) => {
    const results = [];

    if (fasting >= 126) {
      results.push({ message: '❗ 餐前血糖達糖尿病標準（≧126 mg/dL）', color: 'text-red-600' });
    } else if (fasting >= 100) {
      results.push({ message: '⚠️ 餐前血糖為糖尿病前期（100～125 mg/dL）', color: 'text-yellow-500' });
    } else if (fasting >= 70) {
      results.push({ message: '✅ 餐前血糖正常（70～99 mg/dL）', color: 'text-green-600' });
    } else if (fasting > 0) {
      results.push({ message: '⚠️ 餐前血糖過低，請注意是否有低血糖反應', color: 'text-orange-500' });
    }

    if (postMeal >= 200) {
      results.push({ message: '❗ 餐後血糖達糖尿病標準（≧200 mg/dL）', color: 'text-red-600' });
    } else if (postMeal >= 140) {
      results.push({ message: '⚠️ 餐後血糖為糖尿病前期（140～199 mg/dL）', color: 'text-yellow-500' });
    } else if (postMeal >= 80) {
      results.push({ message: '✅ 餐後血糖正常（80～139 mg/dL）', color: 'text-green-600' });
    } else if (postMeal > 0) {
      results.push({ message: '⚠️ 餐後血糖過低，請注意是否有低血糖反應', color: 'text-orange-500' });
    }

    return results;
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除這筆紀錄嗎？')) {
      try {
        await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
        await fetchRecords();
      } catch (err) {
        console.error('刪除失敗', err);
      }
    }
  };

  const latest10 = [...records].slice(-10);

  const chartData = {
    labels: latest10.map((r) => r.recordDate),
    datasets: [
      {
        label: '餐前血糖',
        data: latest10.map((r) => r.fasting),
        borderColor: '#4caf50',
        fill: false,
        tension: 0.1
      },
      {
        label: '餐後血糖',
        data: latest10.map((r) => r.postMeal),
        borderColor: '#f44336',
        fill: false,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-8 pt-24 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">血糖紀錄</h1>

      {/* 表單區塊 */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">記錄日期</label>
          <input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">餐前血糖 (mg/dL)</label>
          <input
            type="number"
            min="30"
            max="250"
            value={fasting}
            onChange={(e) => setFasting(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入餐前血糖"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">餐後血糖 (mg/dL)</label>
          <input
            type="number"
            min="30"
            max="250"
            value={postMeal}
            onChange={(e) => setPostMeal(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入餐後血糖"
          />
        </div>
      </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-medium">備註（可選）</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="例如：今天有哪裡比較不舒服嗎?或是狀況一切ok。"
          />
        </div>
        <div className="md:col-span-2 text-center space-x-2">
          <button
            onClick={saveSugarRecord}
            className="px-6 py-2 mt-4 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
          >
            {editingId ? '更新血糖紀錄' : '儲存血糖紀錄'}
          </button>
          {editingId && (
            <button
              onClick={clearForm}
              className="px-6 py-2 mt-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              取消編輯
            </button>
          )}
        </div>
      </div>

      {/* 警告訊息 */}
      {warningMessages.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-sm p-4 mb-6 rounded space-y-1">
          {warningMessages.map((msg, i) => (
            <p key={i} className={msg.color}>{msg.message}</p>
          ))}
        </div>
      )}

      {/* 圖表區 */}
      {records.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800">血糖變化圖表</h3>
          <Line data={chartData} />
        </div>
      )}

      {/* 紀錄列表 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">最近紀錄</h3>
        {records.length === 0 ? (
          <p className="text-gray-500 text-center">尚無紀錄，請新增資料 📝</p>
        ) : (
          <div className="space-y-4">
            {(showAll ? records.slice(0, 15) : records.slice(0, 5)).map((r, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-800 font-semibold">{r.recordDate}</p>
                  <p className="text-sm text-gray-600">餐前血糖：{r.fasting}、餐後血糖：{r.postMeal}</p>
                  {r.notes && <p className="text-sm text-gray-500">備註：{r.notes}</p>}
                </div>
                <div className="text-sm text-right space-x-2">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline">編輯</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">刪除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {records.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline"
          >
            {showAll ? '顯示較少' : '顯示更多（最多 15 筆）'}
          </button>
          {showAll && records.length > 15 && (
            <p className="text-sm text-gray-400 mt-1">⚠️ 僅顯示最新 15 筆資料</p>
          )}
        </div>
      )}

      {/* 插圖 */}
      <div className="mt-8 text-center">
        <img src="/fight.png" alt="血糖紀錄" className="mx-auto w-80 rounded-lg" />
        <p className="mt-4 text-gray-600">關注血糖變化，邁向更健康的生活！</p>
      </div>
    </div>
  );
}

export default SugarLogPage;
