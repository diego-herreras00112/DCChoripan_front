// src/views/GameHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../assets/styles/GameHistoryPage.css';

export default function GameHistoryPage() {
  const { logout } = useAuth();
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getMyGames();
        setPartidas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  // Helper para formatear el estado
  const formatEstado = (estado) => {
    if (estado === 'en_juego') return 'En Juego';
    if (estado === 'finalizada') return 'Finalizada';
    if (estado === 'incompleta') return 'Cancelada/Incompleta';
    if (estado === 'esperando jugadores') return 'En Sala de Espera';
    return estado;
  };

  // Helper para determinar clase CSS según resultado
  const getCardClass = (p) => {
    if (p.estado === 'finalizada') {
      return p.ganaste ? 'history-card-win' : 'history-card-loss';
    }
    return 'history-card-neutral';
  };

  return (
    <section className="history-section">
      <header className="history-header">
        <Link to="/partidas" className="logo-link">
          <img src="/Chile.svg" alt="Logo Chile" />
          <span className="logo-subtitle">en 100 casillas</span>
        </Link>
        <h1 className="history-title">Tus Partidas</h1>
        <a href="#" onClick={handleLogout} className="logout-link">Cerrar Sesión</a>
      </header>

      <main className="history-content">
        {loading && <div className="spinner-icon"></div>}
        
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && partidas.length === 0 && (
          <div className="empty-state">
            <p>Aún no has jugado ninguna partida.</p>
            <Link to="/partidas/crear" className="nav-button-small">¡Crea una ahora!</Link>
          </div>
        )}

        {!loading && !error && partidas.length > 0 && (
          <div className="history-grid">
            {partidas.map((p) => (
              <article key={p.id} className={`history-card ${getCardClass(p)}`}>
                <div className="card-header">
                  <span className="card-code">Cód: {p.codigo}</span>
                  <span className={`status-badge status-${p.estado.replace(' ', '-')}`}>
                    {formatEstado(p.estado)}
                  </span>
                </div>
                
                <div className="card-body">
                  {p.estado === 'finalizada' ? (
                    p.ganaste ? (
                      <h3 className="result-text win">¡Ganaste! 🏆</h3>
                    ) : (
                      <h3 className="result-text loss">
                        Ganador: <span className="winner-name">{p.ganador_usuario || 'Desconocido'}</span>
                      </h3>
                    )
                  ) : (
                    <h3 className="result-text pending">
                        {p.estado === 'en_juego' ? 'En progreso...' : 'Sin resultados'}
                    </h3>
                  )}

                  <div className="players-list">
                    <h4>Jugadores:</h4>
                    <ul>
                      {p.jugadores.map(j => (
                        <li key={j.id}>
                          <span className="p-role">
                            {j.rol === 'Huaso' ? '🤠' : j.rol === 'Marinero' ? '⚓' : j.rol === 'Minero' ? '⛏️' : '👤'}
                          </span>
                          {j.nombre_usuario} 
                          {p.estado !== 'esperando jugadores' && <span className="p-casilla">(Casilla {j.casillaNumero})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Link to="/partidas" className="back-button">Volver al Lobby</Link>
    </section>
  );
}