import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import HealthSidebar from './HealthSidebar';

function FrontPage() {
  const { user, logout } = useAuth();
  const allNews = [
    { title: '糖尿病患要注意！這 5 種食物控血糖超有效', url: 'https://www.edh.tw/article/37784' },
    { title: '多吃纖維就對了？醫師揭高纖飲食 3 大重點', url: 'https://www.edh.tw/article/29956' },
    { title: '研究：快走也能抗老，每天只要這樣做', url: 'https://www.edh.tw/article/37435' },
    { title: '控糖新研究：掌握這 1 招血糖穩定不飆升', url: 'https://www.healthnews.com.tw/article/65035' },
    { title: '這樣吃才健康！醫師建議的晚餐 5 原則', url: 'https://heho.com.tw/archives/352917' },
    { title: '上班久坐怎麼辦？這 3 招簡單拉筋舒壓', url: 'https://heho.com.tw/archives/353090' },
    { title: '每天喝水的正確時機？醫師這樣建議', url: 'https://news.tvbs.com.tw/health/2866543' },
    { title: '失眠別再忍！4 種食物幫助入睡', url: 'https://news.tvbs.com.tw/health/2865362' },
    { title: '視力退化怎麼辦？保健這樣吃', url: 'https://news.tvbs.com.tw/health/2864748' },
    { title: '壓力大會害你胖？研究揭壓力與肥胖關係', url: 'https://news.tvbs.com.tw/life/2855954' },
    { title: '喝對水排毒又美顏，這時間最有效', url: 'https://heho.com.tw/archives/354983' },
    { title: '關節退化警訊：5 種徵兆你中了幾項？', url: 'https://heho.com.tw/archives/351590' },
    { title: '護眼妙招一次學起來！這些食物超給力', url: 'https://tw.news.yahoo.com/抗抗小怪獸-這些食物-幫眼睛補充維他命-024512990.html' },
    { title: '炎夏怎麼補水才正確？營養師這樣說', url: 'https://today.line.me/tw/v2/article/LX3X2X2' },
    { title: '早餐這樣吃血糖穩、體重不飆升', url: 'https://www.fanhealth.com.tw/front/article/detail?id=1718' },
  ];

  const [randomNews, setRandomNews] = useState([]);

  useEffect(() => {
    const shuffled = [...allNews].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    setRandomNews(selected);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto p-6 mt-8 gap-6">
      {/* 左邊：新聞清單 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Health News</h1>
        
         {/* ✅ 登入狀態區塊 */}
          {user ? (
            <div className="mb-4">
              <p className="text-green-700">👋 嗨，{user}！歡迎回來</p>
              <button
                onClick={logout}
                className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
              >
                登出
              </button>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">尚未登入，請先登入以使用完整功能</p>
          )}



        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          對哪些健康話題有興趣呢?
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {randomNews.map((news, index) => (
            <li key={index}>
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                {news.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 右邊健康小卡片 */}
      <div className="w-full lg:w-[400px]">
        <HealthSidebar />
      </div>
    </div>
  );
}

export default FrontPage;
