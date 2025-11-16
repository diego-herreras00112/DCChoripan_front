import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import "../assets/styles/GameBoardPage.css";
import { useAuth } from '../context/AuthContext.jsx';

export default function GameBoardPage() {
  const { partidaId } = useParams();          
  const [jugadores, setJugadores] = useState([]);
  const { user } = useAuth();
  const usuarioIdActual = user?.id;

  // ESTADOS
  const [tirando, setTirando] = useState(false);
  const [dado1Resultado, setDado1Resultado] = useState(null);
  const [dado2Resultado, setDado2Resultado] = useState(null);
  const [turnoActual, setTurnoActual] = useState(null);
  const [dadosTirados, setDadosTirados] = useState(false);

  // ================================
  // CARGAR JUGADORES
  // ================================
  useEffect(() => {
    fetch(`http://localhost:3000/jugadores/${partidaId}`)
      .then(res => res.json())
      .then(data => setJugadores(data.jugadores || []))
      .catch(err => console.error("Fetch jugadores:", err));
  }, [partidaId]);

  // ================================
  // CARGAR TURNO ACTUAL REAL
  // ================================
  useEffect(() => {
    fetch(`http://localhost:3000/turnos/${partidaId}/turno-actual`)
      .then(res => res.json())
      .then(data => {
        console.log("Turno actual recibido →", data);
        setTurnoActual(data?.jugador || null);
      })
      .catch(err => console.error("Error turno-actual:", err));
  }, [partidaId]);

  // ================================
  // TABLERO SERPIENTE CORREGIDO
  // ================================
  const crearTableroSerpiente = () => {
    const tablero = [];
    
    for (let fila = 0; fila < 10; fila++) {
      const filaActual = [];
      
      for (let col = 0; col < 10; col++) {
        let numeroCasilla;
        
        if (fila % 2 === 0) {
          numeroCasilla = fila * 10 + col + 1;
        } else {
          numeroCasilla = fila * 10 + (10 - col);
        }
        
        filaActual.push(numeroCasilla);
      }
      
      tablero.unshift(filaActual);
    }
    
    return tablero.flat();
  };

  const ordenFinal = crearTableroSerpiente();

  const jugadorActual = jugadores.find(j => j.usuarioID == usuarioIdActual);
  const otrosJugadores = jugadores.filter(j => j.usuarioID != usuarioIdActual);

  // ================================
  // COLORES
  // ================================
  const rolColor = (rol) => {
    switch(rol) {
      case "Huaso": return "#DA291C";
      case "Marinero": return "#0032A0";
      case "Minero": return "#FFF";
      default: return "#666";
    }
  };
  const rolColorText = (rol) => rol === "Minero" ? "#000" : "#FFF";
  const rolOpacidad = (rol) => rol === "Minero" ? "C" : "CC";

  // ================================
  // FUNCIÓN: TIRAR LOS DADOS
  // ================================
  const manejarRoll = async () => {
    if (!turnoActual) return;

    if (Number(turnoActual.usuarioID) !== Number(usuarioIdActual)) {
      console.log(`No es tu turno. Turno actual de jugador ${turnoActual.usuarioID}`);
      return;
    }

    setTirando(true);

    const rawToken = localStorage.getItem("token") || "";
    const tokenForHeader = rawToken.startsWith("Bearer ")
      ? rawToken
      : `Bearer ${rawToken}`;

    try {
      const res = await fetch(`http://localhost:3000/turnos/${partidaId}/roll`, {
        method: "POST",
        headers: {
          Authorization: tokenForHeader,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`Error ${res.status}:`, text);
        setTirando(false);
        return;
      }

      const data = await res.json();
      console.log("Respuesta casillas:", data.detalles);

      setDado1Resultado(data.detalles.dados.dado1);
      setDado2Resultado(data.detalles.dados.dado2);
      setDadosTirados(true);

      setJugadores(prevJugadores => prevJugadores.map(j => {
        if (j.usuarioID === usuarioIdActual) {
          return {
            ...j,
            casillaNumero: data.detalles.casillafinal, 
            inventario: data.detalles.inventarioActual || j.inventario
          };
        }
        return j;
      }));

      setTimeout(() => {
        setTirando(false);
      }, 3000);

    } catch (err) {
      console.error("Error tirando dados:", err);
      setTirando(false);
    }
  };

  useEffect(() => {
    console.log("dado1Resultado cambió a:", dado1Resultado);
  }, [dado1Resultado]);

  useEffect(() => {
    console.log("dado2Resultado cambió a:", dado2Resultado);
  }, [dado2Resultado]);

  const manejarTerminarTurno = async () => {
    const rawToken = localStorage.getItem("token") || "";
    const tokenForHeader = rawToken.startsWith("Bearer ")
      ? rawToken
      : `Bearer ${rawToken}`;

    try {
      const res = await fetch(`http://localhost:3000/turnos/${partidaId}/siguiente`, {
        method: "POST",
        headers: {
          Authorization: tokenForHeader,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error terminar turno:", text);
        return;
      }

      const data = await res.json();
      console.log("Turno siguiente:", data);

      setDado1Resultado(null);
      setDado2Resultado(null);
      setDadosTirados(false);

      const [turnoRes, jugadoresRes] = await Promise.all([
        fetch(`http://localhost:3000/turnos/${partidaId}/turno-actual`).then(r => r.json()),
        fetch(`http://localhost:3000/jugadores/${partidaId}`).then(r => r.json())
      ]);

      setTurnoActual(turnoRes?.jugador || null);
      setJugadores(jugadoresRes?.jugadores || []);

    } catch (err) {
      console.error("Error manejando terminar turno:", err);
    }
  };

  return (
    <div className="tablero-container">

      {/* OVERLAY DADOS */}
      {tirando && dado1Resultado != null && dado2Resultado != null && (
        <div className="overlay-dados">
          <div className="circulo-dados">
            <img src={`/dados/dado${dado1Resultado}.svg`} className="dado-imagen" />
            <img src={`/dados/dado${dado2Resultado}.svg`} className="dado-imagen" />
          </div>
        </div>
      )}

      {/* PANEL TURNO */}
      <div className="turno-box">
        <span className="turno-text">Turno de:</span>
        {turnoActual ? (
          <img
            src={`/iconos/${turnoActual.rol}.svg`}
            alt="Rol turno actual"
            className="turno-icon"
          />
        ) : (
          <span className="turno-cargando">Cargando...</span>
        )}
      </div>

      {/* TABLERO */}
      <div className="tablero">
        {ordenFinal.map((num) => {
          const jugadoresEnCasilla = jugadores.filter(j => j.casillaNumero === num);
          const zIndexCasilla = num;
          
          return (
            <div 
              className="casilla" 
              key={num} 
              style={{ 
                zIndex: zIndexCasilla,
                position: "relative" 
              }}
            >
              <img 
                src={`/casillas/Casilla ${num}.svg`} 
                alt={`Casilla ${num}`} 
                draggable="false"
                className="casilla-imagen" 
              />
              <div className="casilla-peones">
                {jugadoresEnCasilla.map((j, idx) => (
                  <img
                    key={j.id}
                    src={`/peones/${j.rol}.svg`}
                    alt={`Peón ${j.rol}`}
                    className="peon"
                    style={{ 
                      zIndex: 1000 + num + idx
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* OTROS JUGADORES */}
      {otrosJugadores.map((jug, idx) => (
        <div
          key={jug.id}
          className={`info-jugador-container-top info-jugador-top-${idx + 1}`}
        >
          <div
            className="info-jugador-top"
            style={{
              background: rolColor(jug.rol),
              color: rolColorText(jug.rol),
            }}
          >
            <img src={`/iconos/${jug.rol}.svg`} className="icono-rol-top" />
            <span className="nombre-top">{jug.nombre}</span>
            <span className="nivel-top">Nivel {jug.nivel}</span>
          </div>

          <div
            className="info-jugador-inferior"
            style={{
              background: rolColor(jug.rol) + rolOpacidad(jug.rol),
              color: rolColorText(jug.rol),
            }}
          >
            <div className="inventario-item">
              <span>{jug.inventario.madera}</span>
              <img src="/inventario/madera.svg" />
            </div>
            <div className="inventario-item">
              <span>{jug.inventario.pegamento}</span>
              <img src="/inventario/pegamento.svg" />
            </div>
            <div className="inventario-item">
              <span>{jug.inventario.clavo}</span>
              <img src="/inventario/clavo.svg" />
            </div>
          </div>
        </div>
      ))}

      {/* JUGADOR ACTUAL */}
      {jugadorActual && (
        <div className="info-jugador-container">
          <div
            className="info-jugador-superior"
            style={{
              backgroundColor: rolColor(jugadorActual.rol),
              color: rolColorText(jugadorActual.rol),
            }}
          >
            <img src={`/iconos/${jugadorActual.rol}.svg`} alt="Rol" className="icono-rol" />
            <span className="nivel">Nivel {jugadorActual.nivel}</span>
          </div>

          <div
            className="info-jugador-inferior"
            style={{
              backgroundColor: rolColor(jugadorActual.rol) + rolOpacidad(jugadorActual.rol),
              color: rolColorText(jugadorActual.rol),
            }}
          >
            <div className="inventario-item">
              <span>{jugadorActual.inventario.madera || 0}</span>
              <img src="/inventario/madera.svg" alt="Madera" />
            </div>
            <div className="inventario-item">
              <span>{jugadorActual.inventario.pegamento || 0}</span>
              <img src="/inventario/pegamento.svg" alt="Pegamento" />
            </div>
            <div className="inventario-item">
              <span>{jugadorActual.inventario.clavo || 0}</span>
              <img src="/inventario/clavo.svg" alt="Clavo" />
            </div>
          </div>
        </div>
      )}

      {Number(turnoActual?.usuarioID) === Number(usuarioIdActual) && (
        <button
          className="boton-terminar-turno"
          onClick={manejarTerminarTurno}
        >
          Terminar Turno
        </button>
      )}

      {/* BOTÓN DADOS */}
      {jugadorActual && (
        <button
          className="boton-lanzar"
          onClick={manejarRoll}
          disabled={Number(turnoActual?.usuarioID) !== Number(usuarioIdActual)}
        >
          <img
            src={
              Number(turnoActual?.usuarioID) === Number(usuarioIdActual)
                ? "/dados/boton_turno.svg"
                : "/dados/dado_desactivado.svg"
            }
            className="img-boton-dados"
          />
        </button>
      )}
    </div>
  );
}