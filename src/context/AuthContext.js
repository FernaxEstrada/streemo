'use client'

import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react"
import { guardarToken, obtenerToken, eliminarToken } from "@/utils/tokenManager"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = obtenerToken();
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    guardarToken(newToken);
    setToken(newToken);
  }

  const logout = () => {
    eliminarToken();
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro del provider AuthProvider");
  return context;
}