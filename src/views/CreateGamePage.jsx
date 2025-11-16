import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api.js';

/**
 * Esta página solo se muestra por un segundo.
 * Llama a la API para crear una partida y redirige
 * a la sala de espera.
 */
function CreateGamePage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const create = async () => {
      try {
        const partida = await api.createGame();
        // Redirige a la sala de espera de la partida creada
        navigate(`/partida/${partida.id}/espera`, { replace: true });
      } catch (err) {
        setError(err.message);
        // Opcional: redirigir al lobby si falla
        setTimeout(() => navigate('/partidas'), 2000);
      }
    };
    
    create();
  }, [navigate]); // Se ejecuta solo una vez

  return (
    <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
      {error ? (
        <>
          <h2>Error al crear la partida:</h2>
          <p style={{ color: 'red' }}>{error}</p>
          <p>Volviendo al lobby...</p>
        </>
      ) : (
        <h2>Creando partida, por favor espera...</h2>
      )}
    </div>
  );
}

export default CreateGamePage;