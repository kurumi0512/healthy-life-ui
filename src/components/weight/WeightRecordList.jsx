// src/components/weight/WeightRecordList.jsx
import React from "react";

function WeightRecordList({ records, showAll, setShowAll, onEdit, onDelete }) {
  const displayRecords = showAll ? records.slice(0, 15) : records.slice(0, 5);

  return (
    <div className="mb-8 text-left">
      <h3 className="mt-6 text-xl font-semibold text-gray-800">體重紀錄列表</h3>

      {records.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          尚無紀錄，請新增一筆體重資料 📝
        </p>
      ) : (
        <div className="space-y-4 mt-4">
          {displayRecords.map((record, index) => {
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
                  <p className="text-gray-800 font-semibold">
                    {record.recordDate}
                  </p>
                  <p className="text-base text-gray-600">
                    體重: {record.weight} kg
                  </p>
                  <p className="text-sm text-gray-500">
                    BMI: {bmi ? `${bmi} (${status})` : "無法計算"}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2 text-sm">
                  <button
                    onClick={() => onEdit(record)}
                    className="text-blue-600 hover:underline"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => onDelete(record.recordId)}
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

      {records.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline"
          >
            {showAll ? "顯示較少" : "顯示更多（最多 15 筆）"}
          </button>
          {showAll && records.length > 15 && (
            <p className="text-sm text-gray-400 mt-1">
              ⚠️ 僅顯示最新 15 筆資料
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default WeightRecordList;