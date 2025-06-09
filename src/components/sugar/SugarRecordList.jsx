import React from "react";

const SugarRecordList = ({ records, onEdit, onDelete, showAll, setShowAll }) => {
  const displayRecords = showAll ? records.slice(0, 15) : records.slice(0, 5);

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">最近紀錄</h3>

      {records.length === 0 ? (
        <p className="text-gray-500 text-center">尚無紀錄，請新增資料 📝</p>
      ) : (
        <div className="space-y-4">
          {displayRecords.map((r, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 font-semibold">{r.recordDate}</p>
                <p className="text-sm text-gray-600">
                  餐前血糖：{r.fasting}、餐後血糖：{r.postMeal}
                </p>
                {r.notes && <p className="text-sm text-gray-500">備註：{r.notes}</p>}
              </div>
              <div className="text-sm text-right space-x-2">
                <button onClick={() => onEdit(r)} className="text-blue-600 hover:underline">編輯</button>
                <button onClick={() => onDelete(r.recordId)} className="text-red-600 hover:underline">刪除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {records.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline"
          >
            {showAll ? '顯示較少' : '顯示更多（最多 15 筆）'}
          </button>
          {showAll && records.length > 15 && (
            <p className="text-sm text-gray-400 mt-1">⚠️ 僅顯示最新 15 筆資料</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SugarRecordList;