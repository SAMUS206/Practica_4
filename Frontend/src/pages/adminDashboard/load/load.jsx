import React, { useState } from 'react';
import HeaderAdmin from '../../../components/HeaderAdmin';
import './load.css';

function Load() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState({ users: [], posts: [] });
  const [tab, setTab] = useState('users');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      try {
        const content = JSON.parse(e.target.result);
        if (content[tab] && Array.isArray(content[tab])) {
          setPreviewData({ ...previewData, [tab]: content[tab] });
        } else {
          alert('El archivo JSON no tiene el formato esperado.');
        }
      } catch (err) {
        alert('Error al leer el archivo: ' + err.message);
      }
    };
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const endpoint = tab === 'users' ? 'users/mass_upload' : 'posts/mass_upload';
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Carga masiva exitosa');
        setPreviewData({ users: [], posts: [] });
      } else {
        const errorResult = await response.json();
        alert('Error en la carga masiva: ' + errorResult.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir archivo: ' + error.message);
    }

    setSelectedFile(null);
  };

  const renderTable = () => {
    const data = previewData[tab];
    const headers = tab === 'users'
  ? ['username', 'Nombres', 'Apellidos', 'Genero', 'Facultad', 'Carrera', 'mail', 'Contraseña', 'isAdmin']
  : ['ID', 'Descripción', 'CódigoUsuario', 'Categoría', 'FechaHora', 'Anónimo', 'Imagen', 'Likes'];

    return (
      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={`${index}-${header}`}>{item[header.toLowerCase().replace(/\//g, '').replace(/ /g, '')]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="load-dashboard">
      <HeaderAdmin />
      <h1>Carga de Datos - USocial</h1>
      <div className="tabs-container">
        <div className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          Usuarios
        </div>
        <div className={`tab ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>
          Posts
        </div>
      </div>
      <div className="mass-upload">
        <h2>Carga Masiva {tab === 'users' ? 'de Usuarios' : 'de Posts'}</h2>
        <input type="file" onChange={handleFileChange} accept=".json" />
        <button onClick={handleFileUpload}>Cargar Archivo</button>
        {selectedFile && renderTable()}
      </div>
    </div>
  );
}

export default Load;
