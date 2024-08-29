// User.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin';
import './user.css';

function User() {
  const { username } = useParams(); 
  const [userDetails, setUserDetails] = useState({
    username: '',
    nombres: '',
    apellidos: '',
    email: '',
    isAdmin: false,
    
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/users/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      navigate('/admin/userview');
    } catch (error) {
      console.error('Error al actualizar los detalles del usuario:', error);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      {userDetails ? (
        <form onSubmit={handleSubmit} className="user-details-container">
          <h1>Detalles del Usuario</h1>
          <label>
            Username (Carnet):
            <input type="text" value={userDetails.username} disabled />
          </label>
          <label>
            Nombres:
            <input type="text" name="nombres" value={userDetails.nombres} onChange={handleInputChange} disabled={!isEditing} />
          </label>
          <label>
            Apellidos:
            <input type="text" name="apellidos" value={userDetails.apellidos} onChange={handleInputChange} disabled={!isEditing} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={userDetails.mail} onChange={handleInputChange} disabled={!isEditing} />
          </label>
          <label>
            Es administrador:
            <input type="checkbox" name="isAdmin" checked={userDetails.isAdmin} onChange={(e) => setUserDetails({ ...userDetails, isAdmin: e.target.checked })} disabled={!isEditing} />
          </label>
          {isEditing ? (
            <div>
              <button type="submit">Guardar cambios</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
          )}
        </form>
      ) : (
        <p>Cargando detalles del usuario...</p>
      )}
    </div>
  );
}

export default User;
