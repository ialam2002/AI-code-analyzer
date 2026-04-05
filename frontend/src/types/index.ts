export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface AnalysisReport {
  [filename: string]: string[];
}

export interface AnalysisRecord {
  id: number;
  filename: string;
  created_at: string;
  user_id: number | null;
}

export interface AnalysisHistory {
  analyses: AnalysisRecord[];
  total: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
}

