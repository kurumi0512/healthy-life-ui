import React from 'react';

function BPTrendCard({ trendMessage }) {
  return (
    <div className="mt-6 flex justify-center animate-fade-in-up">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-2xl ${
            trendMessage.includes('📈') ? 'text-green-500'
              : trendMessage.includes('📉') ? 'text-blue-500'
              : 'text-yellow-500'
          }`}>
            {trendMessage.includes('📈') ? '📈'
              : trendMessage.includes('📉') ? '📉'
              : '⚠️'}
          </span>
          <h4 className="text-lg font-bold text-gray-700">最近 7 天血壓趨勢分析</h4>
        </div>
        <p className="text-gray-700">{trendMessage.replace(/^[📈📉⚠️]\s/, '')}</p>
      </div>
    </div>
  );
}

export default BPTrendCard;