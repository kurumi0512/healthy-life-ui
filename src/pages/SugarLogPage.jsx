import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function SugarLogPage() {
  const [beforeMeal, setBeforeMeal] = useState('');
  const [afterMeal, setAfterMeal] = useState('');
  const [sugarRecords, setSugarRecords] = useState([]);

  // 儲存血糖紀錄
  const saveSugarRecord = () => {
    if (beforeMeal && afterMeal) {
      const record = {
        beforeMeal,
        afterMeal,
        date: new Date().toLocaleDateString(),
      };
      setSugarRecords([...sugarRecords, record]);
      setBeforeMeal('');
      setAfterMeal('');
    }
  };

  // 曲線圖數據
  const chartData = {
    labels: sugarRecords.map((record) => record.date), // x軸是日期
    datasets: [
      {
        label: '餐前血糖',
        data: sugarRecords.map((record) => record.beforeMeal), // y軸是餐前血糖值
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: '餐後血糖',
        data: sugarRecords.map((record) => record.afterMeal), // y軸是餐後血糖值
        fill: false,
        borderColor: '#33A1FF',
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">血糖紀錄</h1>

      {/* 輸入血糖區塊 */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">餐前血糖 (mg/dL)</label>
          <input
            type="number"
            value={beforeMeal}
            onChange={(e) => setBeforeMeal(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入餐前血糖"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">餐後血糖 (mg/dL)</label>
          <input
            type="number"
            value={afterMeal}
            onChange={(e) => setAfterMeal(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入餐後血糖"
          />
        </div>
      </div>

      {/* 儲存按鈕置中 */}
      <div className="flex justify-center mb-6">
        <button
          onClick={saveSugarRecord}
          className="w-auto px-6 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
        >
          儲存血糖紀錄
        </button>
      </div>

      {/* 曲線圖顯示 */}
      {sugarRecords.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800">血糖變化曲線圖</h3>
          <Line data={chartData} />
        </div>
      )}

      {/* 血糖紀錄顯示 */}
      <div>
        <img
          src="/clover.png"
          alt="中間線"
          className="mx-auto rounded-lg shadow-none border-none"
        />
        <h3 className="text-xl font-semibold text-gray-800">過往紀錄</h3>
        <ul className="list-disc pl-6 mt-4">
          {sugarRecords.map((record, index) => (
            <li key={index} className="text-gray-600">
              {record.date}: 餐前血糖 {record.beforeMeal} mg/dL，餐後血糖 {record.afterMeal} mg/dL
            </li>
          ))}
        </ul>
      </div>

      {/* 小插圖區塊 */}
      <div className="mt-8 text-center">
        <img
          src="/fight.png"
          alt="血糖紀錄"
          className="mx-auto w-90 rounded-lg shadow-none border-none"
        />
        <p className="mt-4 text-gray-600">保持健康的血糖，關注每一天！</p>
      </div>
    </div>
  );
}

export default SugarLogPage;
