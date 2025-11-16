import React from 'react';
// Outlet es un 'espacio' donde React Router pondrá la página que corresponda
import { Outlet } from 'react-router-dom'; 
import NavBar from './NavBar.jsx';

/**
 * Este componente 'envuelve' las páginas del juego 
 * (Instrucciones, Lobby, etc.) para que SÍ tengan la NavBar.
 */
function MainLayout() {
  return (
    <div>
      <NavBar />
      
      {/* El componente 'Outlet' renderizará la ruta hija
        (ej. <InstruccionesPage />, <NosotrosPage />, etc.)
      */}
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
