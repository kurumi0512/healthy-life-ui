import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import HealthSidebar from './HealthSidebar';
import axios from 'axios';

function FrontPage() {
  const { user, logout } = useAuth();
  const allNews = [
    { title: '小吃店常見青菜是美國營養師首選！', url: 'https://www.edh.tw/article/37784' },
    { title: '經常脹氣怎麼辦？這些低FODMAP食品可多吃！', url: 'https://www.edh.tw/article/29956' },
    { title: '自助餐夾這些菜是高油熱量炸彈！', url: 'https://www.edh.tw/article/37435' },
    { title: '為何蛋白那麼重要?', url: 'https://www.healthnews.com.tw/article/65035' },
    { title: '延緩老化吃木瓜！營養師推 4 水果：助控血糖、也助眠', url: 'https://heho.com.tw/archives/352917' },
    { title: '不只油炸食物！　吃太快、防腐劑都是造成肥胖的幕後黑手', url: 'https://heho.com.tw/archives/353090' },
    { title: '中年發福真凶抓到了！　國際期刊揭節食運動仍變胖關鍵原因', url: 'https://news.tvbs.com.tw/health/2866543' },
    { title: '早餐店必點！醫揭「4大地雷早餐」越吃越肥', url: 'https://news.tvbs.com.tw/health/2865362' },
    { title: '3顆馬鈴薯=1片三角形蛋糕！營養師曝：減肥好朋友', url: 'https://news.tvbs.com.tw/health/2864748' },
    { title: '身體缺「4維他命」易變胖！', url: 'https://news.tvbs.com.tw/life/2855954' },
    { title: '大腦抗發炎、防老化吃 5 類食物！', url: 'https://heho.com.tw/archives/354983' },
    { title: 'Omega-3 有助延緩老化！', url: 'https://heho.com.tw/archives/351590' },
    { title: '養生必學！營養師揭「7色蔬果」', url: 'https://today.line.me/tw/v2/article/LX3X2X2' },
    { title: '預防肝癌！請小心飲食的「地雷」誤區', url: 'https://www.fanhealth.com.tw/front/article/detail?id=1718' },
  ];

  const [randomNews, setRandomNews] = useState([]);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const shuffled = [...allNews].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    setRandomNews(selected);
  }, []);

  useEffect(() => {
  const shuffled = [...allNews].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);
  setRandomNews(selected);

  // 🔍 載入 AI 推薦新聞
  axios.get('http://localhost:8082/rest/health/news/recommend', { withCredentials: true })
    .then(res => setRecommendation(res.data))
    .catch(err => console.error('載入推薦新聞失敗', err));
}, []);

  return (
  <div className="max-w-6xl mx-auto px-6 pt-24">
    {/* 上方標題區＋登入狀態 */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
      <h1 className="text-3xl font-bold text-blue-900">
        《體重與健康 AI 追蹤系統》
      </h1>

      {user ? (
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-green-700">👋 嗨，{user.username}！歡迎回來！</p>
        </div>
      ) : (
        <p className="mt-4 md:mt-0 text-gray-500 text-right">
          尚未登入，請先登入以使用完整功能
        </p>
      )}
    </div>

    {/* 主內容區：左右區塊 */}
    <div className="flex flex-col lg:flex-row gap-12">
      {/* 左邊：新聞清單 */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        {recommendation && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded mb-10 shadow">
            <h2 className="font-bold text-yellow-800 text-lg mb-1">今日 AI 推薦文章</h2>
            <a
              href={recommendation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline"
            >
              🔗 {recommendation.title}
            </a>
            <p className="text-sm text-gray-600 mt-1">💡 {recommendation.reason}</p>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-700 mb-2">📰 健康新聞與知識報</h2>
        <ul className="list-disc pl-5 space-y-2">
          {randomNews.map((news, index) => (
            <li key={index}>
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline hover:text-blue-800"
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
  </div>
);

}
export default FrontPage;