import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../services/api.js';
import '../assets/styles/AdminPage.css';

function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 1. Cargar los usuarios cuando la página se monta
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await api.getUsuarios();
        setUsuarios(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []); // El array vacío [] significa que se ejecuta solo una vez

  // 2. Función para manejar el borrado
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await api.deleteUsuario(id);
        // Actualiza la lista en el frontend filtrando el usuario eliminado
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // 3. Handlers de navegación
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="admin-container">
      <header id="header" className="page-header">
        <Link to="/partidas" className="logo">
          <img src="/Chile.svg" alt="Logo Chile" />
          <p className="logo-subtitle">en 100 casillas</p>
        </Link>
        <h1 className="page-title">Administrar Usuarios</h1>
        <a href="#" onClick={handleLogout} className="logout-link">Cerrar Sesión</a>
      </header>

      <main id="user-management" className="user-management-section">
        <div className="user-list-wrapper">
          {loading && <p>Cargando usuarios...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          
          <ul className="user-list">
            {!loading && usuarios.map(usuario => (
              <li key={usuario.id} className="user-card">
                <div className="user-info">
                  <h3>{usuario.nombre_usuario}</h3>
                  <p>
                    <span className="email-label">Correo: </span>
                    <span className="email-address">{usuario.email}</span>
                  </p>
                </div>
                {/* Usamos onClick para llamar a la función de borrado */}
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handleDelete(usuario.id);
                }} className="delete-link">
                  Eliminar
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer id="footer" className="page-footer">
        <a href="#" onClick={handleBack} className="back-button">Volver</a>
      </footer>
    </div>
  );
}

export default AdminPage;