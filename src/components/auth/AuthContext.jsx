// src/components/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthChanged, clearAuth, setAuth } from "../../hooks/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuth()); // ★ 새로고침 복원

  // hooks/auth.js의 이벤트를 구독해 컨텍스트를 자동 갱신
  useEffect(() => {
    return onAuthChanged((auth) => setUser(auth));
  }, []);

  const login = (auth) => setAuth(auth);
  const logout = () => clearAuth();

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
