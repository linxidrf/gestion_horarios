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

export  const guardarConfiguracion = async () => {
    try {
        const response = await axios.post(`${API_URL}/HorarioController.php`);
        return response.data;
    } catch (error) {
        console.error("Error guardando configuración:", error);
        return [];
    }
};


export const obtenerConfiguracionActiva = async () => {
    try {
        const response = await axios.post(`${API_URL}/HorarioController.php`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};


export const obtenerHorario =  (semanaSeleccionada) => {
    try {
        const response = axios.post(`${API_URL}/HorarioController.php`, {
           semanaSeleccionada 
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo horarios:", error);
        return [];
    }
};

export const generarHorario = async (historial) => {
    try {
        const response = await axios.post(`${API_URL}/HorarioController.php`, historial, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error("Error generando horario:", error);
        return [];
    }
};




export const actualizarHorario = async (datosHorario) => {
    try {
        const response = await axios.put(`${API_URL}/HorarioController.php`, datosHorario);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar horario:', error);
        throw error;
    }
};
