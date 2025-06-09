import React from 'react';

function BPRecordList({ records, showAll, setShowAll, onEdit, onDelete, getBPStatusFromValues }) {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">血壓紀錄列表</h3>

      {records.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">尚無紀錄，請新增一筆血壓資料 🩺</p>
      ) : (
        <div className="space-y-4">
          {(showAll ? records.slice(0, 15) : records.slice(0, 5)).map((record, index) => {
            const status = getBPStatusFromValues(record.systolic, record.diastolic);
            return (
              <div
                key={index}
                className="flex justify-between items-start p-4 rounded-lg shadow border border-gray-200 bg-white transition-all duration-300 animate-fade-in"
              >
                <div>
                  <p className="text-gray-800 font-semibold">{record.recordDate}</p>
                  <p className="text-sm text-gray-600">
                    收縮壓：{record.systolic}、舒張壓：{record.diastolic} mmHg
                  </p>
                  {record.notes && (
                    <p className="text-sm text-gray-500 mt-1">備註：{record.notes}</p>
                  )}
                </div>
                <div className="text-sm text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => onEdit(record)} className="text-blue-600 hover:underline">編輯</button>
                  <button onClick={() => onDelete(record.recordId)} className="text-red-600 hover:underline">刪除</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {records.length > 5 && (
        <div className="mt-4 text-center">
          <button onClick={() => setShowAll(!showAll)} className="text-blue-600 hover:underline">
            {showAll ? '顯示較少' : '顯示更多（最多 15 筆）'}
          </button>
          {showAll && records.length > 15 && (
            <p className="text-sm text-gray-400 mt-1">⚠️ 只顯示最新 15 筆紀錄</p>
          )}
        </div>
      )}
    </>
  );
}

export default BPRecordList;