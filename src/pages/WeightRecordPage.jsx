import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const WeightRecordPage = () => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [bmi, setBmi] = useState(null);
    const [bmiStatus, setBmiStatus] = useState("");
    const [weightRecords, setWeightRecords] = useState([]);

    const calculateBmi = () => {
        if (height && weight) {
            const bmiValue = weight / (height / 100) ** 2;
            setBmi(bmiValue);
            if (bmiValue < 18.5) setBmiStatus("過輕");
            else if (bmiValue < 24.9) setBmiStatus("正常");
            else setBmiStatus("過重");
        }
    };

    const saveWeightRecord = () => {
        if (weight) {
            setWeightRecords([
                ...weightRecords,
                { weight, date: new Date().toLocaleDateString() },
            ]);
        }
    };

    const chartData = {
        labels: weightRecords.map((record) => record.date),
        datasets: [
            {
                label: "體重紀錄",
                data: weightRecords.map((record) => record.weight),
                fill: false,
                borderColor: "#4caf50",
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                體重紀錄
            </h1>

            {/* BMI 計算區塊 */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium">
                        身高 (cm)
                    </label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="輸入身高"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium">
                        體重 (kg)
                    </label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="輸入體重"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium">
                        年齡
                    </label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="輸入年齡"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        onClick={calculateBmi}
                        className="w-full md:w-auto mt-4 px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition duration-300"
                    >
                        計算 BMI
                    </button>
                </div>
            </div>

            {/* BMI 計算結果 */}
            {bmi && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
                    <p className="text-xl font-semibold text-gray-800">
                        BMI: {bmi.toFixed(2)}
                    </p>
                    <p className="text-lg text-gray-600">
                        健康狀況:{" "}
                        <span className="font-semibold text-green-500">
                            {bmiStatus}
                        </span>
                    </p>
                </div>
            )}

            {/* 體重紀錄儲存按鈕（置中） */}
            <div className="mb-4 text-center">
                <button
                    onClick={saveWeightRecord}
                    className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
                >
                    儲存體重紀錄
                </button>
            </div>

            {/* 過往紀錄（靠左） */}
            <div className="mb-8 text-left">
                <h3 className="mt-6 text-xl font-semibold text-gray-800">
                    過往紀錄
                </h3>
                <ul className="list-disc pl-6 mt-4">
                    {weightRecords.map((record, index) => (
                        <li key={index} className="text-gray-600">
                            {record.date}: {record.weight} kg
                        </li>
                    ))}
                </ul>
            </div>

            {/* 顯示曲線圖 */}
            {weightRecords.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800">
                        體重曲線圖
                    </h3>
                    <Line data={chartData} />
                </div>
            )}

            {/* 小插圖區塊 */}
            <div className="mt-8 text-center">
                <img
                    src="/panda.png"
                    alt="熊貓加油"
                    className="mx-auto w-80 rounded-lg shadow-none"
                />
                <p className="mt-4 text-gray-600">
                    保持健康的體重，邁向更好的生活！
                </p>
            </div>
        </div>
    );
};

export default WeightRecordPage;
