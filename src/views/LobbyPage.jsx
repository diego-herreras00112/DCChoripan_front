import React, { useEffect } from 'react'; // <-- 1. IMPORTAR useEffect
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../services/api.js'; // <-- 2. IMPORTAR LA API
import '../assets/styles/LobbyPage.css';

function LobbyPage() {
  const { user, logout } = useAuth(); 

  // --- 3. ¡AQUÍ ESTÁ TU IDEA! ---
  // Se ejecuta una sola vez cuando el Lobby se carga.
  useEffect(() => {
    // Llama a 'leaveGame' para limpiar cualquier partida
    // en la que el usuario pudiera estar "atrapado".
    api.leaveGame()
      .then(response => {
        // Opcional: mostrar un mensaje si la salida fue exitosa
        console.log('Limpieza de partida exitosa:', response.message);
      })
      .catch(error => {
        // Esto es NORMAL si el usuario no estaba en una partida.
        // Simplemente lo ignoramos.
        console.log('Info (Limpieza):', error.message);
      });
  
    // El array vacío [] asegura que esto solo se ejecute UNA VEZ
    // cuando la página carga.
  }, []); 
  // ------------------------------

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <section id="lobby" className="lobby-section">
      <div className="lobby-container">
        
        <header className="lobby-header">
          <Link to="/" className="logo">
            <img src="/Chile.svg" alt="Logo Chile" />
            <span className="logo-subtitle">en 100 casillas</span>
          </Link>
          <a href="#" onClick={handleLogout} className="logout-link">Cerrar Sesión</a>
        </header>

        <main className="lobby-main">
          <nav className="lobby-nav">
            <ul className="nav-list">
              <li><Link to="/partidas/crear" className="nav-button">Crear partida</Link></li>
              <li><Link to="/partidas/unirse" className="nav-button">Unirse a partida</Link></li>
              <li><Link to="/instrucciones" className="nav-button">Reglas del juego</Link></li>
              <li><Link to="/partidas/historial" className="nav-button">Partidas anteriores</Link></li>
              <li><Link to="/nosotros" className="nav-button">Quienes somos</Link></li>
              
              {user && user.rol === 'admin' && (
                <li>
                  <Link 
                    to="/admin/usuarios" 
                    className="nav-button nav-button-admin"
                  >
                    Administrar usuarios
                  </Link>
                </li>
              )}

            </ul>
          </nav>
        </main>

      </div>
    </section>
  );
}

export default LobbyPage;