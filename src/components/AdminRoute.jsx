import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Este componente protege rutas que solo son para administradores.
 */
function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. Si aún está cargando la info del token, esperamos
  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  // 2. Si no está autenticado, lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si está autenticado PERO no es admin, lo mandamos al lobby
  if (user.rol !== 'admin') {
    return <Navigate to="/partidas" replace />;
  }

  // 4. Si es admin, dejamos que vea la página
  return <Outlet />;
}

export default AdminRoute;