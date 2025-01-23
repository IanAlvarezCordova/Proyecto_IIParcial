import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/NavBar";
import Estudiantes from "./componentes/Estudiantes";
import Cursos from "./componentes/Cursos";
import Inscripciones from "./componentes/Inscripciones";
import Inicio from "./componentes/Inicio";
import Contact from "./componentes/Contact";
import "./App.css";

// Interfaces
interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

interface Curso {
  id: number;
  nombre_curso: string;
  descripcion: string;
}

interface Inscripcion {
  id: number;
  id_estudiante: number;
  id_curso: number;
  fecha: string;
  estado: string;
}

const App: React.FC = () => {
  // Estados principales
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  // Leer los datos del localStorage al cargar la aplicación
  useEffect(() => {
    const storedEstudiantes = localStorage.getItem("estudiantes");
    const storedCursos = localStorage.getItem("cursos");
    const storedInscripciones = localStorage.getItem("inscripciones");

    if (storedEstudiantes) setEstudiantes(JSON.parse(storedEstudiantes));
    if (storedCursos) setCursos(JSON.parse(storedCursos));
    if (storedInscripciones) setInscripciones(JSON.parse(storedInscripciones));
  }, []);

  // Guardar datos en el localStorage cuando cambien los estudiantes
  useEffect(() => {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
  }, [estudiantes]);

  // Guardar datos en el localStorage cuando cambien los cursos
  useEffect(() => {
    localStorage.setItem("cursos", JSON.stringify(cursos));
  }, [cursos]);

  // Guardar datos en el localStorage cuando cambien las inscripciones
  useEffect(() => {
    localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
  }, [inscripciones]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Inicio/>}
        />
        <Route
          path="/estudiantes"
          element={<Estudiantes estudiantes={estudiantes} setEstudiantes={setEstudiantes} inscripciones={[]} />}
        />
        <Route
          path="/cursos"
          element={<Cursos cursos={cursos} setCursos={setCursos} inscripciones={[]} />}
        />
        <Route
          path="/inscripciones"
          element={
            <Inscripciones
              estudiantes={estudiantes}
              cursos={cursos}
              inscripciones={inscripciones}
              setInscripciones={setInscripciones}
            />
          }
        />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
    </Router>
  );
};

export default App;
