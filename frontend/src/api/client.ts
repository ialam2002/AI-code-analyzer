import axios, { AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AnalysisFiles {
  files: Record<string, string>;
}

export interface AnalysisResponse {
  reports: Record<string, string[]>;
}

export interface UserCreateData {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface AnalysisRecord {
  id: number;
  filename: string;
  created_at: string;
  user_id: number | null;
}

export interface HistoryResponse {
  analyses: AnalysisRecord[];
  total: number;
}

// Auth endpoints
export const authAPI = {
  register: (data: UserCreateData) => api.post<User>("/auth/register", data),
  login: (data: UserLoginData) => api.post<TokenResponse>("/auth/login", data),
  getMe: () => api.get<User>("/auth/me"),
};

// Analysis endpoints
export const analysisAPI = {
  analyze: (files: Record<string, string>) =>
    api.post<AnalysisResponse>("/analyze", { files }),
  getHistory: (skip?: number, limit?: number) =>
    api.get<HistoryResponse>("/analysis/history", { params: { skip, limit } }),
  getAnalysis: (id: number) => api.get(`/analysis/${id}`),
};

// Health check
export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;

