import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "../lib/api";

interface AuthUser {
  userId: string;
  displayName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    firstName: string,
    lastName: string
  ) => Promise<{ message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        // Decode JWT payload (base64) to read claims
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId: string = payload.sub ?? payload.userId ?? "";
        const displayName: string =
          payload.displayName ?? payload.email ?? "User";
        if (userId) {
          setUser({ userId, displayName });
        }
      } catch {
        clearToken();
      }
    }
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const data = await api.auth.login(email, password);
    setToken(data.token);
    setUser({ userId: data.userId, displayName: data.displayName });
  }

  async function register(
    email: string,
    password: string,
    displayName: string,
    firstName: string,
    lastName: string
  ): Promise<{ message: string }> {
    return api.auth.register(email, password, displayName, firstName, lastName);
  }

  function logout(): void {
    api.auth.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
