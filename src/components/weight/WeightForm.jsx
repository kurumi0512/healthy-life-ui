// src/components/weight/WeightForm.jsx
import React from "react";

function WeightForm({
  height,
  setHeight,
  weight,
  setWeight,
  age,
  setAge,
  recordDate,
  setRecordDate,
  editingId,
  onSubmit,
  onCancelEdit,
  formRef
}) {
  return (
    <div ref={formRef} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium">記錄日期</label>
        <input
          type="date"
          value={recordDate}
          onChange={(e) => setRecordDate(e.target.value)}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium">身高 (cm)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium">體重 (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium">年齡</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300"
        />
      </div>

      <div className="col-span-2 text-center mt-4">
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition"
        >
          {editingId ? "更新體重紀錄" : "儲存體重紀錄"}
        </button>
        {editingId && (
          <button
            onClick={onCancelEdit}
            className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            取消編輯
          </button>
        )}
      </div>
    </div>
  );
}

export default WeightForm;