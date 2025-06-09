// src/components/weight/WeightTrendCard.jsx
import React from "react";

function WeightTrendCard({ records }) {
  if (records.length !== 7) return null;

  const weights = records.map((r) => r.weight);
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
  const change = weights[weights.length - 1] - weights[0];
  const percent = ((Math.abs(change) / weights[0]) * 100).toFixed(1);

  let trendMessage = "";

  if (Math.abs(change) <= 1) {
    trendMessage = `📊 最近 7 天體重穩定（平均 ${avg.toFixed(1)}kg）`;
  } else if (change < 0) {
    trendMessage = `📉 體重下降 ${Math.abs(change).toFixed(1)}kg（↓ ${percent}%），持續努力 👍`;
  } else {
    trendMessage = `📈 體重上升 ${change.toFixed(1)}kg（↑ ${percent}%），建議檢視飲食與作息`;
  }

  trendMessage += `（最高 ${max}kg，最低 ${min}kg）`;

  const trendIcon = trendMessage.includes("📉")
    ? "📉"
    : trendMessage.includes("📈")
    ? "📈"
    : "📊";

  const colorClass = trendIcon === "📉"
    ? "text-blue-500"
    : trendIcon === "📈"
    ? "text-red-500"
    : "text-green-600";

  return (
    <div className="mt-6 flex justify-center animate-fade-in-up">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-2xl ${colorClass}`}>{trendIcon}</span>
          <h4 className="text-lg font-bold text-gray-700">體重趨勢分析</h4>
        </div>
        <p className="text-gray-700">{trendMessage.replace(/^[📉📈📊]\s/, "")}</p>
      </div>
    </div>
  );
}

export default WeightTrendCard;