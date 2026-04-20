// http.js
const BASE_URL = "https://livejs-api.hexschool.io";

/**
 * 核心 request 函數
 * @param {string} url - 請求路徑
 * @param {object} options - 包含 method, body, headers, timeout 等
 */
async function request(url, options = {}) {
  const { timeout = 8000, ...customOptions } = options;

  // 1. 處理逾時控制器
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  // 2. 預設 Header 設定
  const authHeaders = {};
  // const token = localStorage.getItem('token');
  // if (token) {
  //   authHeaders['Authorization'] = `Bearer ${token}`;
  // }

  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('token');
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  } else if (process.env.API_KEY) {
    authHeaders['Authorization'] = process.env.API_KEY;
  }

  const config = {
    method: 'GET', // 預設 GET
    ...customOptions,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...customOptions.headers,
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);
    clearTimeout(id); // 請求完成後清除計時器

    // 3. 處理 HTTP 狀態碼錯誤 (如 404, 500)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { status: response.status, ...errorData };
    }

    // 4. 解析 JSON 並回傳
    return await response.json();

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('請求逾時');
      throw new Error('Timeout');
    }
    throw error;
  }
}

// 導出常用方法
const http = {
  get: (url, options) => request(url, { method: 'GET', ...options }),
  post: (url, data, options) => request(url, { 
    method: 'POST', 
    body: JSON.stringify(data), 
    ...options 
  }),
  patch: (url, data, options) => request(url, { 
    method: 'PATCH', 
    body: JSON.stringify(data), 
    ...options 
  }),
  delete: (url, options) => request(url, { method: 'DELETE', ...options }),
};

module.exports = { http };