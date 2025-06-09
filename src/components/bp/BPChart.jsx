import React from 'react';
import { Line } from 'react-chartjs-2';

function BPChart({ chartData }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-gray-800">血壓變化曲線圖</h3>
      <Line data={chartData} />
    </div>
  );
}

export default BPChart;