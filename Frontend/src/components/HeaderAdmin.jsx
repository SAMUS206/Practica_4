import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderAdmin.css';

function HeaderAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="nav justify-content-center">
      <Link className="nav-link active" to="/admin">Dashboard</Link>
      <Link className="nav-link" to="/admin/load">Carga Masiva</Link>
      <Link className="nav-link" to="/admin/reportes">Reportes</Link>
      <Link className="nav-link" to="/admin/userview">Vista de Usuarios</Link>
      <Link className="nav-link" to="/admin/posts">Vista de Posts</Link>
      <button onClick={handleLogout} className="nav-link btn btn-link">Cerrar Sesión</button>
    </nav>
  );
}

export default HeaderAdmin;
