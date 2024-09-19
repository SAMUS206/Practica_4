import pool from '../db.js';

export async function obtenerCursos() {
    const [rows] = await pool.query('SELECT * FROM cursos');
    return rows;
  }

  export const obtenerCursosPorUsuario = async (username) => {
    try {
      const query = `
        SELECT uc.codigo_curso, c.nombre_curso
        FROM user_courses uc
        JOIN cursos c ON uc.codigo_curso = c.codigo_curso
        WHERE uc.username = ?`;
      
      const [rows] = await pool.query(query, [username]);
      return rows;
    } catch (error) {
      console.error('Error al obtener cursos por usuario:', error);
      throw error;
    }
  };

  export async function agregarCursoAUsuario(username, codigo_curso) {
    try {
      await pool.query(`
        INSERT INTO user_courses (username, codigo_curso)
        VALUES (?, ?)
      `, [username, codigo_curso]);
    } catch (error) {
      throw new Error('Error al agregar el curso al usuario');
    }
  }

  export async function eliminarCursoDeUsuario(username, codigo_curso) {
    try {
      await pool.query(`
        DELETE FROM user_courses
        WHERE username = ? AND codigo_curso = ?
      `, [username, codigo_curso]);
    } catch (error) {
      throw new Error('Error al eliminar el curso del usuario');
    }
  }
  