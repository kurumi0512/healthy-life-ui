import React from "react";
import { Line } from "react-chartjs-2";

const SugarChart = ({ chartData }) => {
  if (!chartData || chartData.labels.length === 0) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-gray-800">血糖變化圖表</h3>
      <Line data={chartData} />
    </div>
  );
};

export default SugarChart;