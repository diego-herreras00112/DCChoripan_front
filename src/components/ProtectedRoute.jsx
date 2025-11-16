import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Este componente protege rutas que solo son para usuarios logueados.
 */
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Si aún está cargando la info del token, esperamos
  if (loading) {
    return <div style={{color: 'white', padding: '2rem'}}>Cargando...</div>;
  }

  // Si no está autenticado, lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra la página solicitada (Lobby, JoinGamePage, etc.)
  return <Outlet />;
}

export default ProtectedRoute;