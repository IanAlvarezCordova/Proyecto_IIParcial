import React, { useState } from "react";
import './GestionUsuarios.css';

interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

const GestionUsuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [nombre, setNombre] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const agregarUsuario = () => {
        if (nombre.trim() && email.trim()) {
            const nuevoUsuario: Usuario = {
                id: Date.now(),
                nombre,
                email
            };
            setUsuarios([...usuarios, nuevoUsuario]);
            setNombre('');
            setEmail('');
        } else {
            alert("Todos los campos son obligatorio");
        }
    };

    const eliminarUsuario = (id: number) => {
        const nuevoArray = usuarios.filter((usuario) => usuario.id !== id);
        setUsuarios(nuevoArray);
    };

    const actualizarUsuario = (id: number) => {
        const nuevoArray = usuarios.map((usuario) => {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                usuario.email = email;
            }
            return usuario;
        });
        setUsuarios(nuevoArray);
    };

    return (
        <div className="contenedor">
            <h1>Gestión de Usuarios</h1>
            <div className="formulario">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={agregarUsuario}>Guardar</button>
            </div>

            <h2>Lista de Usuarios</h2>
            <ul className="lista">
                {usuarios.map((usuario) => (
                    <li key={usuario.id}>
                        <span>{usuario.id} - {usuario.nombre} - {usuario.email}</span>
                        <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                        <button onClick={() => actualizarUsuario(usuario.id)}>Actualizar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GestionUsuarios;
