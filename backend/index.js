import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { cargarUsuarios, crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario } from './users/usuarios.js';
import { actualizarPostLike, obtenerCategorias, cargarPosts, crearPost, obtenerPosts, actualizarPost, eliminarPost } from './posts/posts.js';
import { cargarComentarios, guardarComentarios, crearComentario, obtenerComentariosPorPost} from './posts/comentarios.js';
import moment from 'moment-timezone';
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;  

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.post('/users/', async (req, res) => {
  const { username, nombres, apellidos, genero, facultad, carrera, mail, contraseña, isAdmin } = req.body;

  if (!username || !nombres || !apellidos || !genero || !facultad || !carrera || !mail || !contraseña) {
    return res.status(400).send({ error: 'Todos los campos son requeridos y deben ser válidos.' });
  }
  try {
    const usuario = await crearUsuario(req.body);
    res.status(201).send(usuario);
  } catch (error) {
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});

const fetchUserDetails = async () => {
  try {
    const response = await fetch(`http://localhost:3000/users/${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setUserDetails(data);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};  
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
    const usuarios = await cargarUsuarios(); 
    const usuario = usuarios.find(u => u.username === username);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
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
  const usuarios = await cargarUsuarios();
  const user = usuarios.find(u => u.username === username && u.contraseña === password);
  
  if (user) {

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      isAdmin: user.isAdmin,
      username: user.username  
    });
  } else {
    res.status(401).json({ error: 'Inicio de sesión fallido. Usuario o contraseña incorrectos.' });
  }
});


app.post('/posts/', upload.single('image'), async (req, res) => {

  try {
    const { descripcion, codigousuario, categoria, anonimo } = req.body;
      console.log(codigousuario);
      console.log(descripcion);
      console.log(categoria);
      console.log(anonimo);
      console.log(req.body);
      const posts = await cargarPosts();
      const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
      const newId = maxId + 1;
      console.log(newId)
      const fechahora = moment().tz("America/Mexico_City").format();
      const likes = 0;

      const newPost = {
          id: newId,
          descripción: descripcion,
          códigousuario: codigousuario,
          categoría: categoria,
          fechahora,
          anónimo: anonimo === 'true',
          imagen: req.file ? req.file.path : null,
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
      console.error('Error interno del servidor:', error);
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

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.post('/posts/mass_upload', upload.single('file'), async (req, res) => {
  console.log("Request received for posts/mass_upload");
  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  console.log("File uploaded:", req.file.path);

  const filePath = req.file.path;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log("File content read:", fileContent.substring(0, 100));
    const data = JSON.parse(fileContent);
    console.log("Parsed data:", data);

    if (!data.posts || !Array.isArray(data.posts)) {
      console.log("Invalid format: posts array not found");
      return res.status(400).json({ error: 'Formato de archivo incorrecto.' });
    }

    const validPosts = data.posts.filter(post => post.descripción && post.códigousuario && post.categoría && typeof post.anónimo === 'boolean');
    console.log("Valid posts:", validPosts);
    const results = [];
    
    for (const post of validPosts) {
      try {
        const postWithTimestamp = {
          ...post,
          fechahora: moment().tz("America/Mexico_City").format()
        };
        
        const createdPost = await crearPost(postWithTimestamp);
        console.log("Post created successfully:", createdPost);
        results.push(createdPost);
      } catch (error) {
        console.log("Error creating post:", error.message);
        results.push({ error: error.message, id: post.id });
      }
    }

    console.log("All posts processed, sending response");
    res.status(200).json({ message: 'Carga de posts exitosa.', results });
  } catch (error) {
    console.error("Error processing the file:", error);
    res.status(500).json({ error: 'Error al procesar el archivo.' });
  } finally {
    fs.unlinkSync(filePath);
    console.log("Temporary file deleted");
  }
});

app.post('/users/mass_upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'sin archivo.' });
  }

  const filePath = req.file.path;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (!data.users || !Array.isArray(data.users)) {
      return res.status(400).json({ error: 'Formato de archivo incorrecto.' });
    }

    const results = [];
    for (const user of data.users) {
      try {
        const createdUser = await crearUsuario(user);
        results.push(createdUser);
      } catch (error) {
        if (error.message.startsWith("El usuario con username")) {
          console.error(`Error: ${error.message}`); 
          results.push({ error: error.message, username: user.username });
        } else {
          throw error; 
        }
      }
    }

    res.status(200).json({ message: 'Proceso de carga completado, con algunos errores.', results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the file.' });
  } finally {
    fs.unlinkSync(filePath); 
  }
});

app.get('/categorias', async (req, res) => {
  try {
    const categorias = await obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});
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
    console.error('Error al dar like al post:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});
app.post('/comments/', async (req, res) => {
  const { postId, userId, text } = req.body;
  try {
    const newComment = await crearComentario({ postId, userId, text });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});
app.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  console.log('Estamos en la api de posts con el post');
  console.log(postId);
  try {
    const comments = await obtenerComentariosPorPost(postId);
    res.json(comments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});
app.get('/comments', async (req, res) => {
  try {
      const allComments = await cargarComentarios();
      res.json(allComments);
  } catch (error) {
      console.error('Failed to fetch comments:', error);
      res.status(500).send({ error: 'Error al obtener los comentarios' });
  }
});
app.post('/auxiliar', async (req, res) => {
  const { username, nombres, apellidos, genero, facultad, carrera, mail, contraseña, isAdmin } = req.body;

  if (!username || !nombres || !apellidos || !genero || !facultad || !carrera || !mail || !contraseña) {
    return res.status(400).send({ error: 'Todos los campos son requeridos y deben ser válidos.' });
  }
  try {
    const usuario = await crearUsuario(req.body);
    res.status(201).send(usuario);
  } catch (error) {
    res.status(500).send({ error: 'Error al procesar la solicitud' });
  }
});