import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
import '../assets/styles/authPage.css'; // Importa los estilos de Login

function LoginPage() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      
      <header id="section-header" className="header-section">
        <div className="container header-container">
          <Link to="/" className="logo">
            <img src="/Chile.svg" alt="Logo Chile" /> 
            <span className="logo-subtitle">en 100 casillas</span>
          </Link>
          <h1 className="header-title">Iniciar Sesión</h1>
          <div className="header-spacer"></div>
        </div>
      </header>

      <main id="section-login" className="login-section">
        <div className="login-wrapper">
          <div className="login-form-container">
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Correo</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer id="section-footer" className="footer-section">
        <div className="container footer-container">
          <Link to="/" className="footer-link">Regresar a página principal</Link>
          <Link to="/register" className="footer-link footer-link-register">Registrarse</Link>
        </div>
      </footer>

    </div>
  );
}

export default LoginPage;