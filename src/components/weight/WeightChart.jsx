// src/components/weight/WeightChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";

function WeightChart({ records }) {
  const last10Records = records.slice(-10);
  const chartData = {
    labels: last10Records.map((r) => r.recordDate),
    datasets: [
      {
        label: "體重紀錄",
        data: last10Records.map((r) => r.weight),
        fill: false,
        borderColor: "#4caf50",
        tension: 0.1,
      },
    ],
  };

  if (records.length === 0) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">體重曲線圖</h3>
      <Line data={chartData} />
    </div>
  );
}

export default WeightChart;