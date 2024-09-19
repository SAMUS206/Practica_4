import React, { useState, useEffect } from 'react';
import UserNavbar from '../../../components/NavBar';
import './profile.css';

function Profile() {
    const [userDetails, setUserDetails] = useState({
        username: '',
        nombres: '',
        apellidos: '',
        genero: '',
        facultad: 'Ingenieria',
        carrera: 'Ciencias y Sistemas',
        email: '', // Asegúrate de que el nombre aquí coincida con el nombre devuelto por la base de datos
    });

    const [isEditing, setIsEditing] = useState(false);
    const [courseCode, setCourseCode] = useState('');
    const [userCourses, setUserCourses] = useState([]);

    useEffect(() => {
        const username = localStorage.getItem('userId');
        if (!username) {
            return;
        }

        const fetchUserDetails = async () => {
            try {
                // Fetch user details
                const response = await fetch(`http://localhost:3000/users/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserDetails(data);

                    // Fetch user's courses
                    const coursesResponse = await fetch(`http://localhost:3000/users/${username}/courses`);
                    if (coursesResponse.ok) {
                        const coursesData = await coursesResponse.json();
                        setUserCourses(coursesData);
                    } else {
                        console.error('Error al obtener los cursos del usuario');
                    }
                } else {
                    console.error('Error al obtener los detalles del usuario');
                }
            } catch (error) {
                console.error('Error de red o servidor:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/users/${username}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails)
            });
            if (response.ok) {
                alert('Datos actualizados correctamente');
                setIsEditing(false);
            } else {
                alert('Ocurrió un error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
        }
    };

    const handleAddCourse = async () => {
      const username = localStorage.getItem('userId');
      if (!courseCode) return;
  
      try {
          const response = await fetch(`http://localhost:3000/users/${username}/courses`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ codigo_curso: courseCode })
          });
  
          if (response.ok) {
              // Si no puedes obtener el nombre, solo actualiza el estado con el código del curso
              const newCourse = { codigo_curso: courseCode, nombre_curso: 'Nombre del Curso No Disponible' };
              setUserCourses([...userCourses, newCourse]);
              setCourseCode('');
          } else {
              alert('Ocurrió un error al agregar el curso');
          }
      } catch (error) {
          console.error('Error de red o servidor:', error);
      }
  };
  

    const handleRemoveCourse = async (codigo_curso) => {
        const username = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/users/${username}/courses/${codigo_curso}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUserCourses(userCourses.filter(course => course.codigo_curso !== codigo_curso));
            } else {
                alert('Ocurrió un error al eliminar el curso');
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
        }
    };

    return (
        <div className='All'>
            <UserNavbar />
            <div className="user-details-view">
                <h1>Detalles del Usuario</h1>
                <form onSubmit={handleSubmit} className="user-view-form">
                    <label>
                        Nombres:
                        <input type="text" name="nombres" value={userDetails.nombres} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    <label>
                        Apellidos:
                        <input type="text" name="apellidos" value={userDetails.apellidos} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    <label>
                        Género:
                        <input type="text" name="genero" value={userDetails.genero} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    <label>
                        Facultad:
                        <input type="text" name="facultad" value={userDetails.facultad} readOnly /> {/* Campo no editable */}
                    </label>
                    <label>
                        Carrera:
                        <input type="text" name="carrera" value={userDetails.carrera} readOnly /> {/* Campo no editable */}
                    </label>
                    <label>
                        Correo electrónico:
                        <input type="email" name="email" value={userDetails.email} onChange={handleInputChange} readOnly={!isEditing} />
                    </label>
                    {isEditing && (
                        <div className="form-actions">
                            <button type="submit">Guardar cambios</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                        </div>
                    )}
                </form>
                {!isEditing && (
                    <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
                )}
            </div>
            <div className="courses-section">
                <h2>Cursos Seleccionados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Código del Curso</th>
                            <th>Nombre del Curso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userCourses.map(course => (
                            <tr key={course.codigo_curso}>
                                <td>{course.codigo_curso}</td>
                                <td>{course.nombre_curso}</td>
                                <td>
                                    <button onClick={() => handleRemoveCourse(course.codigo_curso)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Agregar Curso</h2>
                <input 
                    type="text" 
                    placeholder="Código del curso" 
                    value={courseCode} 
                    onChange={(e) => setCourseCode(e.target.value)} 
                />
                <button type="button" onClick={handleAddCourse}>Agregar Curso</button>
            </div>
        </div>
    );
}

export default Profile;
