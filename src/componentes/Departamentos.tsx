import React, { useState, useEffect } from "react";
import "./Gestion.css";

interface Departamento {
  id: number;
  nombre: string;
}

interface Empleado {
  id: number;
  nombre: string;
  idDepartamento: number;
}

interface PropsDepartamento {
  departamentos: Departamento[];
  setDepartamentos: React.Dispatch<React.SetStateAction<Departamento[]>>;
  empleados: Empleado[];
}

const Departamentos: React.FC<PropsDepartamento> = ({
  departamentos,
  setDepartamentos,
  
}) => {
  const [nombreDepartamento, setNombreDepartamento] = useState<string>("");
  const [editando, setEditando] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState<string>("");

  useEffect(() => {
    const departamentosGuardados = JSON.parse(
      localStorage.getItem("departamentos") || "[]"
    );
    setDepartamentos(departamentosGuardados);
  }, []);
  

  useEffect(() => {
    localStorage.setItem("departamentos", JSON.stringify(departamentos));
  }, [departamentos]);

  const agregarDepartamento = () => {
    if (nombreDepartamento.trim() !== "") {
      setDepartamentos([
        ...departamentos,
        { id: departamentos.length + 1, nombre: nombreDepartamento },
      ]);
      setNombreDepartamento("");
    }
  };

  const eliminarDepartamento = (id: number) => {
    // Obtener empleados directamente de localStorage
    const empleadosGuardados = JSON.parse(localStorage.getItem("empleados") || "[]");
  
    // Verificar si hay empleados que tienen asignado el departamento
    const tieneEmpleados = empleadosGuardados.some(
      (empleado: Empleado) => empleado.idDepartamento === id
    );
  
    if (tieneEmpleados) {
      alert("Este departamento tiene empleados asignados. No se puede eliminar.");
      return;
    }
  
    // Confirmar eliminación
    const confirmacion = window.confirm(
      "¿Está seguro de que desea eliminar este departamento?"
    );
  
    if (confirmacion) {
      // Filtrar y actualizar la lista de departamentos
      const nuevosDepartamentos = departamentos.filter((dep) => dep.id !== id);
      setDepartamentos(nuevosDepartamentos);
      localStorage.setItem("departamentos", JSON.stringify(nuevosDepartamentos));
    }
  };
  

  const iniciarEdicion = (id: number, nombre: string) => {
    setEditando(id);
    setNombreEditado(nombre);
  };

  const guardarEdicion = (id: number) => {
    setDepartamentos(
      departamentos.map((dep) =>
        dep.id === id ? { ...dep, nombre: nombreEditado } : dep
      )
    );
    setEditando(null);
    setNombreEditado("");
  };

  return (
    <div>
      <h1>Departamentos</h1>
      <input
        type="text"
        value={nombreDepartamento}
        onChange={(e) => setNombreDepartamento(e.target.value)}
        placeholder="Nombre del departamento"
      />
      <button onClick={agregarDepartamento}>Agregar Departamento</button>
      <table border={1} style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departamentos.map((departamento) => (
            <tr key={departamento.id}>
              <td>{departamento.id}</td>
              <td>
                {editando === departamento.id ? (
                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                  />
                ) : (
                  departamento.nombre
                )}
              </td>
              <td>
                {editando === departamento.id ? (
                  <button onClick={() => guardarEdicion(departamento.id)}>
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      iniciarEdicion(departamento.id, departamento.nombre)
                    }
                  >
                    Editar
                  </button>
                )}
                <button onClick={() => eliminarDepartamento(departamento.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Departamentos;
