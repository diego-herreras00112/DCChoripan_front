import React from 'react';
import { useNavigate } from 'react-router-dom';
// Ya no necesitamos 'Link' ni 'useAuth' aquí
import '../assets/styles/RulesPage.css'; // Importamos el CSS

function InstruccionesPage() {
  const navigate = useNavigate(); // Hook para volver atrás

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1); // Vuelve a la página anterior en el historial
  };

  return (
    // ¡YA NO USAMOS el 'rules-container' completo!
    // MainLayout ya nos da el padding.
    <section id="rules-page">
      
      {/* BORRAMOS EL <header> DE AQUÍ.
        La NavBar negra de MainLayout lo reemplaza.
      */}

      <main className="rules-content" style={{ paddingTop: '20px' }}>
        <h1 className="rules-title">Reglas del Juego</h1>
        <div className="rules-text-wrapper">
          <ol className="rules-list">
            <li>Cada partida debe tener exactamente 3 jugadores, ni más ni menos.</li>
            <li>Cada jugador debe tener asignado un único rol (huaso, marinero o minero), y cada rol debe estar asignado a un único jugador.</li>
            <li>Si algún jugador sale del juego o de la partida ya iniciada, la partida termina automáticamente para todos los jugadores.</li>
            <li>Los jugadores solo pueden lanzar dados, negociar, construir escaleras y evolucionar en su propio turno. Fuera de su turno, ningún jugador puede mover, negociar, pagar costos ni activar efectos. El orden en que decida realizar las acciones posibles, es decisión del jugador.</li>
            <li>La partida termina inmediatamente cuando un jugador, ya sea por dados/escaleras/bono de nivel, queda en una casilla ≥100. No hay empates, solo juega una persona a la vez, por orden de turnos.</li>
            <li>Todos comienzan en la casilla 1 con x recursos de su especialidad.</li>
            <li>Los efectos de las casillas se aplican solo al caer exactamente en ellas, ya sea por escalera, avance de nivel, o por los dados.</li>
            <li>Si caes en el inicio de un río, cascada o duna, debes retroceder 20 casillas de inmediato.</li>
            <li>Si compras una escalera, deberás pagar por ella 2 maderas + 2 pegamentos + 2 clavos de cobre... Subes inmediatamente 1 fila (avanzas 10 casillas) ... no puedes guardar la escalera ... se puede construir máximo 1 escalera por turno por jugador.</li>
            <li>Si quieres evolucionar, deberás pagar 3 maderas + 3 pegamentos + 3 clavos de cobre... El costo se paga por cada salto de nivel, es decir, para pasar del nivel 1 al 2, y del nivel 2 al 3 ... se puede evolucionar máximo 1 vez por turno...</li>
            <li>Si negocias en tu turno, los intercambios deben ser inmediatos y simultáneos (recurso por recurso). No se permiten promesas, deudas ni pagos diferidos. Puedes negociar con uno o los dos jugadores dentro de tu turno.</li>

          </ol>
        </div>
      </main>

      <a href="#" onClick={handleBack} className="back-button">Volver</a>

    </section>
  );
}

export default InstruccionesPage;