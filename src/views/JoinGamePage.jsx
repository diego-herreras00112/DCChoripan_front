import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../services/api.js';
import '../assets/styles/JoinGamePage.css';

function JoinGamePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const partida = await api.joinGameByCode(codigo);
      navigate(`/partida/${partida.id}/espera`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <section className="join-game-section">
      <header className="join-header">
        <Link to="/partidas" className="logo">
          <img src="/Chile.svg" alt="Logo Chile" />
          <span className="logo-subtitle">en 100 casillas</span>
        </Link>
        <a href="#" onClick={handleLogout} className="logout-link">Cerrar Sesión</a>
      </header>

      <main className="main-content">
        <h1 className="join-game-title">Unirse a Partida</h1>
        <form className="join-form" onSubmit={handleSubmit}>
          
          {/* --- CLASES ACTUALIZADAS --- */}
          <label htmlFor="game-code" className="join-label">Ingrese el código:</label>
          <input 
            type="text" 
            id="game-code" 
            className="join-input" 
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="EJ: AB12CDEF"
            maxLength={8}
          />
          {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
          <button 
            type="submit" 
            className="join-button" 
            disabled={loading}
          >
            {loading ? 'Uniéndose...' : 'Unirse'}
          </button>
          {/* --- FIN DE CLASES ACTUALIZADAS --- */}

        </form>
      </main>

      <Link to="/partidas" className="back-button">Volver</Link>
    </section>
  );
}

export default JoinGamePage;