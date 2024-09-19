import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { obtenerCursos, obtenerCursosPorUsuario, agregarCursoAUsuario, eliminarCursoDeUsuario } from './curses/curses.js';
import moment from 'moment-timezone';

import { crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, encontrarUsuarioPorUsername } from './users/usuarios.js';
import { crearPost, obtenerPosts, actualizarPost, eliminarPost, obtenerCategorias, cargarPosts, agregarLike, obtenerLikes, eliminarLike, verificarLike } from './posts/posts.js';
import { crearComentario, obtenerComentariosPorPost} from './posts/comentarios.js';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
  })
});

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Usuarios
app.post('/users/', async (req, res) => {
  console.log('Datos recibidos en /users/:', req.body); // Añadido para depuración
  
  const { username, nombres, apellidos, genero, facultad, carrera, mail, contraseña, isAdmin } = req.body;

  if (!username || !nombres || !apellidos || !genero || !facultad || !carrera || !mail || !contraseña) {
    return res.status(400).send({ error: 'Todos los campos son requeridos y deben ser válidos.' });
  }
  
  try {
    const usuario = await crearUsuario(req.body);
    res.status(201).send(usuario);
  } catch (error) {
    console.error('Error al crear usuario en la ruta:', error); // Añadido para depuración
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});


app.get('/users/', async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.send(usuarios);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/users/:username', async (req, res) => {
  try {
      const { username } = req.params;
      const usuario = await encontrarUsuarioPorUsername(username); // Usamos la función para encontrar el usuario en la DB
      console.log(usuario); // Agrega este log para depurar
      if (usuario) {
          res.json(usuario);
      } else {
          res.status(404).json({ error: 'Usuario no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.patch('/users/:username', async (req, res) => {
  try {
    const usuarioActualizado = await actualizarUsuario(req.params.username, req.body);
    res.send(usuarioActualizado);
  } catch (error) {
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});

app.delete('/users/:username', async (req, res) => {
  try {
    await eliminarUsuario(req.params.username);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await encontrarUsuarioPorUsername(username);

    if (user) {
      // Compara la contraseña proporcionada con la contraseña encriptada en la base de datos
      const contrasenaValida = await bcrypt.compare(password, user.contraseña);

      if (contrasenaValida) {
        // Autenticación exitosa
        res.status(200).json({
          message: 'Inicio de sesión exitoso',
          isAdmin: user.isAdmin,
          username: user.username  
        });
      } else {
        // Contraseña incorrecta
        res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
    } else {
      // Usuario no encontrado
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  }
  catch (error) {
    console.error('Error en el endpoint /login:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// Posts
app.post('/posts/', upload.single('imagen'), async (req, res) => {
  console.log('Datos del formulario:', req.body);
  console.log('Archivo:', req.file);

  try {
    const { descripcion, codigousuario, categoria, anonimo} = req.body;
    const posts = await cargarPosts();
    const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
    const newId = maxId + 1;
    const fechahora = moment().tz("America/Mexico_City").format(); 
    const likes = 0;

    const newPost = {
      id: newId,
      descripcion,
      codigousuario,
      categoria,
      fechahora,
      anonimo: anonimo === 'true',
      imagen: req.file ? `uploads/${req.file.filename}` : null, // Guarda la ruta relativa
      likes
    };
    

    const postCreado = await crearPost(newPost);
    res.status(201).json(postCreado);
  } catch (error) {
    console.error('Error al crear el post:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});


app.get('/posts/', async (req, res) => {
  try {
    const posts = await obtenerPosts();
    res.send(posts);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los posts' });
  }
});

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await cargarPosts();
    const post = posts.find(p => p.id == id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).send({ error: 'Post no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

app.patch('/posts/:id', async (req, res) => {
  try {
    const updatedPost = await actualizarPost(parseInt(req.params.id), req.body);
    res.send(updatedPost);
  } catch (error) {
    res.status(404).send({ error: 'Post no encontrado' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    await eliminarPost(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(404).send({ error: 'Post no encontrado' });
  }
});

// Likes
app.patch('/posts/like/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await cargarPosts();
    const postIndex = posts.findIndex(p => p.id == id);
    if (postIndex === -1) {
      return res.status(404).send({ error: 'Post no encontrado' });
    }
    posts[postIndex].likes += 1; 
    await actualizarPostLike(id, { likes: posts[postIndex].likes });

    res.status(200).json(posts[postIndex]);
  } catch (error) {
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// Comentarios
app.post('/comments/', async (req, res) => {

  const { postId, userId, text } = req.body;
  console.log('Datos recibidos en /comments/:', req.body);

  if (!postId || !userId || !text) {
    return res.status(400).send({ error: 'Todos los campos son requeridos' });
  }
  try {
    const newComment = await crearComentario({ postId, userId, text});
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});

app.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await obtenerComentariosPorPost(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

app.get('/comments', async (req, res) => {
  try {
    const allComments = await cargarComentarios();
    res.json(allComments);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los comentarios' });
  }
});

// Categorías
app.get('/categorias', async (req, res) => {
  try {
    const categorias = await obtenerCategorias();
    console.log('Categorías:', categorias);
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

app.post('/posts/like', async (req, res) => {
  const { postId, username } = req.body;
  try {
      console.log(postId);
      console.log(username);
      await agregarLike(postId, username);
      const likeCount = await obtenerLikes(postId);
      res.status(200).json({ message: 'Like agregado', likeCount });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

app.delete('/posts/like', async (req, res) => {
  const { postId, username } = req.body;
  try {
      await eliminarLike(postId, username);
      const likeCount = await obtenerLikes(postId);
      res.status(200).json({ message: 'Like eliminado', likeCount });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

app.get('/posts/like/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
      const likeCount = await obtenerLikes(postId);
      console.log('Número de likes:', likeCount);
      res.status(200).json({ likeCount });
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener los likes' });
  }
});




app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


// Importar funciones de cursos

// Obtener cursos de un usuario
app.get('/users/:username/courses', async (req, res) => {
  const { username } = req.params;
  try {
    const cursos = await obtenerCursosPorUsuario(username);
    res.json(cursos);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los cursos del usuario' });
  }
});


// Obtener cursos de un usuario
app.post('/users/:username/courses', async (req, res) => {
  const { username } = req.params;
  const { codigo_curso } = req.body;
  if (!codigo_curso) {
    return res.status(400).send({ error: 'El código del curso es requerido' });
  }
  try {
    await agregarCursoAUsuario(username, codigo_curso);
    res.status(201).send({ message: 'Curso agregado exitosamente' });
  } catch (error) {
    res.status(500).send({ error: 'Error al agregar el curso al usuario' });
  }
});


// Agregar curso a un usuario
app.post('/users/:username/courses', async (req, res) => {
  const { username } = req.params;
  const { codigo_curso } = req.body;
  if (!codigo_curso) {
    return res.status(400).send({ error: 'El código del curso es requerido' });
  }
  try {
    await agregarCursoAUsuario(username, codigo_curso);
    res.status(201).send({ message: 'Curso agregado exitosamente' });
  } catch (error) {
    res.status(500).send({ error: 'Error al agregar el curso al usuario' });
  }
});

// Eliminar curso de un usuario
app.delete('/users/:username/courses/:codigo_curso', async (req, res) => {
  const { username, codigo_curso } = req.params;
  try {
    await eliminarCursoDeUsuario(username, parseInt(codigo_curso, 10));
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar el curso del usuario' });
  }
});



