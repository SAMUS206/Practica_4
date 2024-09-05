import React, { useEffect, useState } from 'react';
import UserNavbar from '../../components/NavBar';
import './inicio.css';

function UserHome() {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [users, setUsers] = useState({});
    const [comments, setComments] = useState({});
    const [showCommentsForPostId, setShowCommentsForPostId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const usersResponse = await fetch('http://localhost:3000/users');
                const postsResponse = await fetch('http://localhost:3000/posts');

                if (!usersResponse.ok || !postsResponse.ok) {
                    throw new Error('Error fetching data');
                }

                const usersData = await usersResponse.json();
                const postsData = await postsResponse.json();

                postsData.sort((a, b) => new Date(b.fechahora) - new Date(a.fechahora));

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
                }));

                setUsers(usersObj);
                setPosts(postsData);
                setComments(initialComments);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }

        fetchData();
    }, []);

    const handleLike = async (postId) => {
        if (likedPosts[postId]) {
            console.log('Ya diste like a este post');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/like/${postId}`, {
                method: 'PATCH',
            });
            if (response.ok) {
                const updatedPost = await response.json();
                setPosts(posts.map(p => p.id === postId ? { ...p, likes: updatedPost.likes } : p));
                setLikedPosts(prev => ({ ...prev, [postId]: true }));
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
                    'Content-Type': 'application/json'
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

    const getUserName = (userId, anonimo) => {
        return anonimo ? 'Anónimo' : (users[userId]?.nombres || 'Usuario Desconocido');
    };

    return (
        <div>
            <UserNavbar />
            <h1 className='titulo-tendencias'>Inicio</h1>
            <div className="posts-container">
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <div className="post-header">
                            <h5 className="user-name">{getUserName(post.códigousuario, post.anónimo)}</h5>
                            <div className="post-metadata">
                                <span className="post-fechaHora">{new Date(post.fechahora).toLocaleString()}</span>
                                <span className="post-category">{post.categoría}</span>
                                <span className="comment-count">Comentarios: {post.commentCount}</span>
                            </div>
                        </div>
                        <p className="post-description">{post.descripción}</p>
                        <div className="post-actions">
                            <button
                                className="like-button"
                                onClick={() => handleLike(post.id)}
                                disabled={likedPosts[post.id]}
                            >
                                {post.likes} Me gusta
                            </button>
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
                                            <span>{getUserName(comment.userId, false)} - {comment.text} - {new Date(comment.timestamp).toLocaleString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>Sin comentarios</p>
                                )}
                                <form onSubmit={(event) => handleNewComment(event, post.id)}>
                                    <input type="text" placeholder="Add a comment" required />
                                    <button type="submit">enviar</button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserHome;
