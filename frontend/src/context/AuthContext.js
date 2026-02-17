import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

const TOKEN_KEY = 'rrs_token';
const USER_KEY = 'rrs_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken('');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const saveSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        const response = await authApi.me(savedToken);
        if (response?.user) {
          setUser(response.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        } else {
          clearSession();
        }
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [clearSession]);

  const login = useCallback(
    async (payload) => {
      const response = await authApi.login(payload);
      saveSession(response.token, response.user);
      return response;
    },
    [saveSession]
  );

  const signup = useCallback(
    async (payload) => {
      const response = await authApi.signup(payload);
      saveSession(response.token, response.user);
      return response;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout,
    }),
    [loading, login, logout, signup, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
