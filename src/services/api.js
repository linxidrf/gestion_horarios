import axios from "axios";

const API_URL = "http://localhost/backend/controllers";

export const obtenerUsuarios = async () => {
    try {
        const response = await axios.get(`${API_URL}/ListaUsuarios.php`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        return [];
    }
};

export const guardarConfiguracion = async (configuracion) => {
    try {
        const response = await axios.post(`${API_URL}/HorarioController.php`, configuracion);
        return response.data;
    } catch (error) {
        console.error("Error guardando configuración:", error);
        return [];
    }
};

export const obtenerHorarios = async (semana, rotacion) => {
    try {
        const response = await axios.get(`${API_URL}/HorarioController.php`, {
            params: { semana, rotacion }
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo horarios:", error);
        return [];
    }
};

