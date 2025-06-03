import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const WeightRecordPage = () => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [bmi, setBmi] = useState(null);
    const [bmiStatus, setBmiStatus] = useState("");
    const [weightRecords, setWeightRecords] = useState([]);
    const [editingId, setEditingId] = useState(null); // 編輯中的紀錄 ID
    const [showAll, setShowAll] = useState(false); // ➕ 是否顯示全部
    const [recordDate, setRecordDate] = useState('');

    useEffect(() => {
        fetchRecentRecords();
    }, []);

    const fetchRecentRecords = async () => {
        try {
            const res = await axios.get("http://localhost:8082/rest/health/weight", {
            withCredentials: true,
            });
            setWeightRecords(res.data.data);
        } catch (err) {
            console.error("查詢失敗", err);
        }
    };

    const calculateBmi = () => {
        if (height && weight) {
            const bmiValue = weight / (height / 100) ** 2;
            setBmi(bmiValue);
            if (bmiValue < 18.5) setBmiStatus("過輕");
            else if (bmiValue < 24.9) setBmiStatus("正常");
            else setBmiStatus("過重");
        }
    };

    const saveWeightRecord = async () => {
        const heightCm = parseFloat(height);
        const weightKg = parseFloat(weight);
        const ageNum = parseInt(age);

        // ✅ 合理範圍檢查
        if (isNaN(heightCm) || isNaN(weightKg) || isNaN(ageNum)) {
            toast.error("身高、體重與年齡必須是數字");
            return;
        }
        if (heightCm < 50 || heightCm > 250) {
            toast.error("輸入合理的身高（50 ~ 250 cm）");
            return;
        }
        if (weightKg < 10 || weightKg > 300) {
            toast.error("請輸入合理的體重（10 ~ 300 kg）");
            return;
        }
        if (ageNum < 1 || ageNum > 120) {
            toast.error("請輸入合理的年齡（1 ~ 120 歲）");
            return;
        }

        const bmiValue = weightKg / ((heightCm / 100) ** 2);

        // 👇 以下為原本儲存邏輯
        try {
            const data = {
                height: heightCm,
                weight: weightKg,
                age: ageNum,
                bmi: bmiValue,
                recordDate: recordDate || new Date().toISOString().split("T")[0] // 預設今天
            };

            if (editingId) {
                await axios.put(`http://localhost:8082/rest/health/weight/${editingId}`, data, {
                    withCredentials: true,
                });
                setEditingId(null);
            } else {
                await axios.post("http://localhost:8082/rest/health/weight", data, {
                    withCredentials: true,
                });
            }

            await fetchRecentRecords();
            clearForm();
            toast.success(`✅ 已自動計算 BMI：${bmiValue.toFixed(2)} 並儲存成功`);
        } catch (err) {
            console.error("儲存失敗", err);
        }
    };

    const clearForm = () => {
        setHeight("");
        setWeight("");
        setAge("");
        setBmi(null);
        setBmiStatus("");
        setRecordDate('');
        setEditingId(null);
    };

    const handleEdit = (record) => {
        setHeight(record.height);
        setWeight(record.weight);
        setAge(record.age);
        setBmi(record.bmi);
        setRecordDate(record.recordDate);
        setEditingId(record.recordId); // 修正
    };

    const handleDelete = (id) => {
        confirmAlert({
            title: '刪除確認',
            message: '確定要刪除這筆紀錄嗎？',
            buttons: [
                {
                    label: '確定',
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:8082/rest/health/weight/${id}`, {
                                withCredentials: true,
                            });
                            await fetchRecentRecords();
                            toast.success("已成功刪除紀錄");
                        } catch (err) {
                            console.error("刪除失敗", err);
                            toast.error("刪除失敗，請稍後再試");
                        }
                    }
                },
                {
                    label: '取消',
                    onClick: () => {
                        // 不做事
                    }
                }
            ]
        });
    };

    const last10Records = weightRecords.slice(-10);
    const chartData = {
        labels: last10Records.map((record) => record.recordDate),
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
        <div className="max-w-4xl mx-auto mt-5 p-8 pt-24 bg-white rounded-lg shadow-lg">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">體重紀錄</h1>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium">記錄日期</label>
                    <input
                        type="date"
                        value={recordDate}
                        onChange={(e) => setRecordDate(e.target.value)}
                        className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium">身高 (cm)</label>
                    <input
                        type="number"
                        value={height}
                        min="50"
                        max="250"
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="輸入身高"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium">體重 (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        min="10"
                        max="150"
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="輸入體重"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium">年齡</label>
                    <input
                        type="number"
                        value={age}
                        min="10"
                        max="150"
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="輸入年齡"
                    />
                </div>
            </div>

            {bmi && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
                    <p className="text-xl font-semibold text-gray-800">BMI: {bmi.toFixed(2)}</p>
                    {/* <p className="text-lg text-gray-600">
                        健康狀況: <span className="font-semibold text-green-500">{bmiStatus}</span>
                    </p> */}
                </div>
            )}
            
            <div className="mb-4 text-center">
                <button
                    onClick={saveWeightRecord}
                    className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
                >
                    {editingId ? "更新體重紀錄" : "儲存體重紀錄"}
                </button>
                {editingId && (
                    <button
                        onClick={clearForm}
                        className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                        取消編輯
                    </button>
                )}
            </div>
            
            {weightRecords.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800">體重曲線圖</h3>
                    <Line data={chartData} />
                </div>
            )}


            <div className="mb-8 text-left">
                <h3 className="mt-6 text-xl font-semibold text-gray-800">體重紀錄列表</h3>

                {weightRecords.length === 0 ? (
                    <p className="text-gray-500 text-center mt-4">尚無紀錄，請新增一筆體重資料  📝</p>
                ) : (
                    <div className="space-y-4 mt-4">
                    {(showAll ? weightRecords.slice(0, 15) : weightRecords.slice(0, 5)).map((record, index) => {
                        const heightCm = parseFloat(record.height);
                        let bmi = null;
                        let status = "";

                        if (heightCm > 0) {
                        const heightM = heightCm / 100;
                        bmi = record.weight / (heightM * heightM);
                        bmi = Math.round(bmi * 10) / 10;

                        if (bmi < 18.5) status = "過輕";
                        else if (bmi < 24) status = "正常";
                        else if (bmi < 27) status = "過重";
                        else status = "肥胖";
                        }

                        return (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex justify-between items-center transition-all duration-300 animate-fade-in"
                        >
                            <div>
                            <p className="text-gray-800 font-semibold">{record.recordDate}</p>
                            <p className="text-base text-gray-600">體重: {record.weight} kg</p>
                            <p className="text-sm text-gray-500">BMI: {bmi ? `${bmi} (${status})` : "無法計算"}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2 text-sm">
                            <button
                                onClick={() => handleEdit(record)}
                                className="text-blue-600 hover:underline"
                            >
                                編輯
                            </button>
                            <button
                                onClick={() => handleDelete(record.recordId)}
                                className="text-red-600 hover:underline"
                            >
                                刪除
                            </button>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                )}
            </div>

            {weightRecords.length > 5 && (
                <div className="mt-4 text-center">
                    <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-600 hover:underline"
                    >
                    {showAll ? '顯示較少' : '顯示更多（最多 15 筆）'}
                    </button>
                    {showAll && weightRecords.length > 15 && (
                    <p className="text-sm text-gray-400 mt-1">⚠️ 僅顯示最新 15 筆資料</p>
                    )}
                </div>
                )}
            

            <div className="mt-8 text-center">
                <img
                    src="/panda.png"
                    alt="熊貓加油"
                    className="mx-auto w-80 rounded-lg shadow-none"
                />
                <p className="mt-4 text-gray-600">保持健康的體重，邁向更好的生活！</p>
            </div>
        </div>
    );
};

export default WeightRecordPage;