import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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

function BPRecordPage() {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [bpRecords, setBpRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAllBp, setShowAllBp] = useState(false);
  const [recordDate, setRecordDate] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setRecordDate(today); // 設定預設日期
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:8082/rest/health/bp', {
        withCredentials: true
      });
      setBpRecords(res.data.data);
    } catch (err) {
      console.error('查詢血壓紀錄失敗', err);
    }
  };

  const saveBpRecord = async () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    // ✅ 數值驗證：50~250
    if (isNaN(sys) || isNaN(dia) || sys < 50 || sys > 250 || dia < 50 || dia > 250) {
      toast.error("血壓數值需在 50～250 mmHg 範圍內");
      return;
    }

    if (notes.length > 50) {
      toast.error("備註最多 50 字");
      return;
    }

    const record = {
      systolic: sys,
      diastolic: dia,
      recordDate: recordDate || new Date().toISOString().split('T')[0],
      notes: notes.trim() === "" ? null : notes.trim()
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8082/rest/health/bp/${editingId}`, record, {
          withCredentials: true
        });
      } else {
        await axios.post('http://localhost:8082/rest/health/bp', record, {
          withCredentials: true
        });
      }

      await fetchRecords();
      clearForm();

      // ✅ 成功提示
      toast.success(editingId ? " 血壓紀錄更新成功" : " 血壓紀錄儲存成功");
      // 顯示鼓勵圖 2 秒
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 4000);
    } catch (err) {
      console.error('儲存血壓失敗', err);
    }
  };

  const clearForm = () => {
    setSystolic('');
    setDiastolic('');
    setNotes('');
    setEditingId(null);
    setRecordDate(new Date().toISOString().split('T')[0]); // ← 清除後也顯示今天
  };

  const handleEdit = (record) => {
    setSystolic(record.systolic);
    setDiastolic(record.diastolic);
    setNotes(record.notes || '');
    setRecordDate(record.recordDate);
    setEditingId(record.recordId);
    // 👇 編輯時自動滑到上方表單
    if (formRef.current) {
      const topOffset = formRef.current.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handleDelete = (recordId) => {
    confirmAlert({
      title: '刪除確認',
      message: '確定要刪除這筆紀錄嗎？',
      buttons: [
        {
          label: '確定',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8082/rest/health/bp/${recordId}`, {
                withCredentials: true
              });
              await fetchRecords();
              toast.success('已成功刪除血壓紀錄');
            } catch (err) {
              console.error('刪除失敗', err);
              toast.error(' 刪除失敗，請稍後再試');
            }
          }
        },
        {
          label: '取消',
          onClick: () => {
            // 使用者按取消，不做任何事
          }
        }
      ]
    });
  };

  const getBPStatusFromValues = (sys, dia) => {
    if (!sys || !dia) return { message: '', color: '' };

    if (sys > 140 || dia > 90) {
      return {
        message: '😰 血壓偏高，建議儘快就醫並調整作息',
        color: 'text-red-500'
      };
    } else if (sys >= 120 || dia >= 80) {
      return {
        message: '⚠️ 血壓略高，請持續注意飲食與壓力',
        color: 'text-yellow-500'
      };
    } else if (sys < 90 || dia < 60) {
      return {
        message: '🥴 血壓偏低，請補充水分並注意身體反應',
        color: 'text-orange-500'
      };
    } else {
      return {
        message: '🌿 血壓正常，請繼續保持良好生活習慣！',
        color: 'text-green-400'
      };
    }
  };

  const status = getBPStatusFromValues(systolic, diastolic);

  const latest10 = [...bpRecords].slice(-10);
  const chartData = {
    labels: latest10.map((record) => record.recordDate),
    datasets: [
      {
        label: '收縮壓',
        data: bpRecords.map((record) => record.systolic),
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1,
        borderWidth: 2
      },
      {
        label: '舒張壓',
        data: bpRecords.map((record) => record.diastolic),
        fill: false,
        borderColor: '#33A1FF',
        tension: 0.1,
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-8 pt-24 bg-white rounded-lg shadow-lg">
      <ToastContainer position="top-right" />
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">血壓紀錄</h1>

      {/* 表單區塊 */}
      <div ref={formRef} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">記錄日期</label>
          <input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">收縮壓 (mmHg)</label>
          <input
            type="number"
            min="50"
            max="250"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入收縮壓"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">舒張壓 (mmHg)</label>
          <input
            type="number"
            min="50"
            max="250"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入舒張壓"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-medium">備註（可選）</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="例如：頭暈、運動後量測..."
          />
        </div>
        <div className="md:col-span-2 text-center space-x-2">
          <button
            onClick={saveBpRecord}
            className="px-6 py-2 mt-4 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
          >
            {editingId ? '更新血壓紀錄' : '儲存血壓紀錄'}
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

      {/* 即時判斷 */}
      {status.message && (
        <div className={`text-sm px-3 py-2 rounded ${status.color} ${status.bgColor}`}>
          {status.message}
        </div>
      )}

      {/* 圖表區塊 */}
      {bpRecords.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800">血壓變化曲線圖</h3>
          <Line data={chartData} />
        </div>
      )}

      {/* 血壓紀錄顯示區塊 */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">血壓紀錄列表</h3>

        {bpRecords.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">尚無紀錄，請新增一筆血壓資料 🩺</p>
        ) : (
          <div className="space-y-4">
            {(showAllBp ? bpRecords.slice(0, 15) : bpRecords.slice(0, 5)).map((record, index) => {
              const status = getBPStatusFromValues(record.systolic, record.diastolic);
              return (
                <div
                  key={index}
                  className="flex justify-between items-start p-4 rounded-lg shadow border border-gray-200 bg-white transition-all duration-300 animate-fade-in"
                >
                  <div>
                    <div className="text-gray-800">
                      <p className="text-gray-800 font-semibold">{record.recordDate}</p>
                      <p className="text-sm text-gray-600">
                      收縮壓：{record.systolic}、舒張壓：{record.diastolic} mmHg
                      </p>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-1">備註：{record.notes}</p>
                    )}
                  </div>
                  <div className="text-sm text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => handleEdit(record)} className="text-blue-600 hover:underline">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(record.recordId)} className="text-red-600 hover:underline">
                      刪除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {bpRecords.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllBp(!showAllBp)}
              className="text-blue-600 hover:underline"
            >
              {showAllBp ? '顯示較少' : '顯示更多（最多 15 筆）'}
            </button>
            {showAllBp && bpRecords.length > 15 && (
              <p className="text-sm text-gray-400 mt-1">⚠️ 只顯示最新 15 筆紀錄</p>
            )}
          </div>
        )}

        {showCongrats && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="flex flex-col items-center bg-white rounded-xl p-4 shadow-xl animate-fade-in-up">
              <img src="/inu.png" alt="恭喜完成紀錄" className="w-32 h-32 object-contain" />
              <p className="text-green-600 font-bold text-base mt-2 text-center leading-snug break-words max-w-[160px]">
                做得好！繼續保持 💪
              </p>
            </div>
          </div>
        )}


        {/* 插圖 */}
        <div className="mt-8 text-center">
          <img src="/cat.png" alt="血壓紀錄" className="mx-auto w-80 rounded-lg" />
          <p className="mt-4 text-gray-600">保持健康的血壓，關注每一天！</p>
        </div>
      </div>
    </div>
  );
}

export default BPRecordPage;