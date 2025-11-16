import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../services/api.js';
import '../assets/styles/WaitingRoomPage.css';

function WaitingRoomPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { partidaId } = useParams();
  const location = useLocation();

  // Usamos la 'partida' que nos pasaron por 'state'
  const [partida, setPartida] = useState(location.state?.partida || null);
  const [error, setError] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false); // Estado de carga para "Volver"

  // --- LÓGICA DE POLLING (Auto-actualizar) ---
  useEffect(() => {
    // Usamos un 'ref' para saber si el juego empezó.
    const isLeavingToPlay = { current: false };

    const fetchGameState = async () => {
      try {
        const data = await api.getGameState(partidaId);
        setPartida(data); // Actualiza el estado
        
        if (data.estado === 'en_juego') {
          isLeavingToPlay.current = true;

          // 🔥 PRIMERO mostramos el rol
          navigate(`/partida/${partidaId}/roles`, {
            state: { partida: data }  // pasamos los roles asignados
          });
        }
      } catch (err) {
        setError(err.message);
        clearInterval(intervalId); // Detenemos el polling si hay error
      }
    };

    // Si NO recibimos la partida por 'state', la buscamos de inmediato.
    if (!location.state?.partida) {
      fetchGameState();
    }

    // Inicia el polling
    const intervalId = setInterval(fetchGameState, 3000);

    // --- LÓGICA DE LIMPIEZA (CORREGIDA) ---
    // Se ejecuta SOLO UNA VEZ cuando el componente se desmonta
    return () => {
      clearInterval(intervalId); // Siempre detenemos el polling
      
      // ¡¡YA NO LLAMAMOS A api.leaveGame() AQUÍ!!
      // El bug de StrictMode estaba aquí.
    };
    
    // El array de dependencias solo tiene valores estables.
  }, [partidaId, navigate, location.state?.partida]);

  // --- Handlers asíncronos para salir ---
  // (Esta lógica está bien y ahora es la ÚNICA
  //  forma de llamar a api.leaveGame())
  
  const handleLeaveAndGoBack = async (e) => {
    e.preventDefault();
    if (isLeaving) return; // Evita doble clic
    setIsLeaving(true); // Muestra "Saliendo..."
    try {
      await api.leaveGame(); // <-- ESPERA a que la API termine
      navigate('/partidas'); // <-- NAVEGA DESPUÉS
    } catch (err) {
      console.error("Error al salir:", err);
      navigate('/partidas'); // Igual navega
    }
  };

  const handleLeaveAndLogout = async (e) => {
    e.preventDefault();
    if (isLeaving) return; // Evita doble clic
    setIsLeaving(true); // Muestra "Saliendo..."
    try {
      await api.leaveGame(); // <-- ESPERA a que la API termine
      logout(); // <-- DESLOGUEA DESPUÉS
    } catch (err) {
      console.error("Error al salir:", err);
      logout(); // Desloguea igual
    }
  };

  // --- Renderizado ---

  if (error) {
    return (
      <div className="waiting-screen">
        <h2 style={{color: 'red', textAlign: 'center'}}>Error: {error}</h2>
        <Link to="/partidas" className="back-button">Volver al Lobby</Link>
      </div>
    );
  }
  
  if (isLeaving) {
    return <div className="waiting-screen"><h2 style={{color: 'white'}}>Saliendo de la partida...</h2></div>;
  }

  // Muestra "Cargando..." solo si no recibimos la partida
  // desde la página de "Crear Partida".
  if (!partida) {
    return <div className="waiting-screen"><h2 style={{color: 'white'}}>Cargando partida...</h2></div>;
  }

  return (
    <section className="waiting-screen">
      <div className="page-container">
        <header className="site-header">
          {/* Llama al handler asíncrono */}
          <a href="#" onClick={handleLeaveAndGoBack} className="logo-link">
            <img src="/Chile.svg" alt="Logo Chile" />
            <span className="logo-subtitle">en 100 casillas</span>
          </a>
          <h1 className="wait-room-title">
            Sala de Espera
          </h1>
          {/* Llama al handler asíncrono */}
          <a href="#" onClick={handleLeaveAndLogout} className="logout-link">Cerrar Sesión</a>
        </header>

        <main className="waiting-room-content">
          <div className="waiting-card">
            <h2 className="card-title">Partida 
              <span className="card-title-regular"> {partida.codigo}</span>
            </h2>
            <div className="spinner-icon"></div>
            <p className="player-status">
              {partida.jugadores ? partida.jugadores.length : 0}/3 jugadores
            </p>
          </div>
        </main>

        <footer className="site-footer">
          {/* Llama al handler asíncrono */}
          <a href="#" onClick={handleLeaveAndGoBack} className="back-button">Volver</a>
        </footer>
      </div>
    </section>
  );
}

export default WaitingRoomPage;