import React from "react";

const SugarTrendCard = ({ sugarTrendMessage, analysisTarget, setAnalysisTarget }) => {
  if (!sugarTrendMessage) return null;

  const icon = sugarTrendMessage.includes('📈')
    ? '📈'
    : sugarTrendMessage.includes('📉')
    ? '📉'
    : '⚠️';

  const iconColor = sugarTrendMessage.includes('📈')
    ? 'text-green-500'
    : sugarTrendMessage.includes('📉')
    ? 'text-blue-500'
    : 'text-yellow-500';

  return (
    <div className="mt-6 flex justify-center animate-fade-in-up">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${iconColor}`}>{icon}</span>
            <h4 className="text-lg font-bold text-gray-700">血糖趨勢分析</h4>
          </div>

          {/* 下拉選單 */}
          <select
            value={analysisTarget}
            onChange={(e) => setAnalysisTarget(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="fasting">分析：餐前血糖</option>
            <option value="postMeal">分析：餐後血糖</option>
          </select>
        </div>

        <p className="text-gray-700">{sugarTrendMessage.replace(/^[📈📉⚠️]\s/, '')}</p>
      </div>
    </div>
  );
};

export default SugarTrendCard;