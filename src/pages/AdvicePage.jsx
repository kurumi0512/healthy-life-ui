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

  const handleSubmit = (e) => {
  e.preventDefault(); // 防止表單刷新

  if (!height || !weight || !age || !goal) {
    toast.error("請填寫完整的身高、體重、年齡與健康目標");
    return;
  }

  setAdvice("");
  setLoading(true);

  const url = `http://localhost:8082/rest/health/healthAI/advice-stream?height=${height}&weight=${weight}&age=${age}&goal=${goal}`;
  console.log("送出的請求 URL：", url);

  // 使用 EventSourcePolyfill 串接 SSE API（並允許傳送 cookie）
  const eventSource = new EventSourcePolyfill(url, {
    withCredentials: true
  });

  let fullText = "";

  eventSource.onmessage = (event) => {
    const data = event.data;

    if (!data || data === "undefined") return;

    if (data === "[DONE]") {
      eventSource.close(); //關閉連線
      setLoading(false);
      return;
    }

    // 將句點後的•前加上換行（處理 Markdown 格式）
    const formattedData = data
      .replace(/•/g, '\n\n•')       // 段落開頭前先換行
      .replace(/\n/g, '\n\n');      // 再保險一層處理 \n -> \n\n

    setAdvice((prev) => prev + formattedData);
  };

  eventSource.onerror = (err) => {
    console.error("SSE error:", err);
    eventSource.close();
    setLoading(false);
  };

  // 第二階段：打字機效果
  const typeCharByChar = (text) => {
  const lines = text.split('\n'); // ⬅️ 拆成一行一行
    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = '';

    const typeNextChar = () => {
      if (lineIndex >= lines.length) {
        setLoading(false); // 播完後關閉 loading
        return;
      }

      const line = lines[lineIndex];
      if (charIndex < line.length) {
        currentLine += line[charIndex];
        charIndex++;
        setAdvice((prev) => prev + line[charIndex - 1]); // 加入目前字元
        setTimeout(typeNextChar, 20);
      } else {
        // 行結束，加上換行，處理下一行
        setAdvice((prev) => prev + '\n\n');
        lineIndex++;
        charIndex = 0;
        currentLine = '';
        setTimeout(typeNextChar, 300); // 換行延遲
      }
    };

    typeNextChar();
  };
};
  return (
    <div className="max-w-xl mx-auto p-6 pt-24">
      <h2 className="text-2xl font-bold mb-4 text-center">AI 健康建議生成器</h2>

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
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "載入中..." : "取得 AI 建議"}
        </button>
      </form>

      {loading && (
        <div className="flex items-center space-x-2 mb-4">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span className="text-blue-600">AI 正在生成建議中...</span>
        </div>
      )}

      {!loading && advice && (
        <p className="text-green-600 mt-2">✅ AI 建議已完成</p>
      )}

      {/* ✅ 建議顯示區塊：請務必加上 */}
      {advice && (
        <div className="whitespace-pre-wrap break-words border border-gray-300 rounded p-4 bg-gray-50 max-h-[600px] overflow-y-auto leading-relaxed text-[15px]">
          <ReactMarkdown>{advice}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default AdvicePage;