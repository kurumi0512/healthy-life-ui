import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { filterAndLimitNotes } from '../utils/filterBadWords';

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
  const [lastRecordDate, setLastRecordDate] = useState(null);
  const [showHealthTip, setShowHealthTip] = useState(false);
  const [showImmediateTip, setShowImmediateTip] = useState(false);
  const [bpStatus, setBpStatus] = useState({ message: '', color: '' });
  const formRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setRecordDate(today); // 設定預設日期
    fetchRecords();
    fetchLastRecordDate();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setRecordDate(today); // 設定預設日期
    fetchRecords();
    fetchLastRecordDate();
  }, []);

  const handleNoteChange = (e) => {
      const result = filterAndLimitNotes(e.target.value);
      setNotes(result.text); // 更新備註內容
  
      if (result.modified) {
        toast.warn("⚠️ 備註含有不當字詞或過長，已自動處理", {
          toastId: "note-warning"
        });
      }
    };
  
  const recentRecords = [...bpRecords]
  .sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate))
  .slice(-7);

  const systolicValues = recentRecords.map(r => r.systolic);
  const max = Math.max(...systolicValues);
  const min = Math.min(...systolicValues);
  const avg = systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length;

  let trendMessage = '';
  if (max - min <= 5) {
    trendMessage = '📈 最近 7 天血壓穩定，請持續保持！';
  } else if (systolicValues[0] > systolicValues[systolicValues.length - 1]) {
    trendMessage = '📉 最近 7 天血壓有下降趨勢，持續努力 👍';
  } else {
    trendMessage = '⚠️ 最近血壓變化較大，建議檢查作息與飲食';
  }

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
      await fetchLastRecordDate();
      clearForm();

      toast.success(editingId ? " 血壓紀錄更新成功" : " 血壓紀錄儲存成功", {
        autoClose: 2000
      });

      const abnormal = (sys > 140 || dia > 90 || sys < 90 || dia < 60);
      const currentStatus = getBPStatusFromValues(sys, dia);
      setBpStatus(currentStatus);

      if (abnormal) {
        // 延遲 1.2 秒才跳出右下角提醒
        setTimeout(() => {
          setShowHealthTip(true);
          setTimeout(() => setShowHealthTip(false), 10000); // 顯示 10 秒
        }, 1200);

        // 儲存成功才顯示紅字（即時狀態）
        setShowImmediateTip(true);
      } else {
        setShowImmediateTip(false);
      }

      setTimeout(() => setShowCongrats(false), 4000);
    } catch (err) {
      console.error('儲存血壓失敗', err);
      if (err.response?.data?.error) {
        toast.error(`❌ ${err.response.data.error}`);
      } else {
        toast.error("❌ 儲存失敗，請稍後再試");
      }
    }
  };

  const clearForm = () => {
    setSystolic('');
    setDiastolic('');
    setNotes('');
    setEditingId(null);
    setRecordDate(new Date().toISOString().split('T')[0]);
    setShowImmediateTip(false);  // 🧼 同步清掉紅字
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
              await fetchLastRecordDate();

              // ✅ 防止重複 toast
              toast.success('已成功刪除血壓紀錄', { toastId: 'bp-delete-success' });
            } catch (err) {
              console.error('刪除失敗', err);

              // ✅ 錯誤也設 id 避免堆疊
              toast.error('刪除失敗，請稍後再試', { toastId: 'bp-delete-fail' });
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
        color: 'text-gray-500'
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

  const fetchLastRecordDate = async () => {
    try {
      const res = await axios.get("http://localhost:8082/rest/health/bp/latest", {
        withCredentials: true,
      });
      const latest = res.data?.data;
      if (latest?.recordDate) {
        setLastRecordDate(latest.recordDate);
      } else {
        setLastRecordDate(null);
      }
    } catch (err) {
      console.error("查詢最後紀錄失敗", err);
    }
  };

  const loadLastBpRecord = async () => {
    try {
      const res = await axios.get("http://localhost:8082/rest/health/bp/latest", {
        withCredentials: true,
      });
      const last = res.data?.data;
      if (last) {
        setSystolic(last.systolic.toString());
        setDiastolic(last.diastolic.toString());
        setNotes(last.notes || '');
        console.log("✅ 已載入上一筆血壓紀錄");
      } else {
        console.log("ℹ️ 尚無上一筆紀錄可供複製");
      }
    } catch (err) {
      console.error("❌ 載入上一筆紀錄失敗", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-8 pt-24 bg-white rounded-lg shadow-lg">
      <ToastContainer position="top-right" autoClose={2000} limit={1} />
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">血壓紀錄</h1>


      {lastRecordDate && (() => {
        const last = new Date(lastRecordDate);
        const today = new Date();
        const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24));

        return (
          <div className="text-sm text-center text-gray-600 mb-2">
            <p className={diff >= 3 ? "text-red-500" : "text-gray-500"}>
              {diff >= 3
                ? `⏰ 已超過 ${diff} 天未填寫，記得定期紀錄！`
                : `🕰️ 上次紀錄：${lastRecordDate.replace(/-/g, "/")}`}
            </p>
          </div>
        );
      })()}

      <div className="text-right mb-2">
        <button
          onClick={loadLastBpRecord}
          className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold py-2 px-4 rounded shadow-sm transition"
        >
          🔁 複製上一筆紀錄
        </button>
      </div>

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
            onChange={handleNoteChange}
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

      {/* 即時判斷
      {showImmediateTip && status.message && (
        <div className={`text-sm px-3 py-2 rounded ${status.color} ${status.bgColor}`}>
          {status.message}
        </div>
      )} */}

      {/* 圖表區塊 */}
      {bpRecords.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800">血壓變化曲線圖</h3>
          <Line data={chartData} />
        </div>
      )}

      {/* ✅ 最近 7 天趨勢分析區塊 */}
      <div className="mt-6 flex justify-center animate-fade-in-up">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-2xl ${trendMessage.includes('📈') ? 'text-green-500' 
                                      : trendMessage.includes('📉') ? 'text-blue-500' 
                                      : 'text-yellow-500'}`}>
              {trendMessage.includes('📈') ? '📈' 
              : trendMessage.includes('📉') ? '📉' 
              : '⚠️'}
            </span>
            <h4 className="text-lg font-bold text-gray-700">最近 7 天血壓趨勢分析</h4>
          </div>
          <p className="text-gray-700">{trendMessage.replace(/^[📈📉⚠️]\s/, '')}</p>
        </div>
      </div>

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

        {/* ✅ 健康提醒元件放這邊 */}
        {showHealthTip && bpStatus.message && bpStatus.color !== 'text-green-400' && (
          <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 border-l-4 border-yellow-400 w-80 z-50 animate-fade-in-up">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-yellow-600">📢 健康提醒</h4>
              <button onClick={() => setShowHealthTip(false)} className="text-gray-500 hover:text-gray-700">✖</button>
            </div>
            <p className={`mt-1 text-sm ${bpStatus.color}`}>{bpStatus.message}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default BPRecordPage;