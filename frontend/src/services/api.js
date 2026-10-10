const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('shetsathi_token');
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  register: (data) => fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  login: (data) => fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  forgotPassword: (data) => fetch(`${API_BASE_URL}/auth/forgot-password`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getMe: () => fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() }).then(r => r.json()),
  updateProfile: (data) => fetch(`${API_BASE_URL}/auth/profile`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  // Disease Detection
  analyzeDisease: (formData) => fetch(`${API_BASE_URL}/disease/analyze`, { method: 'POST', headers: getHeaders(true), body: formData }).then(r => r.json()),
  getDiseaseHistory: () => fetch(`${API_BASE_URL}/disease/history`, { headers: getHeaders() }).then(r => r.json()),

  // Fertilizer & Crop Rec
  getFertilizerRec: (data) => fetch(`${API_BASE_URL}/recommendation/fertilizer`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getCropRec: (data) => fetch(`${API_BASE_URL}/recommendation/crops`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  // Weather
  getWeather: (city = 'Nashik') => fetch(`${API_BASE_URL}/weather?q=${encodeURIComponent(city)}`, { headers: getHeaders() }).then(r => r.json()),

  // Mandi Prices
  getMandiPrices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/market-prices?${query}`, { headers: getHeaders() }).then(r => r.json());
  },

  // Government Schemes
  getSchemes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/schemes?${query}`, { headers: getHeaders() }).then(r => r.json());
  },

  // Crop Insurance
  getInsurance: () => fetch(`${API_BASE_URL}/insurance`, { headers: getHeaders() }).then(r => r.json()),

  // Equipment Rental
  getEquipment: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/equipment?${query}`, { headers: getHeaders() }).then(r => r.json());
  },
  rentEquipment: (data) => fetch(`${API_BASE_URL}/equipment/rent`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getMyRentals: () => fetch(`${API_BASE_URL}/equipment/my-rentals`, { headers: getHeaders() }).then(r => r.json()),

  // Marketplace
  getProducts: (category = '') => fetch(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`, { headers: getHeaders() }).then(r => r.json()),
  placeOrder: (data) => fetch(`${API_BASE_URL}/orders`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getOrderHistory: () => fetch(`${API_BASE_URL}/orders/history`, { headers: getHeaders() }).then(r => r.json()),

  // Profit Calculator
  calculateProfit: (data) => fetch(`${API_BASE_URL}/profit-calculator/calculate`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getProfitHistory: () => fetch(`${API_BASE_URL}/profit-calculator/history`, { headers: getHeaders() }).then(r => r.json()),

  // Multilingual Voice Assistant
  voiceChat: (message, language) => fetch(`${API_BASE_URL}/voice-assistant/chat`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ message, language }) }).then(r => r.json()),

  // Notifications & SMS Alerts
  getNotifications: () => fetch(`${API_BASE_URL}/notifications`, { headers: getHeaders() }).then(r => r.json()),
  markNotificationRead: (id) => fetch(`${API_BASE_URL}/notifications/read`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ id }) }).then(r => r.json()),
  subscribeAlerts: (data) => fetch(`${API_BASE_URL}/notifications/subscribe`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  sendSmsAlert: (data) => fetch(`${API_BASE_URL}/notifications/send-sms`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json())
};
