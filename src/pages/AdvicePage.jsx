import React, { useState } from "react";

function AdvicePage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("減重");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdvice("");
    setLoading(true);

    const url = `http://localhost:8082/rest/health/advice-stream?height=${height}&weight=${weight}&age=${age}&goal=${goal}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const chars = event.data.split("");
      let index = 0;

      const typeChar = () => {
        if (index < chars.length) {
          setAdvice((prev) => prev + chars[index]);
          index++;
          setTimeout(typeChar, 15);
        }
      };

      typeChar();
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
      setLoading(false);
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
      setLoading(false);
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">AI 建議結果：</h3>
        <div className="whitespace-pre-wrap border border-gray-300 rounded p-4 min-h-[150px] bg-gray-50">
          {advice}
        </div>
      </div>
    </div>
  );
}

export default AdvicePage;