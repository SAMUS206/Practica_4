import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin';
import './post.css'; 

function Post() {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setPostDetails(data);
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };
        fetchPostDetails();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setPostDetails({ ...postDetails, [name]: checked });
        } else {
            setPostDetails({ ...postDetails, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postDetails),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el post');
            }
            navigate('/admin/posts'); 
        } catch (error) {
            console.error('Error al actualizar los detalles del post:', error);
        }
    };

    return (
        <div>
            <HeaderAdmin />
            {postDetails ? (
                <form onSubmit={handleSubmit} className="post-details-container">
                    <h1>Detalles del Post</h1>
                    <label>
                        Descripción:
                        <textarea name="descripción" value={postDetails.descripción || ''} onChange={handleInputChange} disabled={!isEditing}></textarea>
                    </label>
                    <label>
                        Categoría:
                        <input type="text" name="categoría" value={postDetails.categoría || ''} onChange={handleInputChange} disabled={!isEditing} />
                    </label>
                    <label>
                        Usuario:
                        <input type="text" name="códigousuario" value={postDetails.códigousuario || ''} onChange={handleInputChange} disabled={!isEditing} />
                    </label>
                    <label>
                        Fecha y Hora:
                        <input type="text" name="fechahora" value={new Date(postDetails.fechahora).toLocaleString() || ''} onChange={handleInputChange} disabled={!isEditing} />
                    </label>
                    <label>
                        Anónimo:
                        <input type="checkbox" name="anónimo" checked={postDetails.anónimo || false} onChange={handleInputChange} disabled={!isEditing} />
                    </label>
                    <label>
                        Likes:
                        <input type="number" name="likes" value={postDetails.likes || 0} onChange={handleInputChange} disabled={!isEditing} />
                    </label>
                    <label>
                        Imagen URL:
                        <input type="text" name="imagen" value={postDetails.imagen || ''} onChange={handleInputChange} disabled={!isEditing} />
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
                <p>Cargando detalles del post...</p>
            )}
        </div>
    );
}

export default Post;
