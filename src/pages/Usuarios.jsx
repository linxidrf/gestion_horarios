import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { obtenerUsuarios } from "../services/api";
import "../styles/styles.css"; // Ajusta la ruta según sea necesario

const Usuarios = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await obtenerUsuarios();
            setUsers(data);
        };
        fetchData();
    }, []);

    return (
        <div className="User-content">
            <div className="top-bar">
                <h1>Lista de Usuarios</h1>
            </div>
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cargo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id_usuario}>
                                    <td>{user.id_usuario}</td>
                                    <td>{user.nombre}</td>
                                    <td>{user.apellido}</td>
                                    <td>{user.cargo}</td>
                                    <td>{user.estado}</td>
                                    <td className="action-buttons">
                                        <button className="action-btn edit-btn">
                                            <FaEdit />
                                        </button>
                                        <button className="action-btn delete-btn">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No hay usuarios disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Usuarios;
