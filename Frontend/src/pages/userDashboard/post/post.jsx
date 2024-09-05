  import UserNavbar from '../../../components/NavBar';
  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './post.css'
  
  function NewUserPost() {
    const [postDetails, setPostDetails] = useState({
      'codigousuario': localStorage.getItem('userId'),
      'descripcion': '',
      'categoria': '',
      'anonimo': false,
      'imagen': null,
    });
    const [categorias, setCategorias] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
      const cargarCategorias = async () => {
        try {
          const respuesta = await fetch('http://localhost:3000/categorias');
          const categoriasDesdeServidor = await respuesta.json();
          setCategorias(categoriasDesdeServidor);
        } catch (error) {
          console.error('Error al cargar las categorías:', error);
        }
      };
  
      cargarCategorias();}
      , []);

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      setPostDetails({
        ...postDetails,
        [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
      });
    };

    const handeExit = (e) => {
      e.preventDefault();
      navigate('/inicio');
    };
    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      
      formData.append('descripcion', postDetails['descripcion']);
      formData.append('codigousuario', postDetails['codigousuario']);
      formData.append('categoria', postDetails['categoria']);
      formData.append('anonimo', postDetails['anonimo']);
      if (postDetails['imagen']) {
        formData.append('imagen', postDetails['imagen']);
      }
      // console.log(postDetails.anonimo);
      // console.log(postDetails.categoria);
      // console.log(formData.get('descripcion'));
      // console.log(formData.get('codigousuario'));
      try {
        const response = await fetch('http://localhost:3000/posts/', {
          method: 'POST',
        
          body: formData,
        });

          if (response.ok) {
              const result = await response.json();
              alert('Post creado exitosamente!');
              navigate('/inicio'); 
          } else {
              const error = await response.json();
              console.error('Error al crear post:', error);
          }
      } catch (error) {
          console.error('Error al enviar el formulario:', error);
      }
  };

    return (
      <div className="create-post-page">
        <UserNavbar />
        <div className="create-post-container">
          <h1 className="create-post-title">Post</h1>
          <form onSubmit={handleSubmit} className="create-post-form">
          <textarea
                className="create-post-textarea"
                placeholder="Describe what you want to write in your post..."
                name="descripcion" 
                value={postDetails['descripcion']}
                onChange={handleChange}
              />
            <select
              className="create-post-select"
              name="categoria"
              value={postDetails.categoria}
              onChange={handleChange}
            >
              
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            <label className="create-post-anonymous">
              <input
                type="checkbox"
                name="anonimo"
                checked={postDetails.anonimo}
                onChange={handleChange}
              />
              Anonimo?
            </label>
            <input
              className="create-post-file-input"
              type="file"
              name="image"
              onChange={handleChange}
            />
            <div className="create-post-actions">
              <button type="submit" className="create-post-btn publish">Publish</button>
              <button type="button" className="create-post-btn cancel" onClick={handeExit}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default NewUserPost;
