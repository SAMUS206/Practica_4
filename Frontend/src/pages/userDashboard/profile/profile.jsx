import React, { useState, useEffect } from 'react';
import UserNavbar from '../../../components/NavBar';
import './profile.css';

function Profile() {
      const [userDetails, setUserDetails] = useState({
        username: '',
        nombres: '',
        apellidos: '',
        genero: '',
        facultad: 'Ingenieria',
        carrera: 'Ciencias y Sistemas',
        email: '', // Asegúrate de que el nombre aquí coincida con el nombre devuelto por la base de datos
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem('userId'); // Ahora obtenemos el username
        if (!username) {
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    
                    setUserDetails(data);
                } else {
                    console.error('Error al obtener los detalles del usuario');
                }
            } catch (error) {
                console.error('Error de red o servidor:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const username = localStorage.getItem('userId');
        console.log(username)
        try {
            const response = await fetch(`http://localhost:3000/users/${username}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails)
            });
            if (response.ok) {
                alert('Datos actualizados correctamente');
                setIsEditing(false); // Cierra el modo de edición
            } else {
                alert('Ocurrió un error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
        }
    };

    return (
        <div className='All'>
            <UserNavbar />
            <div className="user-details-view">
                <h1>Detalles del Usuario</h1>
                <form onSubmit={handleSubmit} className="user-view-form">
                    <label>
                        Nombres:
                        <input type="text" name="nombres" value={userDetails.nombres} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    <label>
                        Apellidos:
                        <input type="text" name="apellidos" value={userDetails.apellidos} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    <label>
                        Género:
                        <input type="text" name="genero" value={userDetails.genero} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    <label>
                        Facultad:
                        <input type="text" name="facultad" value={userDetails.facultad} readOnly /> {/* Campo no editable */}
                    </label>
                    <label>
                        Carrera:
                        <input type="text" name="carrera" value={userDetails.carrera} readOnly /> {/* Campo no editable */}
                    </label>
                    <label>
                        Correo electrónico:
                        <input type="email" name="mail" value={userDetails.email} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    {isEditing && (
                        <div className="form-actions">
                            <button type="submit">Guardar cambios</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                        </div>
                    )}
                </form>
                {!isEditing && (
                    <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
                )}
            </div>
        </div>
    );
}

export default Profile;
