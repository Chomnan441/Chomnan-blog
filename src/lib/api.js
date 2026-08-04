import axios from "axios";

// อ่านค่าจากไฟล์ .env (ต้องขึ้นต้นด้วย VITE_ ถึงจะใช้ใน Vite ได้)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "chomnan_blog_access_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
