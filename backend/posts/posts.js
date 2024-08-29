import { readFile, writeFile } from 'fs/promises';

const archivoPosts = 'posts/posts.json';

export async function cargarPosts() {
    try {
        const data = await readFile(archivoPosts, 'utf8');
        return JSON.parse(data).posts;
    } catch (error) {
        console.error('Error al cargar posts:', error);
        return [];
    }
}

export async function guardarPosts(posts) {
    try {
        const data = JSON.stringify({ posts: posts }, null, 2);
        await writeFile(archivoPosts, data, 'utf8');
        console.log('Posts guardados exitosamente:', data);
    } catch (error) {
        console.error('Error al guardar posts:', error);
        throw error;
    }
}

export async function crearPost(postData) {
    const posts = await cargarPosts();
    const newId = posts.length + 1; 
    postData.id = newId;
    posts.push(postData);
    await guardarPosts(posts);
    return postData;
}

export async function obtenerPosts() {
    return cargarPosts();
}

export async function actualizarPostLike(id, datosPost) {
    let posts = await cargarPosts();
    const index = posts.findIndex(p => p.id == id);
    if (index !== -1) {
        // Solo actualiza los likes, si es lo que pasaste en datosPost
        posts[index].likes = datosPost.likes;
        await guardarPosts(posts);
        return posts[index];
    }
    throw new Error(`El post con id ${id} no existe.`);
}

export async function actualizarPost(id, datosPost) {
    let posts = await cargarPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...datosPost };
      await guardarPosts(posts);
      return posts[index];
    } else {
      throw new Error(`El post con id ${id} no existe.`);
    }
  }
export async function eliminarPost(id) {
    let posts = await cargarPosts();
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        throw new Error(`El post con id ${id} no existe.`);
    }
    posts.splice(postIndex, 1);
    await guardarPosts(posts);
    return true;
}
export async function obtenerCategorias() {
    const post = await cargarPosts();
    const categorias = new Set();
    post.forEach(post => {
      if (post.categoría && !categorias.has(post.categoría)) {
        categorias.add(post.categoría);
      }
    });
    return Array.from(categorias);
  }