import { readFile, writeFile } from 'fs/promises';
import moment from 'moment-timezone';
const archivoComentarios = 'posts/comentarios.json';

export async function cargarComentarios() {
    try {
        const data = await readFile(archivoComentarios, 'utf8');
        console.log("Estamos cargar archivos");
        // console.log(JSON.parse(data).comments);
        return JSON.parse(data).comments;
    } catch (error) {
        console.error('Error al cargar comentarios:', error);
        return [];
    }
}

export async function guardarComentarios(comments) {
    try {
        const data = JSON.stringify({ comments }, null, 2);
        await writeFile(archivoComentarios, data, 'utf8');
        console.log('Comentarios guardados exitosamente');
    } catch (error) {
        console.error('Error al guardar comentarios:', error);
        throw error;
    }
}

export async function crearComentario(comentarioData) {
    const comments = await cargarComentarios();
    const newId = comments.length + 1; 
    comentarioData.id = newId;
    comentarioData.timestamp = moment().tz("America/Mexico_City").format()
    comments.push(comentarioData);
    await guardarComentarios(comments);
    return comentarioData;
}

export async function obtenerComentariosPorPost(postId) {
    const comments = await cargarComentarios();
    // console.log('Obteniendo posts');
    // console.log(postId);
    // console.log(comments.filter(comments => comments.postId == postId));
    return comments.filter(comments => comments.postId == postId);
}
