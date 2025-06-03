import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { EventSourcePolyfill } from 'event-source-polyfill';
import { toast } from 'react-toastify';

function AdvicePage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("減重");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false); // 避免重複填入

  const handleAutoFill = async () => {
    if (filled) {
      toast.info("資料已載入，無需重複操作");
      return;
    }

    try {
      // 取得個人基本資料（身高、生日、目標）
      const profileRes = await fetch('http://localhost:8082/rest/profile', {
        credentials: 'include'
      });
      const profileData = await profileRes.json();

      if (profileData.birthDate) {
        const today = new Date();
        const birthDate = new Date(profileData.birthDate);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge.toString());
      }

      if (profileData.goal) setGoal(profileData.goal);
      if (profileData.height) setHeight(profileData.height.toString());

      // 取得最新體重紀錄
      const weightRes = await fetch('http://localhost:8082/rest/health/weight/latest', {
        credentials: 'include'
      });
      const weightData = await weightRes.json();
      if (weightData?.data?.weight) {
        setWeight(weightData.data.weight.toString());
      }

      setFilled(true);
      toast.success("已成功載入個人資料！");
    } catch (err) {
      console.error("載入失敗", err);
      toast.error("載入失敗，請重新登入");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!height || !weight || !age || !goal) {
      toast.error("請填寫完整的身高、體重、年齡與健康目標");
      return;
    }

    setAdvice("");
    setLoading(true);

    const url = `http://localhost:8082/rest/health/healthAI/advice-stream?height=${height}&weight=${weight}&age=${age}&goal=${goal}`;
    console.log("送出的請求 URL：", url);

    const eventSource = new EventSourcePolyfill(url, { withCredentials: true });

    eventSource.onmessage = (event) => {
      const data = event.data;
      if (!data || data === "undefined") return;

      if (data === "[DONE]") {
        eventSource.close();
        setLoading(false);
        return;
      }

      const formattedData = data
        .replace(/•/g, '\n\n•')
        .replace(/\n/g, '\n\n');

      setAdvice((prev) => prev + formattedData);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
      setLoading(false);
    };
  };

  return (
    <div className="max-w-xl mx-auto p-6 pt-24">
      <h2 className="text-2xl font-bold mb-4 text-center">AI 健康建議生成器</h2>

      {/* 一鍵載入個人資料 */}
      <div className="text-right mb-4">
        <button
          type="button"
          onClick={handleAutoFill}
          className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold py-2 px-4 rounded shadow-sm transition"
        >
          ☁️ 一鍵載入個人資料
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">身高 (cm)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">體重 (kg)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">年齡</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">健康目標</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="減重">減重（瘦身）</option>
            <option value="增肌">增肌（增加肌肉）</option>
            <option value="維持">維持（保持現況）</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-500"
          }`}
          disabled={loading}
        >
          {loading ? "載入中..." : "取得 AI 建議"}
        </button>
      </form>

      {loading && (
        <div className="flex items-center space-x-2 mb-4">
          <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-blue-600">AI 正在生成建議中...</span>
        </div>
      )}

      {!loading && advice && (
        <p className="text-green-600 mt-2">✅ AI 建議已完成</p>
      )}

      {advice && (
        <div className="whitespace-pre-wrap break-words border border-gray-300 rounded p-4 bg-gray-50 max-h-[600px] overflow-y-auto leading-relaxed text-[15px]">
          <ReactMarkdown>{advice}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default AdvicePage;