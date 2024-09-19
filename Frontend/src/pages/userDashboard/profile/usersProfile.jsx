import React, { useState, useEffect } from 'react';
import UserNavbar from '../../../components/NavBar';
import './profile.css';

function UserProfile() {
    const [userDetails, setUserDetails] = useState({
        username: '',
        nombres: '',
        apellidos: '',
        genero: '',
        facultad: 'Ingenieria',
        carrera: 'Ciencias y Sistemas',
        email: '',
    });

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

    return (
        <div className='All'>
            <UserNavbar />
            <div className="user-details-view">
                <h1>Detalles del Usuario</h1>
                <form className="user-view-form">
                    <label>
                        Nombres:
                        <input type="text" name="nombres" value={userDetails.nombres} readOnly />
                    </label>
                    <label>
                        Apellidos:
                        <input type="text" name="apellidos" value={userDetails.apellidos} readOnly />
                    </label>
                    <label>
                        Género:
                        <input type="text" name="genero" value={userDetails.genero} readOnly />
                    </label>
                    <label>
                        Facultad:
                        <input type="text" name="facultad" value={userDetails.facultad} readOnly />
                    </label>
                    <label>
                        Carrera:
                        <input type="text" name="carrera" value={userDetails.carrera} readOnly />
                    </label>
                    <label>
                        Correo electrónico:
                        <input type="email" name="email" value={userDetails.email} readOnly />
                    </label>
                </form>
            </div>
            <div className="courses-section">
                <h2>Cursos Seleccionados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Código del Curso</th>
                            <th>Nombre del Curso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userCourses.map(course => (
                            <tr key={course.codigo_curso}>
                                <td>{course.codigo_curso}</td>
                                <td>{course.nombre_curso}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserProfile;
