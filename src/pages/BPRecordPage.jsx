import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function BPRecordPage() {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bpRecords, setBpRecords] = useState([]);

  // 儲存血壓紀錄
  const saveBpRecord = () => {
    if (systolic && diastolic) {
      const record = {
        systolic,
        diastolic,
        date: new Date().toLocaleDateString(),
      };
      setBpRecords([...bpRecords, record]);
      setSystolic('');
      setDiastolic('');
    }
  };

  // 曲線圖數據
  const chartData = {
    labels: bpRecords.map((record) => record.date), // x軸是日期
    datasets: [
      {
        label: '收縮壓',
        data: bpRecords.map((record) => record.systolic), // y軸是收縮壓
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: '舒張壓',
        data: bpRecords.map((record) => record.diastolic), // y軸是舒張壓
        fill: false,
        borderColor: '#33A1FF',
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">血壓紀錄</h1>

      {/* 輸入血壓區塊 */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">收縮壓 (mmHg)</label>
          <input
            type="number"
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
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入舒張壓"
          />
        </div>
        <div className="md:col-span-2 text-center">
          <button
           onClick={saveBpRecord}
           className="px-6 py-2 mt-4 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
          >
           儲存血壓紀錄
          </button>
        </div>
      </div>

      {/* 曲線圖顯示 */}
      {bpRecords.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800">血壓變化曲線圖</h3>
          <Line data={chartData} />
        </div>
      )}

      {/* 血壓紀錄顯示 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800">過往紀錄</h3>
        <ul className="list-disc pl-6 mt-4">
          {bpRecords.map((record, index) => (
            <li key={index} className="text-gray-600">
              {record.date}: {record.systolic}/{record.diastolic} mmHg
            </li>
          ))}
        </ul>
      </div>

      {/* 小插圖區塊 */}
      <div className="mt-8 text-center">
        <img
          src="/cat.png"
          alt="血壓紀錄"
          className="mx-auto w-80 rounded-lg shadow-none border-none"
        />
        <p className="mt-4 text-gray-600">保持健康的血壓，關注每一天！</p>
      </div>
    </div>
  );
}

export default BPRecordPage;