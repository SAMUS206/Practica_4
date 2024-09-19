import bcrypt from 'bcrypt';
import connection from '../db.js'; // Ajusta la ruta según sea necesario
import moment from 'moment-timezone';
export async function crearUsuario(usuario) {
  try {
    // Verifica si el usuario ya existe
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ?', [usuario.username]);
    if (rows.length > 0) {
      throw new Error(`El usuario con username ${usuario.username} ya existe.`);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);
    
    // Convertir valores undefined a null
    const valores = [
      usuario.username || null,
      usuario.nombres || null,
      usuario.apellidos || null,
      usuario.genero || null,
      usuario.facultad || null,
      usuario.carrera || null,
      usuario.email || null, // Asegúrate de usar el nombre correcto aquí
      hashedPassword,
      usuario.isAdmin || false
    ];

    // Insertar el nuevo usuario en la base de datos
    const [result] = await connection.execute(
      'INSERT INTO usuarios (username, nombres, apellidos, genero, facultad, carrera, email, contraseña, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      valores
    );

    usuario.id = result.insertId;
    return { ...usuario, contraseña: hashedPassword };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// Obtener todos los usuarios
export async function obtenerUsuarios() {
  try {
    const [rows] = await connection.execute('SELECT * FROM usuarios');
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Actualizar un usuario por username
export async function actualizarUsuario(username, datosUsuario) {
  try {
    // Encuentra el usuario por username
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (rows.length === 0) {
      throw new Error(`El usuario con username ${username} no existe.`);
    }

    // Si existe created_at, convertirlo al formato correcto
    if (datosUsuario.created_at) {
      datosUsuario.created_at = moment(datosUsuario.created_at).format('YYYY-MM-DD HH:mm:ss');
    }

    // Construir los campos para actualizar dinámicamente
    const campos = [];
    const valores = [];
    for (const [key, value] of Object.entries(datosUsuario)) {
      if (value !== null && value !== '' && key !== 'username') {
        campos.push(`${key} = ?`);
        valores.push(value);
      }
    }

    // Ejecutar actualización
    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE username = ?`;
    await connection.execute(sql, [...valores, username]);
    
    return datosUsuario;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}


// Eliminar un usuario por username
export async function eliminarUsuario(username) {
  try {
    // Verifica si el usuario existe
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (rows.length === 0) {
      throw new Error(`El usuario con username ${username} no existe.`);
    }

    // Elimina el usuario
    await connection.execute('DELETE FROM usuarios WHERE username = ?', [username]);

    return true;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

// Encontrar un usuario por username
export async function encontrarUsuarioPorUsername(username) {
  const query = 'SELECT * FROM usuarios WHERE username = ?';
  const [rows] = await connection.execute(query, [username]);
  return rows[0]; // Devuelve el primer resultado encontrado
}
