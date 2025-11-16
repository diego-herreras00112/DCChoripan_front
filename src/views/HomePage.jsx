import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/HomePage.css'; // 1. Importamos tu CSS

function HomePage() {
  return (
    <section id="landing">
      {/* NOTA: Tu CSS define 'page-container' con fondo negro
        y min-height: 100vh. ¡Perfecto!
      */}
      <div className="page-container">
        <header className="landing-header">
          <nav className="auth-nav">
            <Link to="/login">Iniciar Sesión</Link>
            <span>|</span>
            <Link to="/register">Registrarse</Link>
          </nav>
        </header>
        <main className="landing-main">
          <div className="logo-container">
            
            {/* Estructura del logo SIMPLIFICADA.
              Quitamos el <div> "logo-graphic" y las clases raras.
            */}
            <img
              src="/Chile.svg"
              alt="Logo Chile en 100 Casillas"
              className="logo-image" /* Una clase simple */
            />

            <p className="logo-tagline">en 100 casillas</p>
          </div>
        </main>
      </div>
    </section>
  );
}

export default HomePage;