import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "../styles/styles.css";

const columns = [
  { field: "cliente", headerName: "Cliente", width: 150 },
  { field: "turnoManana", headerName: "Turno Mañana", width: 150 },
  { field: "turnoTarde", headerName: "Turno Tarde", width: 150 },
  { field: "turnoNoche", headerName: "Turno Noche", width: 150 },
];

const rows = [
  { id: 1, cliente: "Hospital", turnoManana: "2 Personas", turnoTarde: "2 Personas", turnoNoche: "0 Personas" },
  { id: 2, cliente: "Multicliente", turnoManana: "2 Personas", turnoTarde: "3 Personas", turnoNoche: "0 Personas" },
  { id: 3, cliente: "OXXO", turnoManana: "2 Personas", turnoTarde: "2 Personas", turnoNoche: "1 Persona" },
];

const Detalles = () => {
  return (
    <div className="container">
      <div className="filter-bar">Filtrar por semana</div>
      <Typography variant="h6" gutterBottom>
        Resumen de Turnos - Semana del 3 al 9 de marzo
      </Typography>

      <div className="content">
        <div className="table-container">
          <DataGrid rows={rows} columns={columns} autoHeight />
        </div>
        <div className="actions">
          <button className="btn edit">Modificar Turnos</button>
          <button className="btn assign">Asignar Proyectos</button>
        </div>
      </div>
    </div>
  );
};

export default Detalles;
