import React, { useEffect, useState } from 'react';
import UserNavbar from '../../components/NavBar';
import moment from 'moment'; // Asegúrate de tener moment instalado
import './tendencias.css';
import { Link } from 'react-router-dom';
import'./post/post';

function Trending() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const [comments, setComments] = useState({});
    const [showCommentsForPostId, setShowCommentsForPostId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const usersResponse = await fetch('http://localhost:3000/users');
                const postsResponse = await fetch('http://localhost:3000/posts');

                if (!usersResponse.ok || !postsResponse.ok) {
                    throw new Error('Error fetching data');
                }

                const usersData = await usersResponse.json();
                const postsData = await postsResponse.json();

                // Ordenar posts por likes en lugar de fecha
                postsData.sort((a, b) => b.likes - a.likes);

                const usersObj = usersData.reduce((acc, user) => {
                    acc[user.username] = user;
                    return acc;
                }, {});

                const initialComments = {};
                await Promise.all(postsData.map(async post => {
                    const response = await fetch(`http://localhost:3000/comments/${post.id}`);
                    const commentsForPost = response.ok ? await response.json() : [];
                    initialComments[post.id] = commentsForPost;
                    post.commentCount = commentsForPost.length;

                    // Fetch likes and users who liked the post
                    const likesResponse = await fetch(`http://localhost:3000/posts/like/${post.id}`);
                    const likesData = likesResponse.ok ? await likesResponse.json() : { likeCount: 0, likedUsers: [] };
                    post.likes = likesData.likeCount;
                    setLikedPosts(prev => ({
                        ...prev,
                        [post.id]: likesData.likedUsers
                    }));
                }));

                setUsers(usersObj);
                setPosts(postsData);
                setComments(initialComments);

                // Cargar los posts que el usuario ya ha dado like
                const username = localStorage.getItem('username');
                if (username) {
                    const likedPostsPromises = postsData.map(post => 
                        fetch(`http://localhost:3000/posts/like/${post.id}`, {
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                        }).then(response => response.json().then(data => ({
                            postId: post.id,
                            liked: data.likedUsers.includes(username)
                        })))
                    );
                    const likedPostsData = await Promise.all(likedPostsPromises);
                    setLikedPosts(prev => likedPostsData.reduce((acc, { postId, liked }) => {
                        acc[postId] = liked;
                        return acc;
                    }, {}));
                }

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleLike = async (postId) => {
        if (likedPosts[postId] && Array.isArray(likedPosts[postId])) {
            console.log('Ya diste like a este post');
            return;
        }
      
        try {
            const username = localStorage.getItem('userId');
            const response = await fetch('http://localhost:3000/posts/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ postId, username })
            });
      
            if (response.ok) {
                const updatedPost = await response.json();
                console.log('Like agregado:', updatedPost);
                setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, likes: updatedPost.likeCount } : p));
                setLikedPosts(prev => ({ ...prev, [postId]: updatedPost.likedUsers || [] }));
            } else {
                console.error('No se pudo dar like al post');
            }
        } catch (error) {
            console.error('Error al dar like:', error);
        }
    };

    const handleCommentClick = (postId) => {
        setShowCommentsForPostId(showCommentsForPostId === postId ? null : postId);
    };

    const handleNewComment = async (event, postId) => {
        event.preventDefault();
        const commentText = event.target[0].value;
        try {
            const response = await fetch('http://localhost:3000/comments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ postId, userId: localStorage.getItem('userId'), text: commentText })
            });
            if (response.ok) {
                const newComment = await response.json();
                const updatedComments = comments[postId] ? [...comments[postId], newComment] : [newComment];
                setComments(prev => ({
                    ...prev,
                    [postId]: updatedComments
                }));
                event.target.reset();
            } else {
                console.error('Failed to post new comment');
            }
        } catch (error) {
            console.error('Error posting new comment:', error);
        }
    };

    const getUserName = (username, anonimo) => {
        return anonimo ? 'Anónimo' : (users[username]?.nombres || 'Usuario Desconocido');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <UserNavbar />
        <h1 className='titulo-tendencias'>Inicio</h1>
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <h5 className="user-name">
                  {post.anónimo ? 'Anónimo' : (
                    <Link to={`/user/${post.username}`}>
                      {users[post.username]?.nombres || 'Usuario Desconocido'}
                    </Link>
                  )}
                </h5>
                <div className="post-metadata">
                  <span className="post-fechaHora">
                    {moment(post.created_at).format('LLL')}
                  </span>
                  <span className="post-category">{post.categoria}</span>
                  <span className="comment-count">Comentarios: {post.commentCount}</span>
                </div>
              </div>
  
              {/* Muestra la imagen si existe */}
              {post.imagen && (
                <div className="post-image">
                  <img src={`http://localhost:3000/${post.imagen}`} alt="Imagen del post" />
                </div>
              )}
  
              <p className="post-description">{post.descripcion}</p>
              <div className="post-actions">
                <button
                  className="like-button"
                  onClick={() => handleLike(post.id)}
                  disabled={likedPosts[post.id] && likedPosts[post.id].includes(localStorage.getItem('username'))}
                >
                  {post.likes} Me gusta
                </button>
                <span className="like-users">Likes: {likedPosts[post.id]?.length || 0}</span>
                <button
                  className="comment-button"
                  onClick={() => handleCommentClick(post.id)}
                >
                  Comentar
                </button>
              </div>
    
              {showCommentsForPostId === post.id && (
                <div className="comments-section">
                  {comments[post.id] && comments[post.id].length > 0 ? (
                    comments[post.id].map(comment => (
                      <div key={comment.id} className="comment">
                        <span>{getUserName(comment.username, false)} - {comment.texto} - {moment(comment.timestamp).format('LLL')}</span>
                      </div>
                    ))
                  ) : (
                    <p>Sin comentarios</p>
                  )}
                  <form onSubmit={(event) => handleNewComment(event, post.id)}>
                    <input type="text" placeholder="Añadir un comentario" required />
                    <button type="submit">Enviar</button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
}

export default Trending;
