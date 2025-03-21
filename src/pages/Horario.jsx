import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import { guardarConfiguracion, obtenerHorarios } from "../services/api";
import Menu from "../components/Menu";
import { DataGrid } from "@mui/x-data-grid";

const Horarios = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState("");
    const [rotacionSeleccionada, setRotacionSeleccionada] = useState("1mes");
    const [listaHorarios, setListaHorarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);

    // Cargar horarios automáticamente al montar el componente
    useEffect(() => {
        obtenerHorario();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await guardarConfiguracion({
                semana: semanaSeleccionada,
                rotacion: rotacionSeleccionada,
            });
            alert("Configuración guardada correctamente");
            setModalOpen(false);
            // Después de guardar la configuración, recargar los horarios
            obtenerHorario();
        } catch (error) {
            console.error("Error al guardar configuración:", error);
            alert("Error al guardar la configuración.");
        }
    };

    const obtenerHorario = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await obtenerHorarios();
            console.log("Respuesta original de la API:", response);
            
            if (response) {
                // Procesamos los datos para un formato más simple
                const data = procesarDatosHorarios(response);
                setListaHorarios(data);
            } else {
                console.error("La respuesta de la API no tiene el formato esperado:", response);
                setError("La estructura de datos recibida no es válida.");
            }
        } catch (err) {
            console.error("Error al obtener el horario:", err);
            setError("Error al obtener el horario. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    // Función modificada para procesar los datos en un formato más simple
    const procesarDatosHorarios = (datos) => {
        const result = [];
        let idCounter = 0;
    
        // Para cada cliente
        Object.keys(datos).forEach(cliente => {
            // Creamos una fila para cada cliente
            const clienteRow = {
                id: `cliente-${cliente}-${idCounter++}`,
                cliente: cliente,
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
            };
    
            // Obtenemos todas las personas asignadas para este cliente
            const clienteData = datos[cliente];
            const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
            
            // Para cada día agregamos las personas con sus horarios
            diasSemana.forEach(dia => {
                const personas = clienteData[dia] || [];
                const diaKey = dia.replace('é', 'e');
                
                // Asignamos directamente el array de personas
                clienteRow[diaKey] = personas;
            });
            
            // Solo agregamos la fila si hay al menos una persona en algún día
            const tienePersonas = diasSemana.some(dia => 
                Array.isArray(clienteRow[dia.replace('é', 'e')]) && 
                clienteRow[dia.replace('é', 'e')].length > 0
            );
            
            if (tienePersonas) {
                result.push(clienteRow);
            }
        });
    
        console.log("Datos procesados:", result);
        return result;
    };

    const generarHorario = () => {
        obtenerHorario();
    };

    const editarHorario = () => {
        setModoEdicion(true);
    };

    const guardarCambios = () => {
        setModoEdicion(false);
        alert("Cambios guardados correctamente.");
    };

    const cancelarCambios = () => {
        setModoEdicion(false);
        obtenerHorario(); // Recargar datos originales
    };

    // Renderizado personalizado para celdas con horarios (simplificado)
    const renderCelda = (params) => {
        if (!params.value || (Array.isArray(params.value) && params.value.length === 0)) {
            return <div className="celda-vacia"></div>;
        }
        
        // Si es un array de personas
        if (Array.isArray(params.value)) {
            return (
                <div className="personas-container">
                    {params.value.map((persona, index) => (
                        <div key={index} className="persona-horario">
                            <div className="persona-nombre">{persona.nombre}</div>
                            <div className="horario-details">
                                {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        
        return <div>{params.value}</div>;
    };

    // Renderizado personalizado para la columna de clientes
    const renderClienteCell = (params) => {
        return (
            <div className="cliente-cell">
                {params.row.cliente}
            </div>
        );
    };

    // Configuración de columnas simplificadas
    const columnasDiasSemana = [
        { 
            field: 'cliente', 
            headerName: 'Cliente', 
            width: 150,
            renderCell: renderClienteCell,
            cellClassName: 'cliente-columna'
        },
        { field: 'lunes', headerName: 'Lunes', width: 150, renderCell: renderCelda },
        { field: 'martes', headerName: 'Martes', width: 150, renderCell: renderCelda },
        { field: 'miercoles', headerName: 'Miércoles', width: 150, renderCell: renderCelda },
        { field: 'jueves', headerName: 'Jueves', width: 150, renderCell: renderCelda },
        { field: 'viernes', headerName: 'Viernes', width: 150, renderCell: renderCelda },
    ];

    const columnasFinSemana = [
        { 
            field: 'cliente', 
            headerName: 'Cliente', 
            width: 150,
            renderCell: renderClienteCell,
            cellClassName: 'cliente-columna'
        },
        { field: 'sabado', headerName: 'Sábado', width: 150, renderCell: renderCelda },
        { field: 'domingo', headerName: 'Domingo', width: 150, renderCell: renderCelda },
    ];

    return (
        <div className="horarios-page">
            <Menu />
            <section className="gears">
                <div className="ajustes">
                    <button className="btn" onClick={generarHorario}>
                        <i className="fas fa-calendar-alt"></i> Generar horario
                    </button>
                    <button className="btn" onClick={editarHorario} disabled={modoEdicion}>
                        <i className="fas fa-edit"></i> Editar horario
                    </button>
                    {modoEdicion ? (
                        <>
                            <button className="btn btn-success" onClick={guardarCambios}>
                                <i className="fas fa-save"></i> Guardar cambios
                            </button>
                            <button className="btn btn-danger" onClick={cancelarCambios}>
                                <i className="fas fa-times"></i> Cancelar cambios
                            </button>
                        </>
                    ) : (
                        <button className="btn" onClick={() => setModalOpen(true)}>
                            <i className="fa-solid fa-gear"></i> Ajustes
                        </button>
                    )}
                </div>
            </section>
            <section className="content">
                <div className="horario-header">
                    <h2>Soporte</h2>
                    <h3>Horario del {semanaSeleccionada || "3 al 9 de marzo"}</h3>
                </div>
                {isLoading ? (
                    <div className="loading-container">
                        <p>Cargando...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="horarios-container">
                        {/* Tabla simplificada para días de semana */}
                        <div className="tabla-horarios">
                            <table className="horario-table">
                                <thead>
                                    <tr>
                                        <th className="header-cliente">Cliente</th>
                                        <th>Lunes</th>
                                        <th>Martes</th>
                                        <th>Miércoles</th>
                                        <th>Jueves</th>
                                        <th>Viernes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaHorarios.map((cliente) => (
                                        <tr key={cliente.id} className="cliente-row">
                                            <td className="cliente-celda">{cliente.cliente}</td>
                                            <td>
                                                {cliente.lunes && cliente.lunes.length > 0 ? (
                                                    <div className="personas-container">
                                                        {cliente.lunes.map((persona, index) => (
                                                            <div key={index} className="persona-horario">
                                                                <div className="persona-nombre">{persona.nombre}</div>
                                                                <div className="horario-details">
                                                                    {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="celda-vacia"></div>
                                                )}
                                            </td>
                                            <td>
                                                {cliente.martes && cliente.martes.length > 0 ? (
                                                    <div className="personas-container">
                                                        {cliente.martes.map((persona, index) => (
                                                            <div key={index} className="persona-horario">
                                                                <div className="persona-nombre">{persona.nombre}</div>
                                                                <div className="horario-details">
                                                                    {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="celda-vacia"></div>
                                                )}
                                            </td>
                                            <td>
                                                {cliente.miercoles && cliente.miercoles.length > 0 ? (
                                                    <div className="personas-container">
                                                        {cliente.miercoles.map((persona, index) => (
                                                            <div key={index} className="persona-horario">
                                                                <div className="persona-nombre">{persona.nombre}</div>
                                                                <div className="horario-details">
                                                                    {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="celda-vacia"></div>
                                                )}
                                            </td>
                                            <td>
                                                {cliente.jueves && cliente.jueves.length > 0 ? (
                                                    <div className="personas-container">
                                                        {cliente.jueves.map((persona, index) => (
                                                            <div key={index} className="persona-horario">
                                                                <div className="persona-nombre">{persona.nombre}</div>
                                                                <div className="horario-details">
                                                                    {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="celda-vacia"></div>
                                                )}
                                            </td>
                                            <td>
                                                {cliente.viernes && cliente.viernes.length > 0 ? (
                                                    <div className="personas-container">
                                                        {cliente.viernes.map((persona, index) => (
                                                            <div key={index} className="persona-horario">
                                                                <div className="persona-nombre">{persona.nombre}</div>
                                                                <div className="horario-details">
                                                                    {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="celda-vacia"></div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Tabla simplificada para el fin de semana */}
                        <div className="tabla-finsemana">
                            <table className="horario-table finsemana-table">
                                <thead>
                                    <tr>
                                        <th className="header-cliente">Cliente</th>
                                        <th>Sábado</th>
                                        <th>Domingo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaHorarios.map((cliente) => (
                                        <tr key={`fs-${cliente.id}`} className="cliente-row">
                                            <td className="cliente-celda">{cliente.cliente}</td>
                                            <td>
                                                {cliente.sabado && cliente.sabado.length > 0 ? (
                                                    <div className="personas-container">
                                                        {cliente.sabado.map((persona, index) => (
                                                            <div key={index} className="persona-horario">
                                                                <div className="persona-nombre">{persona.nombre}</div>
                                                                <div className="horario-details">
                                                                    {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="celda-vacia"></div>
                                                )}
                                            </td>
                                            <td>
                                                {cliente.domingo && cliente.domingo.length > 0 ? (
                                                    <div className="personas-container">
                                                        {cliente.domingo.map((persona, index) => (
                                                            <div key={index} className="persona-horario">
                                                                <div className="persona-nombre">{persona.nombre}</div>
                                                                <div className="horario-details">
                                                                    {persona.hora_inicio.substring(0, 5)} - {persona.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="celda-vacia"></div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>

            {modalOpen && (
                <div className="modal" onClick={() => setModalOpen(false)}>
                    <div className="ajustes-horario" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                        <h3>Configuración de horarios</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="semana">Selecciona una semana:</label>
                                <input
                                    type="week"
                                    id="semana"
                                    value={semanaSeleccionada}
                                    onChange={(e) => setSemanaSeleccionada(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rotacion">Rotación de cliente cada:</label>
                                <select
                                    id="rotacion"
                                    value={rotacionSeleccionada}
                                    onChange={(e) => setRotacionSeleccionada(e.target.value)}
                                >
                                    <option value="1mes">1 mes</option>
                                    <option value="1semana">1 semana</option>
                                    <option value="2semanas">2 semanas</option>
                                    <option value="3semanas">3 semanas</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Formato de hora:</label>
                                <div className="radio-options">
                                    <div className="radio-option">
                                        <input type="radio" name="formatoHora" id="12H" value="12H" defaultChecked />
                                        <label htmlFor="12H">12 horas (AM/PM)</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" name="formatoHora" id="24H" value="24H" />
                                        <label htmlFor="24H">24 horas</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-success">Guardar Configuración</button>
                                <button type="button" className="btn btn-danger" onClick={() => setModalOpen(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Horarios;