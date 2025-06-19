// WeightRecordPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { handleWeightFeedback } from "../utils/weightFeedback";
import WeightForm from "../components/weight/WeightForm";
import WeightChart from "../components/weight/WeightChart";
import WeightTrendCard from "../components/weight/WeightTrendCard";
import WeightRecordList from "../components/weight/WeightRecordList";
import WeightPandaTip from "../components/weight/WeightPandaTip";
import ScrollButtons from "../components/common/ScrollButtons";

const WeightRecordPage = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [weightDifference, setWeightDifference] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [weightRecords, setWeightRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [recordDate, setRecordDate] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [bmiStatus, setBmiStatus] = useState("");
  const [lastRecordDate, setLastRecordDate] = useState(null);
  const [showBottomBtn, setShowBottomBtn] = useState(true); // 控制是否顯示
  const formRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchRecentRecords();
    fetchLastRecordDate();
    setRecordDate(new Date().toISOString().split('T')[0]);
    if (!profileLoaded) {
      loadProfileData(true);
    }
  }, []);

  useEffect(() => {
    if (weight && targetWeight && !isNaN(parseFloat(weight)) && !isNaN(parseFloat(targetWeight))) {
      const diff = parseFloat(weight) - parseFloat(targetWeight);
      setWeightDifference(diff.toFixed(1));
    } else {
      setWeightDifference(null);
    }
  }, [weight, targetWeight]);

  const fetchRecentRecords = async () => {
    try {
      const res = await axios.get("http://localhost:8082/rest/health/weight", { withCredentials: true });
      setWeightRecords(res.data.data);
    } catch (err) {
      console.error("查詢失敗", err);
    }
  };

  const fetchLastRecordDate = async () => {
    try {
      const res = await axios.get("http://localhost:8082/rest/health/weight/latest", {
        withCredentials: true
      });
      const latest = res.data?.data;
      if (latest?.recordDate) {
        setLastRecordDate(latest.recordDate);
      }
    } catch (err) {
      console.error("無法取得最新體重紀錄", err);
    }
  };

  const loadProfileData = async (isInitialLoad = false) => {
    if (loadingProfile) return;
    try {
      setLoadingProfile(true);
      const res = await axios.get("http://localhost:8082/rest/profile", { withCredentials: true });
      console.log("後端回傳的 profile 結果：", res.data);
      const data = res.data;
      const weightRes = await axios.get("http://localhost:8082/rest/health/weight/latest", { withCredentials: true });
      const latestWeight = weightRes.data?.data?.weight;

      if (data.height && (isInitialLoad || !height)) setHeight(data.height.toString());
      if (data.targetWeight && (isInitialLoad || !targetWeight)) setTargetWeight(data.targetWeight.toString());

      if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        let ageCalc = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ageCalc--;
        if (isInitialLoad || !age) setAge(ageCalc.toString());
      }

      if (latestWeight !== undefined && latestWeight !== null && (isInitialLoad || !weight)) {
        setWeight(latestWeight.toString());
        }

      //if (!isInitialLoad) toast.success("個人資料已重新載入！");
      setProfileLoaded(true);
    } catch (err) {
      console.error("載入個人資料失敗", err);
      if (!isInitialLoad) toast.error("個人資料載入失敗");
    } finally {
      setLoadingProfile(false);
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

    let latestRecordBeforeSave = null;
    if (!editingId && weightRecords.length > 0) {
      latestRecordBeforeSave = weightRecords[weightRecords.length - 1];
    }

    try {
      const bmiValue = weightKg / ((heightCm / 100) ** 2);
      const data = {
        height: heightCm,
        weight: weightKg,
        age: ageNum,
        bmi: bmiValue,
        recordDate: recordDate || new Date().toISOString().split("T")[0]
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
        if (latestRecordBeforeSave) {
          handleWeightFeedback(latestRecordBeforeSave.weight, weightKg);
        }
        toast.success(`✅ BMI：${bmiValue.toFixed(2)}，紀錄成功`);
      }

      await fetchRecentRecords();
      await fetchLastRecordDate();
      clearForm();
    } catch (err) {
      console.error("儲存失敗", err);
      toast.error("紀錄失敗，請稍後再試");
    }
  };

  const clearForm = () => {
    setHeight("");
    setWeight("");
    setAge("");
    setBmi(null);
    setBmiStatus("");
    setRecordDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setHeight(record.height);
    setWeight(record.weight);
    setAge(record.age);
    setBmi(record.bmi);
    setRecordDate(record.recordDate);
    setEditingId(record.recordId);
    if (formRef.current) {
      const topOffset = formRef.current.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
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
              await fetchLastRecordDate();
              toast.success("已成功刪除紀錄");
            } catch (err) {
              console.error("刪除失敗", err);
              toast.error("刪除失敗，請稍後再試");
            }
          }
        },
        { label: '取消' }
      ]
    });
  };

  const last10Records = weightRecords.slice(-10);
  const chartData = {
    labels: last10Records.map((r) => r.recordDate),
    datasets: [{
      label: "體重紀錄",
      data: last10Records.map((r) => r.weight),
      fill: false,
      borderColor: "#4caf50",
      tension: 0.1,
    }],
  };

  const recentWeightRecords = [...weightRecords]
    .sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate))
    .slice(-7);

  let weightTrendMessage = '';
  if (recentWeightRecords.length === 7) {
    const weights = recentWeightRecords.map(r => r.weight);
    const max = Math.max(...weights);
    const min = Math.min(...weights);
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    const change = weights[weights.length - 1] - weights[0];
    const percent = ((Math.abs(change) / weights[0]) * 100).toFixed(1);

    if (Math.abs(change) <= 1) {
      weightTrendMessage = `📊 最近 7 天體重穩定（平均 ${avg.toFixed(1)}kg）`;
    } else if (change < 0) {
      weightTrendMessage = `📉 體重下降 ${Math.abs(change).toFixed(1)}kg（↓ ${percent}%），持續努力 👍`;
    } else {
      weightTrendMessage = `📈 體重上升 ${change.toFixed(1)}kg（↑ ${percent}%），建議檢視飲食與作息`;
    }

    weightTrendMessage += `（最高 ${max}kg，最低 ${min}kg）`;
  }

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const screenHeight = window.innerHeight;

      setShowTopBtn(scrolledY > 300);

      // 如果已經快到底部（剩不到100px），就隱藏滑到底部按鈕
      setShowBottomBtn(scrolledY + screenHeight < pageHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
        <div className="max-w-4xl mx-auto mt-5 p-8 pt-24 bg-white rounded-lg shadow-lg">
            <ToastContainer position="top-right" autoClose={2000} limit={1} />
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">體重紀錄</h1>
            
            {lastRecordDate && (
                <div className="text-sm text-gray-500 mb-2 text-center">
                    🕰️ 上次紀錄：{lastRecordDate.replace(/-/g, "/")}
                </div>
            )}
            <div className="text-right mb-4">
                <button
                type="button"
                onClick={() => loadProfileData(false)}
                className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold py-2 px-4 rounded shadow-sm transition"
                >
                ☁️ 一鍵填入個人資料
                </button>
            </div>

            <WeightForm
              height={height}
              setHeight={setHeight}
              weight={weight}
              setWeight={setWeight}
              age={age}
              setAge={setAge}
              recordDate={recordDate}
              setRecordDate={setRecordDate}
              editingId={editingId}
              onSubmit={saveWeightRecord}
              onCancelEdit={clearForm}
              formRef={formRef}
            />

            <WeightChart records={weightRecords} />

            <WeightTrendCard records={recentWeightRecords} />


            <WeightRecordList
              records={weightRecords}
              showAll={showAll}
              setShowAll={setShowAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <WeightPandaTip />
            <div ref={bottomRef} />  
        </div>

        {/* 浮動滑動按鈕共用元件 */}
        <ScrollButtons bottomRef={bottomRef} />
      </>
    );
  };

export default WeightRecordPage;