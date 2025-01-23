import React, { useState, useEffect } from "react";

interface Curso {
  id: number;
  nombre_curso: string;
  descripcion: string;
}

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
  fecha: string;
  estado: string;
}

interface PropsInscripciones {
  estudiantes: Estudiante[];
  cursos: Curso[];
  inscripciones: Inscripcion[];
  setInscripciones: React.Dispatch<React.SetStateAction<Inscripcion[]>>;
}

const Inscripciones: React.FC<PropsInscripciones> = ({
  estudiantes,
  cursos,
  inscripciones,
  setInscripciones,
}) => {
  const [idEstudiante, setIdEstudiante] = useState<number>(0);
  const [idCurso, setIdCurso] = useState<number>(0);
  const [fecha, setFecha] = useState<string>("");
  const [estado, setEstado] = useState<string>("Activa");
  const [editando, setEditando] = useState<number | null>(null);
  const [fechaEditada, setFechaEditada] = useState<string>("");
  const [estadoEditado, setEstadoEditado] = useState<string>("");

  // Cargar datos iniciales desde localStorage
  useEffect(() => {
    const inscripcionesGuardadas = JSON.parse(
      localStorage.getItem("inscripciones") || "[]"
    );
    setInscripciones(inscripcionesGuardadas);
  }, []);

  // Guardar datos en localStorage cuando cambien las inscripciones
  useEffect(() => {
    localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
  }, [inscripciones]);

  // Función para agregar una inscripción
  const agregarInscripcion = () => {
    if (idEstudiante !== 0 && idCurso !== 0 && fecha.trim() !== "") {
      setInscripciones([
        ...inscripciones,
        {
          id: inscripciones.length + 1,
          id_estudiante: idEstudiante,
          id_curso: idCurso,
          fecha,
          estado,
        },
      ]);
      // Resetear campos
      setIdEstudiante(0);
      setIdCurso(0);
      setFecha("");
      setEstado("Activa");
    } else {
      alert("Por favor, complete todos los campos antes de agregar una inscripción.");
    }
  };

  // Función para iniciar edición
  const iniciarEdicion = (id: number, fecha: string, estado: string) => {
    setEditando(id);
    setFechaEditada(fecha);
    setEstadoEditado(estado);
  };

  // Función para guardar cambios
  const guardarEdicion = (id: number) => {
    setInscripciones(
      inscripciones.map((ins) =>
        ins.id === id ? { ...ins, fecha: fechaEditada, estado: estadoEditado } : ins
      )
    );
    setEditando(null);
    setFechaEditada("");
    setEstadoEditado("");
  };

  // Función para eliminar una inscripción
  const eliminarInscripcion = (id: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta inscripción?")) {
      setInscripciones(inscripciones.filter((ins) => ins.id !== id));
    }
  };

  return (
    <div>
      <h1>Inscripciones</h1>

      {/* Formulario para agregar inscripciones */}
      <div>
        <select
          value={idEstudiante}
          onChange={(e) => setIdEstudiante(Number(e.target.value))}
        >
          <option value={0}>Seleccione un estudiante</option>
          {estudiantes.map((est) => (
            <option key={est.id} value={est.id}>
              {est.nombre} {est.apellido}
            </option>
          ))}
        </select>
        <select
          value={idCurso}
          onChange={(e) => setIdCurso(Number(e.target.value))}
        >
          <option value={0}>Seleccione un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nombre_curso}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Activa">Activa</option>
          <option value="Inactiva">Inactiva</option>
        </select>
        <button className="guardar" onClick={agregarInscripcion}>Agregar Inscripción</button>
      </div>

      {/* Tabla de inscripciones */}
      <table border={1} style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Curso</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inscripciones.map((ins) => {
            const estudiante = estudiantes.find((est) => est.id === ins.id_estudiante);
            const curso = cursos.find((cur) => cur.id === ins.id_curso);

            return (
              <tr key={ins.id}>
                <td>{ins.id}</td>
                <td>
                  {estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "N/A"}
                </td>
                <td>{curso ? curso.nombre_curso : "N/A"}</td>
                <td>
                  {editando === ins.id ? (
                    <input
                      type="date"
                      value={fechaEditada}
                      onChange={(e) => setFechaEditada(e.target.value)}
                    />
                  ) : (
                    ins.fecha
                  )}
                </td>
                <td>
                  {editando === ins.id ? (
                    <select
                      value={estadoEditado}
                      onChange={(e) => setEstadoEditado(e.target.value)}
                    >
                      <option value="Activa">Activa</option>
                      <option value="Inactiva">Inactiva</option>
                    </select>
                  ) : (
                    ins.estado
                  )}
                </td>
                <td>
                  {editando === ins.id ? (
                    <>
                      <button className="guardar" onClick={() => guardarEdicion(ins.id)}>Guardar</button>
                      <button className="editar" onClick={() => setEditando(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button
                      className="editar"
                        onClick={() =>
                          iniciarEdicion(ins.id, ins.fecha, ins.estado)
                        }
                      >
                        Editar
                      </button>
                      <button className="eliminar" onClick={() => eliminarInscripcion(ins.id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Inscripciones;
