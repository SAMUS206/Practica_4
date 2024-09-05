import React from 'react';
import HeaderAdmin from '../../components/HeaderAdmin';
import './adminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <HeaderAdmin />
      <div className="dashboard-content">
        <h1>Panel de Administración</h1>
        <div className="dashboard-stats">
          <div className="stat-item">
            <h2>Total Usuarios</h2>
            <p>1500</p>
          </div>
          <div className="stat-item">
            <h2>Posts Recientes</h2>
            <p>45 nuevos</p>
          </div>
        </div>
        <div className="dashboard-shortcuts">
          <button onClick={() => console.log('Ir a usuarios')}>Gestionar Usuarios</button>
          <button onClick={() => console.log('Ir a posts')}>Gestionar Posts</button>
        </div>
        <div className="dashboard-alerts">
          <h2>Alertas</h2>
          <p>No hay alertas nuevas.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

