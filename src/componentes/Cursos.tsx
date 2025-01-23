import React, { useState, useEffect } from "react";

interface Curso {
  id: number;
  nombre_curso: string;
  descripcion: string;
}

interface Inscripcion {
  id: number;
  id_estudiante: number;
  id_curso: number;
}

interface PropsCursos {
  cursos: Curso[];
  setCursos: React.Dispatch<React.SetStateAction<Curso[]>>;
  inscripciones: Inscripcion[];
}

const Cursos: React.FC<PropsCursos> = ({ cursos, setCursos, inscripciones }) => {
    const [nombreCurso, setNombreCurso] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [editando, setEditando] = useState<number | null>(null);
    const [cursoEditado, setCursoEditado] = useState<Curso | null>(null);
  
    useEffect(() => {
      const cursosGuardados = JSON.parse(localStorage.getItem("cursos") || "[]");
      setCursos(cursosGuardados);
    }, []);
  
    useEffect(() => {
      localStorage.setItem("cursos", JSON.stringify(cursos));
    }, [cursos]);
  
    const agregarCurso = () => {
      if (!nombreCurso.trim() || !descripcion.trim()) {
        alert("Todos los campos son obligatorios.");
        return;
      }
      if (descripcion.length < 10) {
        alert("La descripción debe tener al menos 10 caracteres.");
        return;
      }
      setCursos([
        ...cursos,
        { id: cursos.length + 1, nombre_curso: nombreCurso, descripcion },
      ]);
      setNombreCurso("");
      setDescripcion("");
    };
  
    const iniciarEdicion = (curso: Curso) => {
      setEditando(curso.id);
      setCursoEditado({ ...curso });
    };
  
    const guardarEdicion = () => {
      if (cursoEditado) {
        setCursos(
          cursos.map((curso) =>
            curso.id === cursoEditado.id ? cursoEditado : curso
          )
        );
        setEditando(null);
        setCursoEditado(null);
      }
    };
  
    const cancelarEdicion = () => {
      setEditando(null);
      setCursoEditado(null);
    };
  
    const eliminarCurso = (id: number) => {
        // Obtener inscripciones directamente de localStorage
        const inscripcionesGuardadas = JSON.parse(localStorage.getItem("inscripciones") || "[]");
    
        // Verificar si hay incripciones que tienen asignado el curso
        const tieneInscripciones = inscripcionesGuardadas.some(
            (inscripcion: Inscripcion) => inscripcion.id_curso === id
        )
        if (tieneInscripciones) {
          alert("Este curso tiene inscripciones asociadas. No se puede eliminar.");
          return;
        }
       
        const confirmacion = window.confirm("¿Seguro que desea eliminar este curso?");
        if (confirmacion) {
             // Filtrar y actualizar la lista de cursos
             const nuevosCursos = cursos.filter((curso) => curso.id !== id);
             setCursos(nuevosCursos);
             localStorage.setItem("cursos", JSON.stringify(nuevosCursos));
        }
      };
  
    return (
      <div>
        <h1>Cursos</h1>
        <input
          type="text"
          placeholder="Nombre del curso"
          value={nombreCurso}
          onChange={(e) => setNombreCurso(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button className="guardar" onClick={agregarCurso}>Agregar Curso</button>
        <table border={1} style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) =>
              editando === curso.id ? (
                <tr key={curso.id}>
                  <td>{curso.id}</td>
                  <td>
                    <input
                      type="text"
                      value={cursoEditado?.nombre_curso || ""}
                      onChange={(e) =>
                        setCursoEditado({
                          ...cursoEditado!,
                          nombre_curso: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      value={cursoEditado?.descripcion || ""}
                      onChange={(e) =>
                        setCursoEditado({
                          ...cursoEditado!,
                          descripcion: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button className="guardar" onClick={guardarEdicion}>Guardar</button>
                    <button className="editar" onClick={cancelarEdicion}>Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={curso.id}>
                  <td>{curso.id}</td>
                  <td>{curso.nombre_curso}</td>
                  <td>{curso.descripcion}</td>
                  <td>
                    <button className="editar" onClick={() => iniciarEdicion(curso)}>Editar</button>
                    <button className="eliminar" onClick={() => eliminarCurso(curso.id)}>Eliminar</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Cursos;
  
