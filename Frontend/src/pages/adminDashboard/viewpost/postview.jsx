// PostsView.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin';
import './postview.css';

function PostsView() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleDeletePost = async (id) => {
        try {
            await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' });
            setPosts(posts.filter(post => post.id !== id)); 
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleViewPost = (id) => {
        navigate(`/admin/posts/post/${id}`); 
    };
const downloadPostsCsv = async () => {
    try {
        const response = await fetch('http://localhost:3000/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');

        const posts = await response.json();
        const headers = [
            "ID", "Descripción", "Usuario", "Categoría", "Fecha y Hora", "Anónimo", "Imagen", "Likes"
        ];
        const csvContent = [
            headers.join(","),
            ...posts.map(post => [
                post.id, 
                `"${post.descripción.replace(/"/g, '""')}"`, 
                post.códigousuario,
                post.categoría,
                post.fechahora,
                post.anónimo,
                post.imagen ? post.imagen : "N/A", 
            ].join(","))
        ].join("\n");

        const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "posts.csv");
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
            <h1>Lista de Posts</h1>
            <button onClick={downloadPostsCsv} style={{ marginBottom: '20px' }}>Descargar CSV</button>
            <table className="posts-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.descripción}</td>
                            <td>{post.códigousuario}</td>
                            <td>
                                <button onClick={() => handleViewPost(post.id)}>Ver</button>
                                <button onClick={() => handleDeletePost(post.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PostsView;
