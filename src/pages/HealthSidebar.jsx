import React from 'react';
import { useNavigate } from 'react-router-dom';

function HealthTipsCard({ icon, title, tips }) {
  const today = new Date().getDate();
  const tip = tips[today % tips.length];
  return (
    <div className="bg-blue-50 text-blue-900 p-4 rounded-xl shadow w-full flex items-start space-x-4">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base">{title}</h3>
        <p className="text-sm break-words">{tip}</p>
      </div>
    </div>
  );
}

function HealthSidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* 主視覺圖片，點擊前往登入頁 */}
      <img
        src="/record.png"
        alt="健康主題圖片"
        className="rounded-lg shadow-md w-3/4 cursor-pointer"
        onClick={() => navigate('/login')}
      />

      {/* 健康小知識區塊 */}
      <HealthTipsCard
        icon="🏃‍♂️"
        title="運動小知識"
        tips={[
          '每天快走 30 分鐘，有助心肺健康。',
          '久坐記得每 1 小時站起來活動。',
          '伸展有助於放鬆肌肉、降低受傷風險。',
          '爬樓梯是提升體力的好方式。',
          '運動後補充水分與電解質很重要。',
        ]}
      />

      <HealthTipsCard
        icon="🥗"
        title="飲食小知識"
        tips={[
          '多吃深綠蔬菜，富含鐵與維生素。',
          '選擇糙米、地瓜等全穀類食物。',
          '避免過多加工食品與含糖飲料。',
          '早餐包含蛋白質可提升專注力。',
          '無糖豆漿是良好植物蛋白來源。',
        ]}
      />

      <HealthTipsCard
        icon="🧠"
        title="心理健康小知識"
        tips={[
          '每天花 10 分鐘做深呼吸或冥想。',
          '與朋友聊天有助情緒釋放與支持。',
          '寫日記是表達壓力的好方法。',
          '保持足夠睡眠對情緒穩定很重要。',
          '給自己一點肯定，讚美自己一天的努力。',
        ]}
      />

      <HealthTipsCard
        icon="🌙"
        title="睡眠小知識"
        tips={[
          '睡前 1 小時避免看手機與強光。',
          '固定睡眠時間有助於生理時鐘穩定。',
          '避免咖啡因或刺激性飲料過晚飲用。',
          '睡前可以聽輕音樂幫助放鬆入眠。',
          '保持臥室安靜與舒適有助於良好睡眠品質。',
        ]}
      />
    </div>
  );
}

export default HealthSidebar;
