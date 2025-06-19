import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

function ProteinAdvicePage() {
  const [weight, setWeight] = useState('');
  const [level, setLevel] = useState('normal');
  const [isVegan, setIsVegan] = useState(false);
  const [useMealPlan, setUseMealPlan] = useState(false);
  const [result, setResult] = useState(null);
  const [filled, setFilled] = useState(false);

  // API 請求處理
  const handleSubmit = async () => {
    if (!weight || parseFloat(weight) <= 0) {
      toast.warning("⚠️ 請輸入有效的體重");
      return;
    }

    try {
      const url = useMealPlan
        ? 'http://localhost:8082/rest/protein/meal-plan'
        : 'http://localhost:8082/rest/protein/advice';

      const res = await axios.post(url, {
        weight: parseFloat(weight),
        activityLevel: level,
        isVegan: isVegan
      });

      setResult(res.data);
    } catch (err) {
      console.error("取得建議失敗", err);
      toast.error("發生錯誤，請稍後再試");
    }
  };

  // 自動載入最新體重
  const handleAutoFill = async () => {
    if (filled) {
      toast.info("資料已載入，無需重複操作");
      return;
    }

    try {
      const res = await fetch('http://localhost:8082/rest/health/weight/latest', {
        credentials: 'include',
      });
      const data = await res.json();

      if (data?.data?.weight) {
        setWeight(data.data.weight.toString());
        setFilled(true);
        toast.success("已載入最新體重！");
      } else {
        toast.warning("查無體重紀錄");
      }
    } catch (err) {
      toast.error("載入失敗，請重新登入");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-24 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">蛋白質攝取建議</h2>

      {/* 一鍵載入體重 */}
      <div className="text-right mb-4">
        <button
          onClick={handleAutoFill}
          className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold py-2 px-4 rounded shadow-sm transition"
        >
          ☁️ 一鍵載入最新體重
        </button>
      </div>

      {/* 表單區 */}
      <div className="mb-4">
        <label className="block mb-1">體重（kg）</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="請輸入體重"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">活動強度</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="normal">一般活動（久坐）</option>
          <option value="active">中等活動（常運動）</option>
          <option value="athlete">高強度訓練者</option>
        </select>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={isVegan}
          onChange={(e) => setIsVegan(e.target.checked)}
          id="vegan"
        />
        <label htmlFor="vegan" className="ml-2">僅推薦全素食食物</label>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={useMealPlan}
          onChange={(e) => setUseMealPlan(e.target.checked)}
          id="mealPlan"
        />
        <label htmlFor="mealPlan" className="ml-2">顯示三餐建議（早餐、午餐、晚餐）</label>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          產生建議
        </button>
      </div>

      {/* 結果區 */}
      {result?.dailyProteinTarget && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            每日建議蛋白質攝取量：{result.dailyProteinTarget} 克
          </h3>

          {/* 單列表建議 */}
          {!useMealPlan && Array.isArray(result.suggestedFoods) && (
            <ul className="space-y-2">
              {result.suggestedFoods.map((item, index) => (
                <li key={index} className="border p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-600">建議攝取 {item.amount_g} 克</p>
                  </div>
                  <p className="text-right font-semibold text-blue-600">
                    {item.protein}g 蛋白質
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* 三餐建議 */}
          {useMealPlan && result.mealPlans && (
            <div className="space-y-4">
              {Object.entries(result.mealPlans).map(([meal, items], idx) => (
                <div key={idx} className="border rounded p-4">
                  <h4 className="text-lg font-bold mb-2 text-indigo-700">
                    🍽️ {meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}
                  </h4>
                  {Array.isArray(items) &&
                    items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-sm text-gray-600">建議攝取 {item.amount_g} 克</p>
                        </div>
                        <p className="text-right font-semibold text-blue-600">
                          {item.protein}g 蛋白質
                        </p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProteinAdvicePage;