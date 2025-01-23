import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";


const Navbar: React.FC = () => (
  <nav>
    <Link to="/">Inicio</Link>
    <Link to="/estudiantes">Estudiantes</Link>
    <Link to="/cursos">Cursos</Link>
    <Link to="/inscripciones">Inscripciones</Link>
    <Link to="/contact">Acerca de</Link>
  </nav>
);

export default Navbar;
