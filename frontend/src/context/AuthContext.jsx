import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (correo, password) => {
    try {
      const response = await authService.login({ correo, password });
      const { data } = response.data;
      localStorage.setItem('token', data.token);
      
      const sessionUser = {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        rol: data.rol,
        municipioId: data.municipioId,
        municipioNombre: data.municipioNombre
      };
      
      localStorage.setItem('user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { data } = response.data;
      localStorage.setItem('token', data.token);
      
      const sessionUser = {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        rol: data.rol,
        municipioId: data.municipioId,
        municipioNombre: data.municipioNombre
      };
      
      localStorage.setItem('user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
