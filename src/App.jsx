import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout.jsx';
import AdminRoute from './components/AdminRoute.jsx';
// No importamos ProtectedRoute

// Importa las VISTAS (Páginas)
import HomePage from './views/HomePage.jsx';
import LoginPage from './views/LoginPage.jsx';
import RegistroPage from './views/RegistroPage.jsx';
import LobbyPage from './views/LobbyPage.jsx';
import InstruccionesPage from './views/InstruccionesPage.jsx'; 
import AdminPage from './views/AdminPage.jsx';
import CreateGamePage from './views/CreateGamePage.jsx';
import JoinGamePage from './views/JoinGamePage.jsx';     // <-- ¡LÍNEA CORRECTA!
import WaitingRoomPage from './views/WaitingRoomPage.jsx';
import NosotrosPage from './views/NosotrosPage.jsx'; // <-- importa la nueva página
import RoleRevealPage from './views/RoleRevealPage.jsx';
import GameBoardPage from './views/GameBoardPage.jsx';
import GameHistoryPage from './views/GameHistoryPage.jsx';
// --- Dummy components por ahora ---


function App() {
  return (
    <div>
      <Routes>
        {/* Todas las rutas son públicas por ahora */}
        
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistroPage />} />
        
        {/* Rutas de Usuario Logueado (Lobby) */}
        <Route path="/partidas" element={<LobbyPage />} />
        <Route path="/partidas/crear" element={<CreateGamePage />} />
        <Route path="/partidas/unirse" element={<JoinGamePage />} /> {/* <-- ¡RUTA CORRECTA! */}
        <Route path="/partida/:partidaId/espera" element={<WaitingRoomPage />} />
        <Route path="/partida/:partidaId/jugar" element={<GameBoardPage />} />

        {/* Rutas que usan la NavBar negra (ej. Nosotros) */}
        <Route element={<MainLayout />}>
          <Route path="/instrucciones" element={<InstruccionesPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
        </Route>

        {/* --- RUTA DE ADMIN (Pública por ahora) --- */}
        <Route element={<AdminRoute />}> {/* Mantenemos AdminRoute por si acaso */}
          <Route path="/admin/usuarios" element={<AdminPage />} />
        </Route>

        {/* Espera y rol */}
        <Route path="/partida/:partidaId/espera" element={<WaitingRoomPage />} />
        <Route path="/partida/:partidaId/roles" element={<RoleRevealPage />} />
        {/* <Route path="/partida/:partidaId/jugar" element={<GameBoardPage />} /> */}

        <Route path="/partidas/historial" element={<GameHistoryPage />} />

      </Routes>
    </div>
  );
}


export default App;