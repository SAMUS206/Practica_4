import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './register.css';

function Register() {
    const [user, setUser] = useState({
        username: '',
        nombres: '',
        apellidos: '',
        genero: '',
        facultad: '',
        carrera: '',
        email: '',
        contraseña: '',
        confirmarContraseña: ''
    });
    const navigate = useNavigate();
    const [error, setError] = useState(''); 
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const crearUsuario = async (usuario) => {
        const response = await fetch('http://localhost:3000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el servidor');
        }
        return await response.json();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user.contraseña !== user.confirmarContraseña) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
           
            
            const nuevoUsuario = {
                username: user.username,
                nombres: user.nombres,
                apellidos: user.apellidos,
                genero: user.genero,
                facultad: user.facultad,
                carrera: user.carrera,
                mail: user.email,
                contraseña: user.contraseña,
                 isAdmin: false 
            };

            const usuarioCreado = await crearUsuario(nuevoUsuario);
            console.log('Usuario registrado:', usuarioCreado);
            setSuccessMessage('Usuario registrado con éxito. Puede iniciar sesión ahora.');
            setError('');
         
            setUser({
                username: '',
                nombres: '',
                apellidos: '',
                genero: '',
                facultad: '',
                carrera: '',
                email: '',
                contraseña: '',
                confirmarContraseña: ''
            });
            
            setTimeout(() => navigate('/login'), 200);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            setError(error.message);
            setSuccessMessage(''); 
        }
    };

    return (
        <div className="register-container">
            <h2>Registro de Usuario</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="register-form">
                <label>Código USAC/ username</label>
                <input type="text" name="username" value={user.username} onChange={handleChange} />
                <label>Nombres</label>
                <input type="text" name="nombres" value={user.nombres} onChange={handleChange} />
                <label>Apellidos</label>
                <input type="text" name="apellidos" value={user.apellidos} onChange={handleChange} />
                <label>Género</label>
                <select name="genero" value={user.genero} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                </select>
                <label>Facultad</label>
                <input type="text" name="facultad" value={user.facultad} onChange={handleChange} />
                <label>Carrera</label>
                <input type="text" name="carrera" value={user.carrera} onChange={handleChange} />
                <label>Correo Electrónico</label>
                <input type="email" name="email" value={user.email} onChange={handleChange} />
                <label>Contraseña</label>
                <input type="password" name="contraseña" value={user.contraseña} onChange={handleChange} />
                <label>Confirmar Contraseña</label>
                
                <input
                    type="password"
                    name="confirmarContraseña"
                    value={user.confirmarContraseña}
                    onChange={handleChange}
                />
                <button type="submit">Registrar</button>
                
            </form>
        </div>
        
    );
}

export default Register;