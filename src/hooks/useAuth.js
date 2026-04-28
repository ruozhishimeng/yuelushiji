import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/api/authApi';
import { getAuthToken, setAuthToken, removeAuthToken } from '../lib/api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化：有token则获取用户信息
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.getMe()
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        removeAuthToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (nickname, school) => {
    setError(null);
    try {
      const data = await authApi.register({ nickname, school });
      setAuthToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const login = useCallback(async (userId) => {
    setError(null);
    try {
      const data = await authApi.login({ userId });
      setAuthToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await authApi.getMe();
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { user, loading, error, register, login, logout, refreshProfile, isAuthenticated: !!user };
}