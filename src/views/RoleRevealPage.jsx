import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../assets/styles/RoleRevealPage.css';

const roleAssets = {
  Minero:  { img: '/minero.png',    color: '#ffd54f', tip: 'Ganas 1 🔩 cuando salga 7.' },
  Marinero:{ img: '/marinero.png',  color: '#90caf9', tip: 'Ganas 1 🧴 cuando salga 7.' },
  Huaso:   { img: '/huaso.png',     color: '#ffab91', tip: 'Ganas 1 🪵 cuando salga 7.' }
};

export default function RoleRevealPage() {
  const { user } = useAuth();             // user.id desde el token
  const { partidaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // La partida llega por state desde WaitingRoom; si no viene, intenta ser robusto
  const partida = location.state?.partida;

  const myJugador = useMemo(() => {
    if (!partida || !partida.jugadores) return null;
    return partida.jugadores.find(j => String(j.usuarioID) === String(user?.id));
  }, [partida, user]);

  if (!partida || !myJugador) {
    return (
      <div className="role-screen">
        <div className="role-card">
          <h2 className="title">No pudimos recuperar tu rol</h2>
          <p style={{marginTop: 8}}>Vuelve al lobby e intenta de nuevo.</p>
          <Link className="primary-btn" to="/partidas">Volver al Lobby</Link>
        </div>
      </div>
    );
  }

  const rol = myJugador.rol || 'Jugador';
  const asset = roleAssets[rol] ?? { img: '', color: '#1e3a8a', tip: '' };

  return (
    <section className="role-screen">
      <header className="role-header">
        <Link to="/partidas" className="logo-link">
          <img src="/Chile.svg" alt="Logo Chile" />
          <span className="logo-subtitle">en 100 casillas</span>
        </Link>
        <h1 className="page-title">¡Tu rol!</h1>
        <div className="header-spacer" />
      </header>

      <main className="role-main">
        <article className="role-card" style={{ borderColor: asset.color }}>
          <h2 className="role-name" style={{ color: asset.color }}>{rol}</h2>
          {asset.img && <img className="role-illustration" src={asset.img} alt={rol} />}
          {asset.tip && <p className="role-tip">{asset.tip}</p>}

          <button
            className="primary-btn"
            onClick={() => navigate(`/partida/${partidaId}/jugar`)}
          >
            Continuar al juego
          </button>

          <p className="small-hint">Partida #{partidaId} • Código {partida.codigo}</p>
        </article>
      </main>
    </section>
  );
}
