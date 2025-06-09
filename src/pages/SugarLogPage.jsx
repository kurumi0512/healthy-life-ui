import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { filterAndLimitNotes } from '../utils/filterBadWords';
import SugarForm from "../components/sugar/SugarForm";
import SugarChart from "../components/sugar/SugarChart";
import SugarTrendCard from "../components/sugar/SugarTrendCard";
import SugarRecordList from "../components/sugar/SugarRecordList";



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
  const [showCongrats, setShowCongrats] = useState(false);
  const [lastRecordDate, setLastRecordDate] = useState(null);
  const [showHealthTip, setShowHealthTip] = useState(false);
  const [analysisTarget, setAnalysisTarget] = useState('fasting');
  const formRef = useRef(null);

  useEffect(() => {
    fetchRecords();
    fetchLastRecordDate();
    const today = new Date().toISOString().split('T')[0];
    setRecordDate(today);
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}`, { withCredentials: true });
      setRecords(res.data);
    } catch (err) {
      console.error('查詢失敗', err);
    }
  };

  const handleNoteChange = (e) => {
    const result = filterAndLimitNotes(e.target.value);
    setNotes(result.text); // 更新備註內容

    if (result.modified) {
      toast.warn("⚠️ 備註含有不當字詞或過長，已自動處理", {
        toastId: "note-warning"
      });
    }
  };

  const fetchLastRecordDate = async () => {
    try {
      const res = await axios.get(`${API_BASE}/latest`, { withCredentials: true });
      setLastRecordDate(res.data?.data?.recordDate);
    } catch (err) {
      console.error("查詢最後紀錄失敗", err);
    }
  };

 const loadLastSugarRecord = async () => {
    try {
      const res = await axios.get(`${API_BASE}/latest`, { withCredentials: true });
      const last = res.data?.data;
      toast.dismiss();

      if (last) {
        setFasting(last.fasting.toString());
        setPostMeal(last.postMeal.toString());
        setNotes(last.notes || '');
        console.log("已載入上一筆血糖紀錄");
      } else {
        console.log("尚無上一筆紀錄可供複製");
      }

    } catch (err) {
      console.error("載入上一筆血糖紀錄失敗", err);
    }
  };

  const saveSugarRecord = async () => {
    const fastingValue = parseFloat(fasting);
    const postMealValue = parseFloat(postMeal);

    toast.dismiss();

    if (
      isNaN(fastingValue) || isNaN(postMealValue) ||
      fastingValue < 30 || fastingValue > 250 ||
      postMealValue < 30 || postMealValue > 250
    ) {
      toast.error('餐前/餐後血糖應介於 30～250 mg/dL 之間', { toastId: 'range-error' });
      return;
    }

    if (notes.length > 50) {
      toast.error('備註最多 50 字', { toastId: 'note-limit' });
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
      await fetchLastRecordDate();

      setTimeout(() => setShowCongrats(true), 500);
      setTimeout(() => setShowCongrats(false), 3000);
      setTimeout(() => setShowHealthTip(true), 2000);
      setTimeout(() => setShowHealthTip(false), 20000);
      setTimeout(() => clearForm(), 25000);

      toast.success(editingId ? "血糖紀錄更新成功" : "血糖紀錄儲存成功", { toastId: 'save-success',autoClose: 2000});
    } catch (err) {
      console.error('儲存失敗', err);
    }
  };

  const clearForm = () => {
    setFasting('');
    setPostMeal('');
    setRecordDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setEditingId(null);
    setWarningMessages([]);
  };

  const handleEdit = (record) => {
    setFasting(record.fasting);
    setPostMeal(record.postMeal);
    setRecordDate(record.recordDate);
    setNotes(record.notes || '');
    setEditingId(record.recordId);
    // 👇 編輯時自動滑到上方表單
    if (formRef.current) {
      const topOffset = formRef.current.getBoundingClientRect().top + window.pageYOffset - 170;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
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

  const handleDelete = (id) => {
    confirmAlert({
      title: '刪除確認',
      message: '確定要刪除這筆紀錄嗎？',
      buttons: [
        {
          label: '確定',
          onClick: async () => {
            try {
              await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
              await fetchRecords();
              await fetchLastRecordDate();
              toast.dismiss();
              toast.success('已成功刪除紀錄');
            } catch (err) {
              console.error('刪除失敗', err);
              toast.dismiss();
              toast.error('刪除失敗，請稍後再試');
            }
          }
        },
        {
          label: '取消',
          onClick: () => {
            // 使用者取消，不做任何事
          }
        }
      ]
    });
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

  const recentRecords = [...records]
      .sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate))
      .slice(-7);

    let sugarTrendMessage = '';
    if (recentRecords.length === 7) {
      const values = recentRecords.map(r => r[analysisTarget]);
      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const delta = values[0] - values[values.length - 1]; // 差值
      const percent = ((Math.abs(delta) / values[0]) * 100).toFixed(1);

      if (max - min <= 5) {
        sugarTrendMessage = `📈 最近 7 天${analysisTarget === 'fasting' ? '餐前' : '餐後'}血糖穩定`;
      } else if (values[0] > values[values.length - 1]) {
        sugarTrendMessage = `📉 ${analysisTarget === 'fasting' ? '餐前' : '餐後'}血糖有下降趨勢（↓ ${percent}%）`;
      } else {
        sugarTrendMessage = `⚠️ ${analysisTarget === 'fasting' ? '餐前' : '餐後'}血糖變化波動較大`;
      }

      sugarTrendMessage += `（平均：${avg.toFixed(1)}，最高：${max}，最低：${min}）`;
    }



  return (
        <div className="max-w-4xl mx-auto mt-5 p-8 pt-24 bg-white rounded-lg shadow-lg">
          <ToastContainer />
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">血糖紀錄</h1>

          {lastRecordDate ? (
      (() => {
        const lastDate = new Date(lastRecordDate);
        const today = new Date();
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        return (
          <div className="text-sm mb-4 text-center">
            <p className={diffDays >= 3 ? "text-red-500" : "text-gray-500"}>
              {diffDays >= 3
                ? `⏰ 已超過 ${diffDays} 天未填寫，記得定期紀錄！`
                : `🕰️ 上次紀錄：${lastRecordDate.replace(/-/g, "/")}`}
            </p>
          </div>
        );
      })()
    ) : null}   

    <div className="text-right mb-4">
      <button
        onClick={loadLastSugarRecord}
        className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold py-2 px-4 rounded shadow-sm transition"
      >
        🔁 複製上一筆紀錄
      </button>
    </div>
      
      {/* 表單區塊 */}
      <SugarForm
        ref={formRef}
        fasting={fasting}
        postMeal={postMeal}
        recordDate={recordDate}
        notes={notes}
        editingId={editingId}
        onChange={(e) => {
          const { name, value } = e.target;
          if (name === 'fasting') setFasting(value);
          if (name === 'postMeal') setPostMeal(value);
          if (name === 'recordDate') setRecordDate(value);
        }}
        onNoteChange={handleNoteChange}
        onSave={saveSugarRecord}
        onCancel={clearForm}
      />

      {/* AI 健康提示區塊
      {warningMessages.length > 0 && (
        <div className="mt-4 p-4 bg-white border rounded-lg shadow-md">
          <h4 className="font-semibold text-gray-800 mb-2">🧠 健康狀態建議</h4>
          <ul className="space-y-1 text-sm leading-relaxed">
            {warningMessages.map((msg, i) => (
              <li key={i} className={`${msg.color} flex items-center`}>
                <span className="mr-2">{msg.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )} */}

      {/* 圖表區 */}
      <SugarChart chartData={chartData} />

      <div className="mb-6"></div>

      {records.length >= 7 && (
        <SugarTrendCard
          sugarTrendMessage={sugarTrendMessage}
          analysisTarget={analysisTarget}
          setAnalysisTarget={setAnalysisTarget}
        />
      )}

      <div className="mb-6"></div>

      {/* 紀錄列表 */}
      <SugarRecordList
        records={records}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showAll={showAll}
        setShowAll={setShowAll}
      />


      {/* {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-in-up">
          <div className="w-60 h-60 bg-white rounded-full shadow-xl p-4 flex flex-col items-center justify-center">
            <img src="/inu1.png" alt="鼓勵圖" className="w-32 h-32 object-contain" />
            <p className="text-lg font-bold text-green-600 mt-2 text-center">你很棒❣️持續努力💪</p>
          </div>
        </div>
      )} */}

     {showHealthTip && warningMessages.length > 0 && (
      <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 border-l-4 border-yellow-400 w-80 z-50">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-600">📢 健康提醒</h4>
          <button onClick={() => setShowHealthTip(false)} className="text-gray-500 hover:text-gray-700">✖</button>
        </div>
        <ul className="mt-1 text-sm text-gray-800 space-y-1">
          {warningMessages.map((msg, i) => (
            <li key={i} className="text-gray-800">{msg.message}</li>
          ))}
        </ul>
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
