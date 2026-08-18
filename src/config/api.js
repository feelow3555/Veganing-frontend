const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const getDefaultHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const refreshToken = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.data?.accessToken) {
      localStorage.setItem('authToken', data.data.accessToken);
      return data.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
};

const request = async (url, options, token) => {
  let response = await fetch(url, { ...options, headers: getDefaultHeaders(token) });
  if (response.status === 401 && token) {
    const newToken = await refreshToken();
    if (newToken) {
      response = await fetch(url, { ...options, headers: getDefaultHeaders(newToken) });
    }
  }
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.message || 'API 요청 실패');
  return data;
};

const apiClient = {
  get: (url, token = null) => request(url, { method: 'GET' }, token),
  post: (url, body, token = null) => request(url, { method: 'POST', body: JSON.stringify(body) }, token),
  put: (url, body, token = null) => request(url, { method: 'PUT', body: JSON.stringify(body) }, token),
  delete: (url, token = null) => request(url, { method: 'DELETE' }, token),
};

export { API_BASE_URL, getDefaultHeaders, apiClient };
export default API_BASE_URL;
