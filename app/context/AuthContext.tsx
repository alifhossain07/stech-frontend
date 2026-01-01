"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "./authApi";
import { fetchProfile, login as apiLogin, signup as apiSignup } from "./authApi";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (args: { login_by: "phone"; phone: string; password: string }) => Promise<void>;
  signup: (args: {
    name: string;
    register_by: "phone";
    email_or_phone: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "sannai_auth_token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) {
      setLoading(false);
      return;
    }

    const token = stored;
    setAccessToken(token);

    fetchProfile(token)
      .then((res) => {
        if (res.result) {
          setUser(res.user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setAccessToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (args: {
    login_by: "phone";
    phone: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const res = await apiLogin(args);
      if (!res.result) throw new Error(res.message || "Login failed");
      setAccessToken(res.access_token);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, res.access_token);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (args: {
    name: string;
    register_by: "phone";
    email_or_phone: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    try {
      const res = await apiSignup(args);
      if (!res.result) throw new Error(res.message || "Signup failed");
      setAccessToken(res.access_token);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, res.access_token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};