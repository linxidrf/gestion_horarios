import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css"; // Ajusta la ruta según sea necesario
import "@fortawesome/fontawesome-free/css/all.min.css"; // Asegura que los íconos funcionen

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src="../assets/geocom_logo.png" alt="Logo Principal" /> 
      </div>

      <nav className="menu">
        <ul>
          <li className="active">
            <Link to="/horario">
              <i className="fas fa-calendar-alt"></i>
              <span>Visualizar horario</span>
            </Link>
          </li>
          <li>
            <Link to="/detalles_horario">
              <i className="fas fa-file-alt"></i>
              <span>Detalles horario</span>
            </Link>
          </li>
          <li className="active">
            <Link to="/usuarios">
              <i className="fas fa-user-pen"></i>
              <span>Gestión de Usuarios</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="perfil">
        <i className="fas fa-circle-user"></i>
      </div>
    </aside>
  );
};

export default Sidebar;
  
