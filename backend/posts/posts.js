import mysql from 'mysql2/promise';
import moment from 'moment-timezone';
import connection from '../db.js'; // Ajusta la ruta según sea necesario

// Crear un nuevo post
export async function crearPost(postData) {
    try {
      const [result] = await connection.execute(
        'INSERT INTO posts (username, descripcion, categoria, anonimo, imagen) VALUES (?, ?, ?, ?, ?)',
        [postData.codigousuario, postData.descripcion, postData.categoria, postData.anonimo, postData.imagen]
      );
      postData.id = result.insertId;
      return postData;
    } catch (error) {
      console.error('Error al crear el post:', error);
      throw error;
    }
  }
  

// Obtener todos los posts
export async function obtenerPosts() {
    try {
      const [rows] = await connection.execute(`
        SELECT p.id, p.descripcion, p.categoria, p.anonimo, p.imagen, p.created_at, 
               p.username, u.username 
        FROM posts p
        LEFT JOIN usuarios u ON p.username = u.username
      `);
      return rows;
    } catch (error) {
      console.error('Error al obtener posts:', error);
      throw error;
    }
  }

// Actualizar un post por ID
export async function actualizarPost(id, datosPost) {
  try {
    const [result] = await connection.execute(
      'UPDATE posts SET descripcion = ?, categoria = ?, anonimo = ?, imagen = ? WHERE id = ?',
      [datosPost.descripcion, datosPost.categoria, datosPost.anonimo, datosPost.imagen, id]
    );
    if (result.affectedRows === 0) {
      throw new Error(`El post con id ${id} no existe.`);
    }
    return { id, ...datosPost };
  } catch (error) {
    console.error('Error al actualizar el post:', error);
    throw error;
  }
}

// Eliminar un post por ID
export async function eliminarPost(id) {
  try {
    const [result] = await connection.execute('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error(`El post con id ${id} no existe.`);
    }
    return true;
  } catch (error) {
    console.error('Error al eliminar el post:', error);
    throw error;
  }
}

export async function obtenerCategorias() {
    try {
      const [rows] = await connection.execute('SELECT DISTINCT categoria FROM posts');
      return rows.map(row => row.categoria);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  export async function cargarPosts() {
    try {
        const [rows] = await connection.execute('SELECT * FROM posts ORDER BY id DESC');
        return rows;
        } catch (error) {
            console.error('Error al cargar posts:', error);
            throw error;
        }
    
  }

  // Añadir un like
export async function agregarLike(postId, username) {
    try {
        await connection.execute(
            'INSERT INTO likes (postId, username) VALUES (?, ?)',
            [postId, username]
        );
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Ya has dado like a este post.');
        }
        throw error;
    }
}

// Eliminar un like
export async function eliminarLike(postId, username) {
    try {
        await connection.execute(
            'DELETE FROM likes WHERE postId = ? AND username = ?',
            [postId, username]
        );
    } catch (error) {
        throw error;
    }
}

// Obtener la cantidad de likes para un post
export async function obtenerLikes(postId) {
    try {
        const [rows] = await connection.execute(
            'SELECT COUNT(*) AS likeCount FROM likes WHERE postId = ?',
            [postId]
        );
        return rows[0].likeCount;
    } catch (error) {
        throw error;
    }
}

// Verificar si un usuario ya ha dado like a un post
export async function verificarLike(postId, username) {
    try {
        const [rows] = await connection.execute(
            'SELECT 1 FROM likes WHERE postId = ? AND username = ?',
            [postId, username]
        );
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
}
