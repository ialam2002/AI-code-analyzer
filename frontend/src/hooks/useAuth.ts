import { useState, useCallback } from "react";
import { authAPI, UserCreateData, UserLoginData, User } from "../api/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (data: UserCreateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(data);
      setUser(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.detail || err.message || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data: UserLoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(data);
      localStorage.setItem("access_token", response.data.access_token);
      
      // Fetch current user
      const userRes = await authAPI.getMe();
      setUser(userRes.data);
      return userRes.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setUser(null);
    setError(null);
  }, []);

  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, register, login, logout, getMe };
}

