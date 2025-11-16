import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api.js'; // Importamos directo la API
import '../assets/styles/authPage.css'; // Reutilizamos el CSS

function RegistroPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    try {
      // Usamos los campos correctos (nombre_usuario)
      await api.signup(formData.username, formData.email, formData.password);
      // Éxito, redirigimos a Login
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h1 className="header-title">Registrarse</h1>
          <div className="header-spacer"></div>
        </div>
      </header>

      <main id="section-login" className="login-section">
        <div className="login-wrapper">
          <div className="login-form-container">
            
            <form className="login-form" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label htmlFor="username" className="form-label">Nombre usuario</label>
                <input 
                  type="text" 
                  id="username" 
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Correo</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="passwordConfirm" className="form-label">Repetir contraseña</label>
                <input 
                  type="password" 
                  id="passwordConfirm" 
                  className="form-input"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
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
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>

            </form>
          </div>
        </div>
      </main>

      <footer id="section-footer" className="footer-section">
        <div className="container footer-container">
          <Link to="/" className="footer-link">Regresar a página principal</Link>
          <Link to="/login" className="footer-link footer-link-register">Iniciar Sesión</Link>
        </div>
      </footer>

    </div>
  );
}

export default RegistroPage;