import React, { useState, useEffect } from "react";
import "./styles.css";

interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

interface Inscripcion {
  id: number;
  id_estudiante: number;
  id_curso: number;
}

interface PropsEstudiantes {
  estudiantes: Estudiante[];
  setEstudiantes: React.Dispatch<React.SetStateAction<Estudiante[]>>;
  inscripciones: Inscripcion[];
}

const Estudiantes: React.FC<PropsEstudiantes> = ({
  estudiantes,
  setEstudiantes,
  inscripciones,
}) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [apellidoEditado, setApellidoEditado] = useState("");
  const [correoEditado, setCorreoEditado] = useState("");

  useEffect(() => {
    const estudiantesGuardados = JSON.parse(
      localStorage.getItem("estudiantes") || "[]"
    );
    setEstudiantes(estudiantesGuardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
  }, [estudiantes]);

  const validarCorreo = (correo: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const agregarEstudiante = () => {
    if (!nombre.trim() || !apellido.trim() || !correo.trim()) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (/\d/.test(nombre) || /\d/.test(apellido)) {
      alert("El nombre y el apellido no pueden contener números.");
      return;
    }
    if (!validarCorreo(correo)) {
      alert("El correo no es válido.");
      return;
    }
    setEstudiantes([
      ...estudiantes,
      { id: estudiantes.length + 1, nombre, apellido, correo },
    ]);
    setNombre("");
    setApellido("");
    setCorreo("");
  };

  const iniciarEdicion = (id: number, nombre: string, apellido: string, correo: string) => {
    setEditando(id);
    setNombreEditado(nombre);
    setApellidoEditado(apellido);
    setCorreoEditado(correo);
  };

  const guardarEdicion = (id: number) => {
    if (!nombreEditado.trim() || !apellidoEditado.trim() || !correoEditado.trim()) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (/\d/.test(nombreEditado) || /\d/.test(apellidoEditado)) {
      alert("El nombre y el apellido no pueden contener números.");
      return;
    }
    if (!validarCorreo(correoEditado)) {
      alert("El correo no es válido.");
      return;
    }

    setEstudiantes(
      estudiantes.map((est) =>
        est.id === id
          ? { ...est, nombre: nombreEditado, apellido: apellidoEditado, correo: correoEditado }
          : est
      )
    );
    setEditando(null);
    setNombreEditado("");
    setApellidoEditado("");
    setCorreoEditado("");
  };

  const eliminarEstudiante = (id: number) => {
    const estudiantesGuardados = JSON.parse(localStorage.getItem("inscripciones") || "[]");

    const tieneInscripciones = estudiantesGuardados.some(
      (inscripcion: Inscripcion) => inscripcion.id_estudiante === id
    );

    if (tieneInscripciones) {
      alert("Este estudiante tiene inscripciones asociadas. No se puede eliminar.");
      return;
    }
    const confirmacion = window.confirm("¿Seguro que desea eliminar este estudiante?");
    if (confirmacion) {
      const nuevosEstudiantes = estudiantes.filter((est) => est.id !== id);
      setEstudiantes(nuevosEstudiantes);
      localStorage.setItem("estudiantes", JSON.stringify(nuevosEstudiantes));
    }
  };

  return (
    <div className="container">
      <h1 className="title">Gestión de Estudiantes</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="input"
        />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="input"
        />
        <button className="guardar" onClick={agregarEstudiante}>Agregar Estudiante</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est) => (
            <tr key={est.id}>
              <td>{est.id}</td>
              <td>
                {editando === est.id ? (
                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                    className="input"
                  />
                ) : (
                  est.nombre
                )}
              </td>
              <td>
                {editando === est.id ? (
                  <input
                    type="text"
                    value={apellidoEditado}
                    onChange={(e) => setApellidoEditado(e.target.value)}
                    className="input"
                  />
                ) : (
                  est.apellido
                )}
              </td>
              <td>
                {editando === est.id ? (
                  <input
                    type="email"
                    value={correoEditado}
                    onChange={(e) => setCorreoEditado(e.target.value)}
                    className="input"
                  />
                ) : (
                  est.correo
                )}
              </td>
              <td>
                {editando === est.id ? (
                  <>
                    <button
                      className="guardar"
                      onClick={() => guardarEdicion(est.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="editar"
                      onClick={() => setEditando(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="guardar"
                      onClick={() =>
                        iniciarEdicion(est.id, est.nombre, est.apellido, est.correo)
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="eliminar"
                      onClick={() => eliminarEstudiante(est.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Estudiantes;
