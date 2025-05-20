export const API_BASE_HEALTH = 'http://localhost:8082/health';
export const API_BASE_AI = 'http://localhost:8082/healthAI';

export const ENDPOINTS = {
  // 體重
  weight: `${API_BASE_HEALTH}/weight`,

  // 血壓
  bloodPressure: `${API_BASE_HEALTH}/blood-pressure`,

  // 血糖
  bloodSugar: `${API_BASE_HEALTH}/blood-sugar`,

  // AI 建議
  aiAdvice: `${API_BASE_AI}/advice`,
  aiAdviceHistory: `${API_BASE_AI}/advice-history`
};