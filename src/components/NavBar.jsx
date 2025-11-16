import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

// 1. ¡IMPORTAMOS EL NUEVO CSS!
import '../assets/styles/NavBar.css'; // (Ajusta la ruta si es necesario)

function NavBar() {
  const { user, isAuthenticated, logout } = useAuth(); 

  const handleLogout = (e) => {
    e.preventDefault(); 
    logout();
  };

  // 2. BORRAMOS el 'adminStyle' de aquí

  return (
    // 3. USAMOS CLASES CSS
    <nav className="navbar">
      <ul className="navbar-list">
        
        <li><Link to="/partidas">Home (Lobby)</Link></li>
        <li><Link to="/instrucciones">Instrucciones</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>

        {user && user.rol === 'admin' && (
          <li>
            <Link to="/admin/usuarios" className="admin-link">
              Administrar
            </Link>
          </li>
        )}

        <li className="navbar-auth">
          {isAuthenticated ? (
            <a href="#" onClick={handleLogout} className="auth-link">
              Cerrar Sesión
            </a>
          ) : (
            <Link to="/login" className="auth-link">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;