// src/views/GameBoardPage.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/GameBoardPage.css";
import { useAuth } from "../context/AuthContext.jsx";
import { socket } from "../services/socket.js";
import ModalNegociacion from "../components/ModalNegociacion.jsx";
import ModalLeyenda from "../components/ModalLeyenda.jsx";


export default function GameBoardPage() {
  const { partidaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const usuarioIdActual = user?.id;

  // --- ESTADOS ---
  const [jugadores, setJugadores] = useState([]);
  const jugadoresRef = useRef(jugadores); 
  useEffect(() => { jugadoresRef.current = jugadores; }, [jugadores]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [mostrarLeyenda, setMostrarLeyenda] = useState(false);
  
  // Estados Dados
  const [tirando, setTirando] = useState(false);
  const [dado1Resultado, setDado1Resultado] = useState(null);
  const [dado2Resultado, setDado2Resultado] = useState(null);
  const [dadosTirados, setDadosTirados] = useState(false);

  // Acciones
  const [tipoAccion, setTipoAccion] = useState(null);
  const [accionError, setAccionError] = useState(null);
  const [accionCargando, setAccionCargando] = useState(false);

  // Negociación
  const [mostrarModalNegociar, setMostrarModalNegociar] = useState(false);
  const [ofertaRecibida, setOfertaRecibida] = useState(null);

  // Fin de Partida
  const [partidaFinalizada, setPartidaFinalizada] = useState(false);
  const [ranking, setRanking] = useState(null);
  const [soyGanador, setSoyGanador] = useState(false);
  const [miPuesto, setMiPuesto] = useState(null);

  const [notificacion, setNotificacion] = useState(null);

  // ===========================================================
  // 1. HELPERS DE TOKEN
  // ===========================================================
  const getAuthHeader = () => {
    const rawToken = localStorage.getItem("token") || "";
    const tokenForHeader = rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;
    return { Authorization: tokenForHeader, "Content-Type": "application/json" };
  };

  // ===========================================================
  // 2. FUNCIONES DE CARGA
  // ===========================================================
  
  const cargarJugadores = useCallback(() => {
    fetch(`https://dcchoripan-api.onrender.com/jugadores/${partidaId}`)
      .then((res) => res.json())
      .then((data) => setJugadores(data.jugadores || []))
      .catch((err) => console.error("Fetch jugadores:", err));
  }, [partidaId]);

  const cargarTurnoActual = useCallback(() => {
      fetch(`https://dcchoripan-api.onrender.com/turnos/${partidaId}/turno-actual`)
        .then((res) => res.json())
        .then((data) => {
          console.log("🔍 Datos recibidos del turno:", data); // <-- Esto te ayudará a ver qué llega
          
          // CORRECCIÓN: A veces llega data.jugador, a veces llega data directo.
          // Esto asegura que tomemos el correcto.
          const turno = data?.jugador || data; 
          
          setTurnoActual(turno);
        })
        .catch((err) => console.error("Error turno-actual:", err));
    }, [partidaId]);

  const cargarRanking = useCallback(async () => {
    try {
      const res = await fetch(`https://dcchoripan-api.onrender.com/partidas/${partidaId}/ranking`, {
        headers: getAuthHeader()
      });
      if (res.status === 409) return; 
      if (!res.ok) return;

      const data = await res.json();
      if (data?.partida?.estado === "finalizada") {
        setPartidaFinalizada(true);
        setRanking(data.ranking);
      }
    } catch (err) {
      console.error("Error ranking:", err);
    }
  }, [partidaId]);

  const refrescarTablero = useCallback(() => {
    cargarJugadores();
    cargarTurnoActual();
    cargarRanking();
  }, [cargarJugadores, cargarTurnoActual, cargarRanking]);


  // ===========================================================
  // 3. EFECTO DE SOCKET
  // ===========================================================
  useEffect(() => {
    refrescarTablero();

    console.log("🔌 Conectando socket...");
    socket.connect();
    socket.emit("join_room", partidaId);

    const handleJuegoActualizado = (data) => {
      console.log("⚡ Socket Event:", data);

      if (data.mensaje === 'PARTIDA_FINALIZADA') {
        setPartidaFinalizada(true);
      } 
      
      if (data.mensaje === 'ACCION_REALIZADA') {
         setNotificacion(data.texto);
         setTimeout(() => setNotificacion(null), 4000);
      }

      if (data.mensaje === 'JUGADA_REALIZADA' && data.detalles) {
        let mensajes = [];

        if (data.detalles.efecto && data.detalles.efecto.tipo === 'FONDA') {
             setDadosTirados(false);
             setTirando(false);
             setDado1Resultado(null);
             setDado2Resultado(null);
        }

        if (data.detalles.bonoporlanzar7) {
          mensajes.push("✨ ¡Sacaste un 7! +2 recursos de tu rol.");
        }

        if (data.detalles.efecto) {
          const ef = data.detalles.efecto;
          switch (ef.tipo) {
            case 'INVENTARIO':
              mensajes.push(`🎁 Casilla: Ganaste ${ef.cantidad} de ${ef.recursoGanado}.`);
              break;
            case 'CHORIPAN':
              mensajes.push(`🌭 ¡Choripán! +1 a todos los recursos.`);
              break;
            case 'HIELO':
              mensajes.push(`❄️ ¡Hielo! Te congelaste (pierdes turno).`);
              break;
            case 'RIO':
            case 'CASCADA':
            case 'DUNA':
              mensajes.push(`🌊 ¡Caíste en ${ef.tipo}! Resbalas hacia atrás.`);
              break;
            case 'VOLANTIN':
              mensajes.push(`🪁 ¡Volantín! Avanzas 2 espacios extra.`);
              break;
            case 'MAREJADA':
              mensajes.push(`🌊 ¡Marejada! Retrocedes y pierdes Pegamento.`);
              break;
            case 'AVALANCHA':
              mensajes.push(`🏔️ ¡Avalancha! Retrocedes y pierdes Madera.`);
              break;
            case 'TERREMOTO':
              mensajes.push(`🌍 ¡Terremoto! Pierdes todos tus recursos.`);
              break;
            case 'FONDA':
              mensajes.push(`🍷 ¡Fonda! Tira el dado de nuevo.`);
              break;
            default:
              break;
          }
        }

        if (mensajes.length > 0) {
          setNotificacion(mensajes.join(" ")); 
          setTimeout(() => setNotificacion(null), 5000);
        }
      }

      refrescarTablero();
    };

// Listener para recibir ofertas de negociación 
const handleOfertaRecibida = (data) => {
  try {
    const currentJugadores = jugadoresRef.current || [];
    const myJugador = currentJugadores.find(j => Number(j.usuarioID) === Number(usuarioIdActual));
    if (!myJugador) {
      console.log(" Oferta recibida pero mi jugador aún no está cargado. Reintentando...");
      setTimeout(() => handleOfertaRecibida(data), 80);
      return;
    }

    if (Number(data.paraJugadorId) !== Number(myJugador.id)) {
      console.log("Oferta recibida pero no soy el destinatario.");
      return;
    }

    console.log(" Oferta recibida para mí:", data);
    setOfertaRecibida(data);
  } catch (e) {
    console.error("Error en handleOfertaRecibida:", e);
  }
};



    // Listener para cuando se acepta/rechaza una oferta
    const handleRespuestaNegociacion = (data) => {
      console.log("✅/❌ Respuesta negociación:", data);
      
      if (data.aceptada) {
        setNotificacion("✅ ¡Oferta aceptada! Recursos intercambiados.");
      } else {
        setNotificacion("❌ Oferta rechazada.");
      }
      
      setTimeout(() => setNotificacion(null), 3000);
      refrescarTablero();
    };

    socket.on("juego_actualizado", handleJuegoActualizado);
    socket.on("oferta_negociacion", handleOfertaRecibida);
    socket.on("respuesta_negociacion", handleRespuestaNegociacion);

    return () => {
      console.log("🔌 Desconectando socket...");
      socket.off("juego_actualizado", handleJuegoActualizado);
      socket.off("oferta_negociacion", handleOfertaRecibida);
      socket.off("respuesta_negociacion", handleRespuestaNegociacion);
      socket.disconnect();
    };
  }, [partidaId, refrescarTablero, usuarioIdActual]);

  useEffect(() => {
    if (partidaFinalizada && ranking && jugadores.length > 0 && usuarioIdActual) {
      const myJugador = jugadores.find(j => j.usuarioID == usuarioIdActual);
      if (myJugador) {
        const myId = myJugador.id;
        let puesto = null;
        if (ranking.primero?.jugadorID === myId) puesto = 1;
        else if (ranking.segundo?.jugadorID === myId) puesto = 2;
        else if (ranking.tercero?.jugadorID === myId) puesto = 3;

        setSoyGanador(puesto === 1);
        setMiPuesto(puesto);
      }
    }
  }, [partidaFinalizada, ranking, jugadores, usuarioIdActual]);

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
  const jugadorActual = jugadores.find((j) => j.usuarioID == usuarioIdActual);
  const otrosJugadores = jugadores.filter((j) => j.usuarioID != usuarioIdActual);

  const esMiTurno = turnoActual && Number(turnoActual.usuarioID) === Number(usuarioIdActual);
  const nivelActual = Number(jugadorActual?.nivel ?? 1);
  const NIVEL_MAX = 3;
  const estaEnNivelMaximo = nivelActual >= NIVEL_MAX;
  const madera = jugadorActual?.inventario?.madera ?? 0;
  const pegamento = jugadorActual?.inventario?.pegamento ?? 0;
  const clavo = jugadorActual?.inventario?.clavo ?? 0;
  const puedeEvolucionar = !!jugadorActual?.permisos?.p_evolucionar;
  const puedeConstruir = !!jugadorActual?.permisos?.p_construir;

  const rolColor = (rol) => {
    switch (rol) {
      case "Huaso": return "#DA291C";
      case "Marinero": return "#0032A0";
      case "Minero": return "#FFF";
      default: return "#666";
    }
  };
  const rolColorText = (rol) => (rol === "Minero" ? "#000" : "#FFF");
  const rolOpacidad = (rol) => (rol === "Minero" ? "C" : "CC");

  const manejarRoll = async () => {
    if (!turnoActual || partidaFinalizada) return;
    if (!esMiTurno) return;

    setTirando(true);
    try {
      const res = await fetch(`https://dcchoripan-api.onrender.com/turnos/${partidaId}/roll`, {
        method: "POST",
        headers: getAuthHeader(),
      });

      if (!res.ok) {
        console.error("Error roll:", await res.text());
        setTirando(false);
        return;
      }

      const data = await res.json();
      
      if (data.partida && data.partida.estado === "finalizada") {
        setTirando(false);
        return; 
      }

      if (data.detalles) {
        setDado1Resultado(data.detalles.dados.dado1);
        setDado2Resultado(data.detalles.dados.dado2);
        
        const esFonda = data.detalles.efecto && data.detalles.efecto.tipo === 'FONDA';
        
        if (esFonda) {
            setDadosTirados(false); 
            setTirando(false);      
        } else {
            setDadosTirados(true);  
            setTimeout(() => setTirando(false), 2000); 
        }

        setJugadores(prev => prev.map(j => 
          j.id === jugadorActual.id ? { ...j, casillaNumero: data.detalles.casillafinal } : j
        ));
      }

    } catch (err) {
      console.error("Error fetch roll:", err);
      setTirando(false);
    }
  };

  const manejarTerminarTurno = async () => {
    if (partidaFinalizada) return;
    try {
      await fetch(`https://dcchoripan-api.onrender.com/turnos/${partidaId}/siguiente`, {
        method: "POST",
        headers: getAuthHeader(),
      });
      setDado1Resultado(null);
      setDado2Resultado(null);
      setDadosTirados(false);
    } catch (err) {
      console.error("Error terminar turno:", err);
    }
  };

  const abrirModalEvolucion = () => {
    if (!puedeEvolucionar || partidaFinalizada || !dadosTirados) return;
    setAccionError(null);
    setTipoAccion("EVOLUCION");
  };
  
  const abrirModalEscalera = () => {
    if (!puedeConstruir || partidaFinalizada || !dadosTirados) return;
    setAccionError(null);
    setTipoAccion("ESCALERA");
  };

  const abrirModalNegociar = () => {
    if (partidaFinalizada || !dadosTirados) return;
    setMostrarModalNegociar(true);
  };

  const cerrarModalAccion = () => {
    if (accionCargando) return;
    setTipoAccion(null);
    setAccionError(null);
  };

  const confirmarAccion = async () => {
    if (!jugadorActual || !tipoAccion) return;
    setAccionCargando(true);
    try {
      let url = "";
      if (tipoAccion === "EVOLUCION") {
        url = `https://dcchoripan-api.onrender.com/jugadores/${partidaId}/${jugadorActual.id}/evolucionar`;
      } else if (tipoAccion === "ESCALERA") {
        url = `https://dcchoripan-api.onrender.com/jugadores/${partidaId}/${jugadorActual.id}/construir-escalera`;
      }

      const res = await fetch(url, { method: "POST", headers: getAuthHeader() });
      if (!res.ok) throw new Error("Error en la acción");
      
      setTipoAccion(null);
    } catch (err) {
      setAccionError(err.message);
    } finally {
      setAccionCargando(false);
    }
  };

  const manejarVolverInicio = () => navigate("/partidas");

  return (
    <div className="tablero-container">
      {tirando && dado1Resultado != null && dado2Resultado != null && (
        <div className="overlay-dados">
          <div className="circulo-dados">
            <img src={`/dados/dado${dado1Resultado}.svg`} className="dado-imagen" alt="D1" />
            <img src={`/dados/dado${dado2Resultado}.svg`} className="dado-imagen" alt="D2" />
          </div>
        </div>
      )}

      {tipoAccion && jugadorActual && (
        <div className="overlay-evolucion">
          <div className="modal-evolucion">
            <button className="modal-evolucion-cerrar" onClick={cerrarModalAccion}>✕</button>
            <img
              src={tipoAccion === "EVOLUCION" ? "/Group 247.png" : "/Group 247 (1).png"}
              alt="Accion"
              className="modal-evolucion-imagen"
              onClick={confirmarAccion}
            />
            <p className="modal-evolucion-resumen">
              {tipoAccion === "EVOLUCION" ? (
                <>Recursos: {madera} M, {pegamento} P, {clavo} C.<br />Nivel: {nivelActual} / {NIVEL_MAX}</>
              ) : (
                <>Coste: 2 de cada uno. Tienes: {madera} M, {pegamento} P, {clavo} C.</>
              )}
            </p>
            {accionError && <p className="evolucion-error">{accionError}</p>}
            {accionCargando && <p className="evolucion-loading">Procesando...</p>}
          </div>
        </div>
      )}

      {mostrarModalNegociar && jugadorActual &&  (
        <ModalNegociacion
          jugadorActual={jugadorActual}
          otrosJugadores={otrosJugadores}
          partidaId={partidaId}
          onClose={() => setMostrarModalNegociar(false)}
          getAuthHeader={getAuthHeader}
        />
      )}

      {ofertaRecibida && (
        <ModalNegociacion
          esReceptor={true}
          ofertaRecibida={ofertaRecibida}
          jugadorActual={jugadorActual}
          otrosJugadores={otrosJugadores}
          partidaId={partidaId}
          onClose={() => setOfertaRecibida(null)}
          getAuthHeader={getAuthHeader}
        />
      )}
      {mostrarLeyenda && (
        <ModalLeyenda onClose={() => setMostrarLeyenda(false)} />
      )}

      {partidaFinalizada && ranking && (
        <div className="overlay-fin-partida">
          <div className="modal-fin">
            <button className="modal-fin-cerrar" onClick={manejarVolverInicio}>✕</button>
            {soyGanador ? (
              <>
                <img src={"/Group 250.png"} alt="Ganaste" className="modal-fin-imagen" />
                <p className="modal-fin-texto">¡Felicitaciones! Ganaste la partida.</p>
              </>
            ) : (
              <>
                <h2 className="modal-fin-titulo">Se acabó la partida...</h2>
                <p className="modal-fin-texto">Perdiste. Puesto: {miPuesto ?? "?"}.</p>
              </>
            )}
            <button className="modal-fin-boton" onClick={manejarVolverInicio}>
              <img src={"/Group 233.png"} alt="Volver" className="modal-fin-boton-img" />
            </button>
          </div>
        </div>
      )}

      {notificacion && (
      <div className="notificacion-flotante">
          {notificacion}
        </div>
      )}

      <div className="turno-box">
        <span className="turno-text">Turno de:</span>
        {turnoActual ? (
          <img src={`/iconos/${turnoActual.rol}.svg`} alt="Rol" className="turno-icon" />
        ) : (
          <span className="turno-cargando">...</span>
        )}
      </div>

      <div className="tablero">
        {ordenFinal.map((num) => {
          const jugadoresEnCasilla = jugadores.filter((j) => j.casillaNumero === num);
          return (
            <div key={num} className="casilla" style={{ zIndex: num, position: "relative" }}>
              <img src={`/casillas/Casilla ${num}.svg`} alt="" className="casilla-imagen" draggable="false"/>
              <div className="casilla-peones">
                {jugadoresEnCasilla.map((j, idx) => (
                  <img
                    key={j.id}
                    src={`/peones/${j.rol}.svg`}
                    className="peon"
                    style={{ zIndex: 1000 + num + idx }}
                    alt={j.rol}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {otrosJugadores.map((jug, idx) => (
        <div key={jug.id} className={`info-jugador-container-top info-jugador-top-${idx + 1}`}>
          <div className="info-jugador-top" style={{ background: rolColor(jug.rol), color: rolColorText(jug.rol) }}>
            {(jug.congelado_hasta > 0) && <span style={{fontSize:'24px', marginRight:'5px'}}>❄️</span>}
            
            <img src={`/iconos/${jug.rol}.svg`} className="icono-rol-top" alt="" />
            <span className="nombre-top">{jug.nombre_usuario || jug.nombre || 'Jugador'}</span>
            <span className="nivel-top">Nivel {jug.nivel}</span>
          </div>
          <div className="info-jugador-inferior" style={{ background: rolColor(jug.rol) + rolOpacidad(jug.rol), color: rolColorText(jug.rol) }}>
            <div className="inventario-item"><span>{jug.inventario.madera}</span><img src="/inventario/madera.svg" alt="" /></div>
            <div className="inventario-item"><span>{jug.inventario.pegamento}</span><img src="/inventario/pegamento.svg" alt="" /></div>
            <div className="inventario-item"><span>{jug.inventario.clavo}</span><img src="/inventario/clavo.svg" alt="" /></div>
          </div>
        </div>
      ))}

      {jugadorActual && (
        <div className="info-jugador-container">
          <div className="info-jugador-superior" style={{ backgroundColor: rolColor(jugadorActual.rol), color: rolColorText(jugadorActual.rol) }}>
            {(jugadorActual.congelado_hasta > 0) && <span style={{fontSize:'24px', marginRight:'5px'}}>❄️</span>}
            <img src={`/iconos/${jugadorActual.rol}.svg`} alt="Rol" className="icono-rol" />
            <span className="nivel">Nivel {jugadorActual.nivel}</span>
          </div>
          <div className="info-jugador-inferior" style={{ backgroundColor: rolColor(jugadorActual.rol) + rolOpacidad(jugadorActual.rol), color: rolColorText(jugadorActual.rol) }}>
            <div className="inventario-item"><span>{jugadorActual.inventario.madera || 0}</span><img src="/inventario/madera.svg" alt="" /></div>
            <div className="inventario-item"><span>{jugadorActual.inventario.pegamento || 0}</span><img src="/inventario/pegamento.svg" alt="" /></div>
            <div className="inventario-item"><span>{jugadorActual.inventario.clavo || 0}</span><img src="/inventario/clavo.svg" alt="" /></div>
          </div>
        </div>
      )}

      {/* ==================== LOGICA DE BOTONES ==================== */}
      {jugadorActual && esMiTurno && !partidaFinalizada && (
        <div className="acciones-derecha">
          {jugadorActual.congelado_hasta > 0 ? (
             dadosTirados ? (
                <button className="boton-accion-derecha" onClick={manejarTerminarTurno}>Terminar turno</button>
             ) : (
                <div style={{ textAlign: 'center' }}>
                   <div style={{ 
                      background: 'rgba(0,0,0,0.7)', 
                      color: '#00BFFF', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      marginBottom: '10px',
                      fontFamily: 'Lemon',
                      border: '2px solid #00BFFF',
                      fontSize: '14px'
                   }}>
                     ❄️ ESTÁS CONGELADO ❄️
                   </div>
                   <button 
                     className="boton-accion-derecha" 
                     onClick={manejarTerminarTurno}
                     style={{ backgroundColor: '#555', borderColor: '#aaa' }}
                   >
                     Pasar Turno
                   </button>
                </div>
             )
          ) : (
             <>
               <button 
                 className="boton-accion-derecha" 
                 onClick={abrirModalEscalera} 
                 disabled={!puedeConstruir || !dadosTirados}
               >
                 Construir escalera
               </button>
               
               <button 
                 className="boton-accion-derecha" 
                 onClick={abrirModalEvolucion} 
                 disabled={!puedeEvolucionar || estaEnNivelMaximo || !dadosTirados}
               >
                 Evolucionar
               </button>
               
               <button 
                 className="boton-accion-derecha" 
                 onClick={abrirModalNegociar}
                 disabled={!dadosTirados}
               >
                 Negociar
               </button>
               
               <button className="boton-accion-derecha" onClick={manejarTerminarTurno}>
                 Terminar turno
               </button>
            
             </>
          )}
        

        </div>
      )}
          <div className="ayuda-fixed">
            <button
              className="boton-accion-derecha boton-ayuda"
              onClick={() => setMostrarLeyenda(true)}
            >
              ?
            </button>
          </div>

      {jugadorActual && (
        <button
          className="boton-lanzar"
          onClick={manejarRoll}
          disabled={
            !esMiTurno ||
            partidaFinalizada ||
            tirando ||
            dadosTirados ||
            (jugadorActual.congelado_hasta > 0)
          }
          style={{ 
            opacity: (jugadorActual.congelado_hasta > 0 && esMiTurno) ? 0.5 : 1,
            filter: (jugadorActual.congelado_hasta > 0 && esMiTurno) ? 'grayscale(100%)' : 'none'
          }}
        >
          <img
            src={
              (esMiTurno && !partidaFinalizada && !tirando && !dadosTirados && jugadorActual.congelado_hasta === 0)
                ? "/dados/boton_turno.svg"
                : "/dados/dado_desactivado.svg"
            }
            className="img-boton-dados"
            alt="Lanzar"
          />
        </button>
      )}
    </div>
  );
}