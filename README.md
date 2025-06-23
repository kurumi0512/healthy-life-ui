# Healthy Life UI - 健康管理前端系統

本專案為《體重與健康 AI 追蹤系統》的前端介面，使用 **React + Tailwind CSS** 開發，搭配 RESTful API 與 AI 建議服務，提供使用者友善的健康紀錄與分析平台。

後端專案請見：[Healthy Life API（Spring Boot）](https://github.com/kurumi0512/healthy-life-api)

---

## 主要功能

- **會員系統**：註冊、登入、驗證信箱、忘記密碼  
- **健康紀錄管理**：體重、血壓、血糖紀錄＋一鍵帶入前筆資料  
- **健康趨勢圖**：使用 Chart.js 呈現各項變化趨勢  
- **互動鼓勵機制**：體重下降時灑花鼓勵、上升時提供正向提示  
- **AI 健康建議**：串接本地部署的 Ollama Gemma3 模型，提供個人化飲食／運動／目標建議  
- **RWD 響應式設計**：適用手機、平板與桌機介面  
- **快速導覽設計**：頂部導覽列與右側浮動提醒，提升使用體驗  
- **歷史建議查詢**：可選取過去 AI 回覆，對照健康紀錄變化

---

## 使用技術

- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Chart.js（健康紀錄趨勢圖）
- Axios（串接後端 API）
- react-router-dom（頁面路由管理）
- SweetAlert2 / React Toastify（提示訊息與灑花動畫）
- EventSource（SSE 串流接收 AI 回覆）

---

## 相關連結

- 📦 後端專案（Spring Boot）：[healthy-life-api](https://github.com/kurumi0512/healthy-life-api)
- 📸 專案簡報與使用畫面：https://www.canva.com/design/DAGoy0TjKa0/jpDxnkWfQ6EU-NqTkrNijg/view?utm_content=DAGoy0TjKa0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hfad3a53be3
- 👤 開發者：羅筱筑



1. 體重紀錄與 BMI 計算  
2. 血壓／血糖紀錄頁面  
3. AI 建議串流顯示與歷史下拉選單  
4. 趨勢圖與右下角健康提醒浮動區塊  
