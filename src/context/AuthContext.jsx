import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api.js'; // Importamos nuestro servicio de API
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// 1. Crear el Contexto


const AuthContext = createContext();
function processToken(token) {
  try {
    const decoded = jwtDecode(token); // Decodifica el token
    
    // 2. Creamos el objeto 'user' A PARTIR DEL TOKEN
    const user = {
      id: decoded.sub, // 'sub' es el ID de usuario
      scope: decoded.scope, // El array de scopes
      
      // 3. ¡AQUÍ! Creamos el campo 'rol' que usa el frontend
      rol: decoded.scope.includes('admin') ? 'admin' : 'usuario'
    };
    
    localStorage.setItem('token', token);
    return { token, user };

  } catch (error) {
    console.error('Token inválido o corrupto:', error);
    localStorage.removeItem('token');
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Al cargar la app, revisa localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // 4. Procesamos el token guardado
      const { token, user } = processToken(storedToken);
      setToken(token);
      setUser(user);
    }
  }, []); // Se ejecuta solo una vez al inicio

  // Función de Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      
      // 5. Procesamos el token que nos llega de la API
      const { token, user } = processToken(data.access_token);
      setToken(token);
      setUser(user);
      
      setLoading(false);
      navigate('/partidas');
      
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Función de Logout (actualizada para limpiar)
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Error en logout API (ignorado):', error);
    } finally {
      // Siempre limpiamos el frontend
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}