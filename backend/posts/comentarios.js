import mysql from 'mysql2/promise';
import connection from '../db.js'; // Ajusta la ruta según sea necesario
import moment from 'moment-timezone';

// Crear un nuevo comentario
export async function crearComentario(comentarioData) {
    try {
        comentarioData.timestamp = moment().tz("America/Mexico_City").format('YYYY-MM-DD HH:mm:ss');
        const [result] = await connection.execute(
            'INSERT INTO comentarios (postId, texto, timestamp, username) VALUES (?, ?, ?, ?)',
            [comentarioData.postId, comentarioData.texto, comentarioData.timestamp, comentarioData.userId]
        );
        comentarioData.id = result.insertId;
        return comentarioData;
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        throw error;
    }
}




// Obtener comentarios por ID de post
export async function obtenerComentariosPorPost(postId) {
    try {
        const [rows] = await connection.execute('SELECT * FROM comentarios WHERE postId = ?', [postId]);
        console.log('Comentarios obtenidos:', rows); // Agrega esta línea
        return rows;
    } catch (error) {
        console.error('Error al obtener comentarios por post:', error);
        throw error;
    }
}

