import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './login.css';
import imagenDeFondo from '../../Images/logotipo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data.username);
        if (data.isAdmin) {
          navigate('/admin'); 
        } else {
          navigate('/inicio');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <img src={imagenDeFondo} alt="Imagen de Fondo" className="login-background-image" />
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="login-form-group">
          <label htmlFor="username" className="login-form-label">Username:</label>
          <input
            type="text"
            id="username"
            className="login-form-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password" className="login-form-label">Password:</label>
          <input
            type="password"
            id="password"
            className="login-form-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-form-button">Login</button>
        <Link to="/register" className="register-form-button">Register</Link>
      </form>
    </div>
  );
}

export default Login;
