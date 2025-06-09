import React, { forwardRef } from "react";

const SugarForm = forwardRef(({
  fasting,
  postMeal,
  recordDate,
  notes,
  editingId,
  onChange,
  onNoteChange,
  onSave,
  onCancel
}, ref) => {
  return (
     <div ref={ref} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium">記錄日期</label>
        <input
          type="date"
          name="recordDate"
          value={recordDate}
          onChange={onChange}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">餐前血糖 (mg/dL)</label>
          <input
            type="number"
            name="fasting"
            min="30"
            max="250"
            value={fasting}
            onChange={onChange}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入餐前血糖"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">餐後血糖 (mg/dL)</label>
          <input
            type="number"
            name="postMeal"
            min="30"
            max="250"
            value={postMeal}
            onChange={onChange}
            className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="輸入餐後血糖"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-gray-700 text-sm font-medium">備註（可選）</label>
        <textarea
          name="notes"
          value={notes}
          onChange={onNoteChange}
          rows={3}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="例如：今天有哪裡比較不舒服嗎?或是狀況一切ok。"
        />
      </div>

      <div className="md:col-span-2 text-center space-x-2">
        <button
          onClick={onSave}
          className="px-6 py-2 mt-4 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
        >
          {editingId ? '更新血糖紀錄' : '儲存血糖紀錄'}
        </button>
        {editingId && (
          <button
            onClick={onCancel}
            className="px-6 py-2 mt-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            取消編輯
          </button>
        )}
      </div>
    </div>
  );
});

export default SugarForm;