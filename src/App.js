import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu"; // Importa la barra lateral
import Horario from "./pages/Horario"; // Página de horarios
import Detalles from "./pages/Detalles"; // Página de detalles*/
import Usuarios from "./pages/Usuarios"; // Página de gestión de usuarios
import "./styles/styles.css"; // Ajusta la ruta según sea necesario

const App = () => {
  return (
    <Router>
      <div className="app-container"> 
        <Menu /> {/* Sidebar siempre visible */}

        
          <Routes>
            <Route path="/horario" element={<Horario />} /> 
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/detalles" element={<Detalles />} /> 
            <Route path="*" element={<Horario />} />
          </Routes>
        
      </div>
    </Router>
  );
};

export default App;
