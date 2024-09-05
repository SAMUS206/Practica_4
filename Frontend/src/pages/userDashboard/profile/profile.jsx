import React, { useState, useEffect } from 'react';
import UserNavbar from '../../../components/NavBar';
import './profile.css';

function Profile() {
    const [userDetails, setUserDetails] = useState({
        username: '',
        nombres: '',
        apellidos: '',
        genero: '',
        facultad: '',
        carrera: '',
        mail: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            return;
        }

        const fetchUserDetails = async () => {
            const response = await fetch(`http://localhost:3000/users/${userId}`);
            const data = await response.json();
            setUserDetails(data);
        };
        fetchUserDetails();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
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
          // Manejo de errores de respuesta
          alert('Ocurrió un error al actualizar los datos');
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
                <input type="text" name="facultad" value={userDetails.facultad} onChange={handleInputChange} readOnly={!isEditing} />
              </label>
              <label>
                Carrera:
                <input type="text" name="carrera" value={userDetails.carrera} onChange={handleInputChange} readOnly={!isEditing} />
              </label>
              <label>
                Correo electrónico:
                <input type="email" name="email" value={userDetails.mail} onChange={handleInputChange} readOnly={!isEditing} />
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
