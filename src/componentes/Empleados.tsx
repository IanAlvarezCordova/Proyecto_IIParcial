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

interface PropsEmpleados {
  departamentos: Departamento[];
  empleados: Empleado[];
  setEmpleados: React.Dispatch<React.SetStateAction<Empleado[]>>;
}

const Empleados: React.FC<PropsEmpleados> = ({
  departamentos,
  empleados,
  setEmpleados,
}) => {
  const [nombreEmpleado, setNombreEmpleado] = useState<string>("");
  const [idDepartamentoSeleccionado, setIdDepartamentoSeleccionado] =
    useState<number>(0);
  const [editando, setEditando] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState<string>("");

  useEffect(() => {
    const empleadosGuardados = JSON.parse(
      localStorage.getItem("empleados") || "[]"
    );
    setEmpleados(empleadosGuardados);
  }, []);
  

  useEffect(() => {
    localStorage.setItem("empleados", JSON.stringify(empleados));
  }, [empleados]);

  const agregarEmpleado = () => {
    if (nombreEmpleado.trim() !== "" && idDepartamentoSeleccionado !== 0) {
      setEmpleados([
        ...empleados,
        {
          id: empleados.length + 1,
          nombre: nombreEmpleado,
          idDepartamento: idDepartamentoSeleccionado,
        },
      ]);
      setNombreEmpleado("");
      setIdDepartamentoSeleccionado(0);
    }
  };

  const eliminarEmpleado = (id: number) => {
    
    if (window.confirm("¿Está seguro de que desea eliminar este empleado?")) {
      setEmpleados(empleados.filter((empleado) => empleado.id !== id));
    }
  };

  const iniciarEdicion = (id: number, nombre: string) => {
    setEditando(id);
    setNombreEditado(nombre);
  };

  const guardarEdicion = (id: number) => {
    setEmpleados(
      empleados.map((empleado) =>
        empleado.id === id ? { ...empleado, nombre: nombreEditado } : empleado
      )
    );
    setEditando(null);
    setNombreEditado("");
  };

  return (
    <div>
      <h1>Empleados</h1>
      <input
        type="text"
        value={nombreEmpleado}
        onChange={(e) => setNombreEmpleado(e.target.value)}
        placeholder="Nombre del empleado"
      />
      <select
        value={idDepartamentoSeleccionado}
        onChange={(e) => setIdDepartamentoSeleccionado(Number(e.target.value))}
      >
        <option value={0}>Seleccionar Departamento</option>
        {departamentos.map((departamento) => (
          <option key={departamento.id} value={departamento.id}>
            {departamento.nombre}
          </option>
        ))}
      </select>
      <button onClick={agregarEmpleado}>Agregar Empleado</button>
      <br />
      <table border={1} style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.id}</td>
              <td>
                {editando === empleado.id ? (
                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                  />
                ) : (
                  empleado.nombre
                )}
              </td>
              <td>
                {
                  departamentos.find(
                    (dep) => dep.id === empleado.idDepartamento
                  )?.nombre
                }
              </td>
              <td>
                {editando === empleado.id ? (
                  <button onClick={() => guardarEdicion(empleado.id)}>
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => iniciarEdicion(empleado.id, empleado.nombre)}
                  >
                    Editar
                  </button>
                )}
                <button onClick={() => eliminarEmpleado(empleado.id)}>
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

export default Empleados;
