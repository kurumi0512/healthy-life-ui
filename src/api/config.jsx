export const API_BASE_HEALTH = 'http://localhost:8082/rest/health';
export const API_BASE_AI = 'http://localhost:8082/rest/healthAI';

export const ENDPOINTS = {
  weight: `${API_BASE_HEALTH}/weight`,
  bloodPressure: `${API_BASE_HEALTH}/blood-pressure`,
  bloodSugar: `${API_BASE_HEALTH}/blood-sugar`,
  aiAdvice: `${API_BASE_AI}/advice`,
  aiAdviceHistory: `${API_BASE_AI}/advice-history`
};