import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../../components/HeaderAdmin'; 
import './viewuser.css';
import { useNavigate } from 'react-router-dom'; 

function ViewUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (username) => {
    try {
      await fetch(`http://localhost:3000/users/${username}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.username !== username));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewUser = (username) => {
    navigate(`/admin/userview/user/${username}`); 
  };
  const downloadCsv = async () => {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) throw new Error('Failed to fetch users');

        const users = await response.json();
        const headers = [
            "Username", "Nombres", "Apellidos", "Género", "Facultad", 
            "Carrera", "Email", "Contraseña", "isAdmin"
        ];
        const csvContent = [
            headers.join(","),
            ...users.map(user => [
                user.username, user.nombres, user.apellidos, user.genero, user.facultad,
                user.carrera, user.mail, user.contraseña, user.isAdmin
            ].join(","))
        ].join("\n");

        const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link); 
        link.click(); 
        link.remove();
    } catch (error) {
        console.error('Error downloading CSV:', error);
    }
};

  return (
    <div>
      <HeaderAdmin />
      <button onClick={downloadCsv} style={{ marginBottom: '20px' }}>Descargar CSV</button>
      <div className="user-container">
        <h1>Usuarios de USocial</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Código/Carnet</th>
              <th>Nombres</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.nombres}</td>
                <td>
                  <button onClick={() => handleViewUser(user.username)}>Ver</button>
                  <button onClick={() => handleDeleteUser(user.username)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewUser;
