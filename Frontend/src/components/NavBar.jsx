import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import plusIcon from '../Images/agregar.png';

function UserNavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Cerrar sesión');
        navigate('/login');
    };
    const handleTrendsClick = () => {
        navigate('/trending');
    };
    
    const handleProfileClick = () => {
        navigate('/profile'); 
    };
    
    const handleInicioClick = () => {
        navigate('/inicio'); 
    };
    
    const handleCreatePost = () => {
        navigate('/NewPost'); // Ruta de creación de posts
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">USocial</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active"onClick={handleInicioClick} href="#">Inicio</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#" onClick={handleTrendsClick}>Tendencias</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={handleProfileClick}>Perfil</a>
                        </li>
                        <li className="nav-item" onClick={handleCreatePost}>
                            <img src={plusIcon} alt="Crear post" className="navbar-plus-icon" />
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-link nav-link-close" onClick={handleLogout}>Cerrar sesión</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default UserNavbar;
