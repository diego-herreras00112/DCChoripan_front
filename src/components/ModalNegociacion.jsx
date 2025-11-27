import React, { useState } from "react";
import "../assets/styles/ModalNegociacion.css";

export default function ModalNegociacion({
  esReceptor = false,
  ofertaRecibida = null,
  jugadorActual,
  otrosJugadores,
  partidaId,
  onClose,
  getAuthHeader
}) {
  const [ofrece, setOfrece] = useState({ madera: 0, pegamento: 0, clavo: 0 });
  const [pide, setPide] = useState({ madera: 0, pegamento: 0, clavo: 0 });
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const incrementar = (tipo, recurso) => {
    if (tipo === "ofrece") {
      const maxDisponible = jugadorActual.inventario[recurso] || 0;
      setOfrece(prev => ({
        ...prev,
        [recurso]: Math.min(prev[recurso] + 1, maxDisponible)
      }));
    } else {
      setPide(prev => ({
        ...prev,
        [recurso]: prev[recurso] + 1
      }));
    }
  };

  const decrementar = (tipo, recurso) => {
    if (tipo === "ofrece") {
      setOfrece(prev => ({
        ...prev,
        [recurso]: Math.max(prev[recurso] - 1, 0)
      }));
    } else {
      setPide(prev => ({
        ...prev,
        [recurso]: Math.max(prev[recurso] - 1, 0)
      }));
    }
  };

  const enviarOferta = async () => {
    if (!jugadorSeleccionado) {
      setError("Debes seleccionar un jugador para negociar.");
      return;
    }

    const totalOfrece = ofrece.madera + ofrece.pegamento + ofrece.clavo;
    const totalPide = pide.madera + pide.pegamento + pide.clavo;

    if (totalOfrece === 0 && totalPide === 0) {
      setError("Debes ofrecer o pedir al menos un recurso.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/jugadores/${partidaId}/negociar/oferta`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          deJugadorId: jugadorActual.id,
          paraJugadorId: jugadorSeleccionado.id,
          ofrece,
          pide
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar oferta");
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const responderOferta = async (aceptar) => {
    setCargando(true);
    setError(null);

    try {
      const endpoint = aceptar ? "aceptar" : "rechazar";
      const res = await fetch(`http://localhost:3000/jugadores/${partidaId}/negociar/${endpoint}`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          deJugadorId: ofertaRecibida.deJugadorId,
          paraJugadorId: jugadorActual.id
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al responder oferta");
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (esReceptor && ofertaRecibida) {
    const jugadorEmisor = otrosJugadores.find(j => j.id === ofertaRecibida.deJugadorId);

    return (
      <div className="overlay-negociacion">
        <div className="modal-negociacion">
          <button className="modal-negociacion-cerrar" onClick={onClose} disabled={cargando}>✕</button>
          
          <h2 className="modal-negociacion-titulo">
            El jugador 
            <img 
              src={`/iconos/${jugadorEmisor?.rol}.svg`} 
              alt={jugadorEmisor?.rol}
              className="icono-rol-negociacion"
            />
            quiere negociar contigo
          </h2>

          <div className="contenedor-intercambio">
            <div className="rectangulo-oferta rectangulo-izquierdo">
              <p className="label-intercambio">Ofrece:</p>
              <div className="recursos-lista">
                <RecursoDisplay recurso="madera" cantidad={ofertaRecibida.ofrece.madera} />
                <RecursoDisplay recurso="pegamento" cantidad={ofertaRecibida.ofrece.pegamento} />
                <RecursoDisplay recurso="clavo" cantidad={ofertaRecibida.ofrece.clavo} />
              </div>
            </div>

            <div className="rectangulo-oferta rectangulo-derecho">
              <p className="label-intercambio">Pide:</p>
              <div className="recursos-lista">
                <RecursoDisplay recurso="madera" cantidad={ofertaRecibida.pide.madera} />
                <RecursoDisplay recurso="pegamento" cantidad={ofertaRecibida.pide.pegamento} />
                <RecursoDisplay recurso="clavo" cantidad={ofertaRecibida.pide.clavo} />
              </div>
            </div>
          </div>

          {error && <p className="modal-negociacion-error">{error}</p>}

          <div className="botones-respuesta">
            <button 
              className="boton-respuesta boton-aceptar"
              onClick={() => responderOferta(true)}
              disabled={cargando}
            >
              Aceptar
            </button>
            <button 
              className="boton-respuesta boton-rechazar"
              onClick={() => responderOferta(false)}
              disabled={cargando}
            >
              Rechazar
            </button>
          </div>

          {cargando && <p className="modal-negociacion-loading">Procesando...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="overlay-negociacion">
      <div className="modal-negociacion">
        <button className="modal-negociacion-cerrar" onClick={onClose} disabled={cargando}>✕</button>
        
        <h2 className="modal-negociacion-titulo">Negociar recursos</h2>

        <div className="contenedor-intercambio">
          <div className="rectangulo-oferta rectangulo-izquierdo">
            <p className="label-intercambio">Ofreces:</p>
            <div className="recursos-lista">
              <RecursoControl 
                recurso="madera" 
                cantidad={ofrece.madera}
                onIncrement={() => incrementar("ofrece", "madera")}
                onDecrement={() => decrementar("ofrece", "madera")}
              />
              <RecursoControl 
                recurso="pegamento" 
                cantidad={ofrece.pegamento}
                onIncrement={() => incrementar("ofrece", "pegamento")}
                onDecrement={() => decrementar("ofrece", "pegamento")}
              />
              <RecursoControl 
                recurso="clavo" 
                cantidad={ofrece.clavo}
                onIncrement={() => incrementar("ofrece", "clavo")}
                onDecrement={() => decrementar("ofrece", "clavo")}
              />
            </div>
          </div>

          <div className="rectangulo-oferta rectangulo-derecho">
            <p className="label-intercambio">Pides:</p>
            <div className="recursos-lista">
              <RecursoControl 
                recurso="madera" 
                cantidad={pide.madera}
                onIncrement={() => incrementar("pide", "madera")}
                onDecrement={() => decrementar("pide", "madera")}
              />
              <RecursoControl 
                recurso="pegamento" 
                cantidad={pide.pegamento}
                onIncrement={() => incrementar("pide", "pegamento")}
                onDecrement={() => decrementar("pide", "pegamento")}
              />
              <RecursoControl 
                recurso="clavo" 
                cantidad={pide.clavo}
                onIncrement={() => incrementar("pide", "clavo")}
                onDecrement={() => decrementar("pide", "clavo")}
              />
            </div>
          </div>
        </div>

        <div className="seleccion-jugador">
          <p className="label-seleccion">Jugador con quien quieres negociar:</p>
          <div className="iconos-jugadores">
            {otrosJugadores.map(jugador => (
              <img
                key={jugador.id}
                src={`/iconos/${jugador.rol}.svg`}
                alt={jugador.rol}
                className={`icono-jugador-seleccionable ${jugadorSeleccionado?.id === jugador.id ? 'seleccionado' : ''}`}
                onClick={() => setJugadorSeleccionado(jugador)}
              />
            ))}
          </div>
        </div>

        {error && <p className="modal-negociacion-error">{error}</p>}

        <button 
          className="boton-negociar-enviar"
          onClick={enviarOferta}
          disabled={cargando}
        >
          Negociar
        </button>

        {cargando && <p className="modal-negociacion-loading">Enviando oferta...</p>}
      </div>
    </div>
  );
}

function RecursoControl({ recurso, cantidad, onIncrement, onDecrement }) {
  return (
    <div className="recurso-control">
      <div className="controles-cantidad">
        <button className="boton-flecha" onClick={onIncrement}>▲</button>
        <span className="cantidad-recurso">{cantidad}</span>
        <button className="boton-flecha" onClick={onDecrement}>▼</button>
      </div>
      <img src={`/inventario/${recurso}.svg`} alt={recurso} className="icono-recurso" />
    </div>
  );
}

function RecursoDisplay({ recurso, cantidad }) {
  return (
    <div className="recurso-display">
      <span className="cantidad-recurso">{cantidad}</span>
      <img src={`/inventario/${recurso}.svg`} alt={recurso} className="icono-recurso" />
    </div>
  );
}