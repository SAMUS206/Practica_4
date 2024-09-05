import { readFile, writeFile } from 'fs/promises';
const archivoUsuarios = 'users/users.json'; 

export async function cargarUsuarios() {
  try {
      const data = await readFile(archivoUsuarios, 'utf8');
      return JSON.parse(data).users;
  } catch (error) {
      console.error('Error al cargar usuarios:', error);
      return [];
  }
}

async function guardarUsuarios(usuarios) {
  try {
    const data = JSON.stringify({ users: usuarios }, null, 2);
    await writeFile(archivoUsuarios, data, 'utf8');
    console.log('Usuarios guardados exitosamente:', data); 
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    throw error; 
  }
}



export async function crearUsuario(usuario) {
  const usuarios = await cargarUsuarios();
  if (usuarios.some(u => u.username === usuario.username)) {
    throw new Error(`El usuario con username ${usuario.username} ya existe.`);
  }

  usuarios.push(usuario);
  await guardarUsuarios(usuarios);
  return usuario;
}



export async function obtenerUsuarios() {
  return cargarUsuarios();
}

export async function actualizarUsuario(username, datosUsuario) {
  let usuarios = await cargarUsuarios();
  const index = usuarios.findIndex(u => u.username === username);
  if (index !== -1) {
    const datosParaActualizar = Object.entries(datosUsuario).reduce((acc, [key, value]) => {
      if (value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    if (Object.keys(datosParaActualizar).length === 0) {
      throw new Error('No hay datos válidos para actualizar.');
    }
    usuarios[index] = { ...usuarios[index], ...datosParaActualizar };
    await guardarUsuarios(usuarios);
    return usuarios[index];
  }
  throw new Error(`El usuario con username ${username} no existe.`);
}

export async function eliminarUsuario(username) {
  let usuarios = await cargarUsuarios();
  const usuarioExiste = usuarios.some(u => u.username === username);
  if (!usuarioExiste) {
    throw new Error(`El usuario con username ${username} no existe.`);
  }
  usuarios = usuarios.filter(u => u.username !== username);
  await guardarUsuarios(usuarios);
  return true;
}
export async function encontrarUsuarioPorUsername(username) {
  const usuarios = await cargarUsuarios();
  return usuarios.find(u => u.username === username);
}
