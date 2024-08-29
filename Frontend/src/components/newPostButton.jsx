import React from 'react';
import { useNavigate } from 'react-router-dom';
import './newpostbutton.css'
function CreatePostButton() {
    const navigate = useNavigate();

    const handleCreatePost = () => {
        navigate('/create-post');
    };
    return (
        <button className="btn btn-primary" onClick={handleCreatePost}>Crear Post</button>
    );
}
export default CreatePostButton;
