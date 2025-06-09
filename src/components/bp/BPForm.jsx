// src/components/bp/BPForm.jsx
import React from 'react';

function BPForm({
  formRef,
  systolic,
  setSystolic,
  diastolic,
  setDiastolic,
  recordDate,
  setRecordDate,
  notes,
  handleNoteChange,
  saveBpRecord,
  editingId,
  clearForm
}) {
  return (
    <div ref={formRef} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <label className="block text-gray-700 text-sm font-medium">收縮壓 (mmHg)</label>
        <input
          type="number"
          min="50"
          max="250"
          value={systolic}
          onChange={(e) => setSystolic(e.target.value)}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="輸入收縮壓"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium">舒張壓 (mmHg)</label>
        <input
          type="number"
          min="50"
          max="250"
          value={diastolic}
          onChange={(e) => setDiastolic(e.target.value)}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="輸入舒張壓"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-gray-700 text-sm font-medium">備註（可選）</label>
        <textarea
          value={notes}
          onChange={handleNoteChange}
          rows={3}
          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="例如：頭暈、運動後量測..."
        />
      </div>
      <div className="md:col-span-2 text-center space-x-2">
        <button
          onClick={saveBpRecord}
          className="px-6 py-2 mt-4 bg-green-200 text-green-800 rounded-lg hover:bg-green-300 transition duration-300"
        >
          {editingId ? '更新血壓紀錄' : '儲存血壓紀錄'}
        </button>
        {editingId && (
          <button
            onClick={clearForm}
            className="px-6 py-2 mt-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            取消編輯
          </button>
        )}
      </div>
    </div>
  );
}

export default BPForm;