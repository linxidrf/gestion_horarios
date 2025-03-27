import React, { useState, useEffect, useCallback } from "react";
import "../styles/styles.css";
import { 
    guardarConfiguracion, 
    obtenerHorario,
    generarHorario, 
    obtenerConfiguracionActiva, 
    actualizarHorario 
} from "../services/api";
import Menu from "../components/Menu";
import { DataGrid } from "@mui/x-data-grid";


const Horarios = () => {

    const [modalAjustesOpen, setModalAjustesOpen] = useState(false);
    const [modalSemanaOpen, setModalSemanaOpen] = useState(false);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState("");
    const [semanaInicio, setSemanaInicio] = useState("");
    const [rotacionSeleccionada, setRotacionSeleccionada] = useState("1semana");
    const [listaHorarios, setListaHorarios] = useState([]);
    const [error, setError] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [cambiosPendientes, setCambiosPendientes] = useState([]);
    const [configuracionActiva, setConfiguracionActiva] = useState(null);
    const [errorConfiguracion, setErrorConfiguracion] = useState(null);
    
    
    const cargarHorario = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!semanaSeleccionada) {
                throw new Error("Debe seleccionar una semana");
            }
           await obtenerHorario(semanaSeleccionada);
            
            // Manejar diferentes tipos de respuestas
            if (response.error) {
                setError(response.error);
                return;
            }
        
    }
   }


    const procesarDatosHorarios = (datos) => {
        if (!datos || typeof datos !== 'object') {
            console.error("Datos recibidos no son válidos:", datos);
            return [];
        }

        const result = [];
        let idCounter = 0;

        try {
            Object.keys(datos).forEach(cliente => {
                const clienteData = datos[cliente];
                const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

                diasSemana.forEach(dia => {
                    const personas = clienteData[dia] || [];

                    personas.forEach(personaObj => {
                        if (!personaObj) return;

                        let personaExistente = result.find(r =>
                            r.cliente === cliente &&
                            r.personaId === personaObj.id_usuario
                        );

                        if (personaExistente) {
                            personaExistente[dia.replace('é', 'e')] = {
                                nombre: personaObj.nombre,
                                hora_inicio: personaObj.hora_inicio,
                                hora_fin: personaObj.hora_fin
                            };
                        } else {
                            const newRow = {
                                id: `${cliente}-${personaObj.id_usuario}-${idCounter++}`,
                                cliente: cliente,
                                personaId: personaObj.id_usuario,
                                persona: personaObj.nombre,
                                lunes: '',
                                martes: '',
                                miercoles: '',
                                jueves: '',
                                viernes: '',
                                sabado: '',
                                domingo: ''
                            };

                            newRow[dia.replace('é', 'e')] = {
                                nombre: personaObj.nombre,
                                hora_inicio: personaObj.hora_inicio,
                                hora_fin: personaObj.hora_fin
                            };

                            result.push(newRow);
                        }
                    });
                });
            });
        } catch (error) {
            console.error("Error al procesar datos de horarios:", error);
        }

        return result;
    };

  
    const handleCellEditCommit = useCallback(
        (params) => {
            const { id, field, value } = params;
            const row = listaHorarios.find((r) => r.id === id);
    
            if (!row) return;
    
            const nuevoCambio = {
                id: id,
                personaId: row.personaId,
                dia: field,
                valorOriginal: row[field],
                nuevoValor: value
            };
    
            const newRows = listaHorarios.map((r) => 
                r.id === id 
                    ? { ...r, [field]: value } 
                    : r
            );
            setListaHorarios(newRows);
    
            const cambiosExistentes = cambiosPendientes.filter(
                c => !(c.id === id && c.dia === field)
            );
            setCambiosPendientes([...cambiosExistentes, nuevoCambio]);
        },
        [listaHorarios, cambiosPendientes]
    );
    
    const guardarCambios = async () => {
        try {
            for (const cambio of cambiosPendientes) {
                await actualizarHorario({
                    id_usuario: cambio.personaId,
                    dia: cambio.dia,
                    hora_inicio: cambio.nuevoValor.hora_inicio || '',
                    hora_fin: cambio.nuevoValor.hora_fin || ''
                });
            }
    
            await obtenerHorario();
            
            setModoEdicion(false);
            setCambiosPendientes([]);
            
            alert("Cambios guardados correctamente.");
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            alert("No se pudieron guardar todos los cambios.");
        }
    };
    
    const cancelarCambios = () => {
        setModoEdicion(false);
        setCambiosPendientes([]);
        obtenerHorario();
    };
  
    const renderCelda = (params) => {
        const cambioPendiente = cambiosPendientes.find(
            c => c.id === params.row.id && c.dia === params.field
        );

        if (cambioPendiente) {
            return (
                <div className="horario-cell cambio-pendiente">
                    <div className="persona-nombre">
                        {params.value.nombre || 'Sin nombre'}
                    </div>
                    <div className="horario-details">
                        {params.value.hora_inicio?.slice(0, 5) || ''} - 
                        {params.value.hora_fin?.slice(0, 5) || ''}
                    </div>
                </div>
            );
        }

        if (!params.value) return <div className="celda-vacia"></div>;
        
        if (typeof params.value === 'object' && params.value !== null) {
            return (
                <div className="horario-cell">
                    <div className="persona-nombre">
                        {params.value.nombre || 'Sin nombre'}
                    </div>
                    <div className="horario-details">
                        {params.value.hora_inicio ? params.value.hora_inicio.slice(0, 5) : ''} - 
                        {params.value.hora_fin ? params.value.hora_fin.slice(0, 5) : ''}
                    </div>
                </div>
            );
        }
        
        return <div className="persona-cell">{params.value}</div>;
    };

    const renderClienteCell = (params) => {
        const clientRows = listaHorarios.filter(row => row.cliente === params.row.cliente);
        const isFirst = clientRows.indexOf(params.row) === 0;

        if (isFirst) {
            return (
                <div className="cliente-cell">
                    {params.row.cliente}
                </div>
            );
        }
        
        return <div></div>;
    };
   

    const columnasDiasSemana = [
        { 
            field: 'cliente', 
            headerName: 'Cliente', 
            flex: 1,
            minWidth: 120,
            renderCell: renderClienteCell,
            cellClassName: 'cliente-columna'
        },
        { 
            field: 'lunes', 
            headerName: 'Lunes', 
            flex: 1, 
            minWidth: 100, 
            renderCell: renderCelda,
            editable: modoEdicion,
            type: 'object'
        },
        { 
            field: 'martes', 
            headerName: 'Martes', 
            flex: 1, 
            minWidth: 100, 
            renderCell: renderCelda,
            editable: modoEdicion,
            type: 'object'
        },
        { 
            field: 'miercoles', 
            headerName: 'Miércoles', 
            flex: 1, 
            minWidth: 100, 
            renderCell: renderCelda,
            editable: modoEdicion,
            type: 'object'
        },
        { 
            field: 'jueves', 
            headerName: 'Jueves', 
            flex: 1, 
            minWidth: 100, 
            renderCell: renderCelda,
            editable: modoEdicion,
            type: 'object'
        },
        { 
            field: 'viernes', 
            headerName: 'Viernes', 
            flex: 1, 
            minWidth: 100, 
            renderCell: renderCelda,
            editable: modoEdicion,
            type: 'object'
        }
    ];

    const columnasFinSemana = [
        { 
            field: 'cliente', 
            headerName: 'Cliente', 
            flex: 1, 
            minWidth: 120,
            renderCell: renderClienteCell 
        },
        { 
            field: 'sabado', 
            headerName: 'Sábado', 
            flex: 1, 
            minWidth: 150, 
            renderCell: renderCelda,
            editable: modoEdicion,
            type: 'object'
        },
        { 
            field: 'domingo', 
            headerName: 'Domingo', 
            flex: 1, 
            minWidth: 150, 
            renderCell: renderCelda,
            editable: modoEdicion,
            type: 'object'
        },
    ];

    return (
        <div className="horarios-page">
            <Menu />
            <div className="gears">
                <div className="ajustes">
                    <button className="btn" onClick={() => setModalSemanaOpen(true)}>
                        <i className="fas fa-calendar-alt"></i> Generar horario
                    </button>
                    
                    {!modoEdicion ? (
                        <button 
                            className="btn" 
                            onClick={editarHorario}
                        >
                            <i className="fas fa-edit"></i> Editar horario
                        </button>
                    ) : (
                        <>
                            <button 
                                className="btn btn-success" 
                                onClick={guardarCambios}
                                disabled={cambiosPendientes.length === 0}
                            >
                                <i className="fas fa-save"></i> Guardar cambios
                            </button>
                            <button 
                                className="btn btn-danger" 
                                onClick={cancelarCambios}
                            >
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                        </>
                    )}
                    
                    {!modoEdicion && (
                        <button 
                            className="btn" 
                            onClick={verificarConfiguracionActiva}
                        >
                            <i className="fa-solid fa-gear"></i> Ajustes
                        </button>
                    )}
                </div>
            </div>

            <div className="content">
                <div className="horario-header">
                    <h2>Soporte</h2>
                    <h3>Horario del {semanaSeleccionada}</h3>
                </div>
                
                {isLoading ? (
                    <p className="loading">Cargando...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="horarios-container">
                        <div className="tabla-horario">
                            <DataGrid
                                rows={listaHorarios}
                                columns={columnasDiasSemana}
                                pageSize={50}
                                autoHeight
                                hideFooter
                                density="compact"
                                editMode="row"
                                isCellEditable={(params) => modoEdicion}
                                onCellEditCommit={handleCellEditCommit}
                            />
                        </div>
                        <div className="tabla-horario">
                            <DataGrid
                                rows={listaHorarios}
                                columns={columnasFinSemana}
                                pageSize={50}
                                autoHeight
                                hideFooter
                                density="compact"
                                editMode="row"
                                isCellEditable={(params) => modoEdicion}
                                onCellEditCommit={handleCellEditCommit}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Ajustes */}
            {modalAjustesOpen && (
                <div className="modal">
                    <div className="ajustes-horario" onClick={(e) => e.stopPropagation()}>
                    
                        <h3>Ajustes de Rotación</h3>
                        <form onSubmit={handleAjustesSubmit}>
                                <label htmlFor="semana">Semana:</label>
                                <div className="form-group">
                     
                       <input
                                    type="week"
                                    id="semana"
                                    value={semanaInicio}
                                    onChange={(e) => setSemanaInicio(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rotacion">Rotación de cliente cada:</label>
                                <select
                                    id="rotacion"
                                    value={rotacionSeleccionada}
                                    onChange={(e) => setRotacionSeleccionada(e.target.value)}>
                                    <option value="1semana">1 semana</option>
                                    <option value="2semanas">2 semanas</option>
                                    <option value="1mes">1 mes</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Guardar</button>
                                <button type="button" onClick={() => setModalAjustesOpen(false)}>Cancelar</button>
                            </div>
                        </form>
                
                    </div>
                 </div>
            )}
            

            {/* Modal de Selección de Semana */}
            {modalSemanaOpen && (
                <div className="modal">
                     <div className="ajustes-horario" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                     <div className="form-group">
                        <h3>Selecciona una Semana:</h3>
                       <input
                                    type="week"
                                    id="semana"
                                    value={semanaSeleccionada}
                                    onChange={(e) => setSemanaSeleccionada(e.target.value)}
                                    required
                                />
                            </div>
                        <button onClick={handleGenerarHorario}>Generar</button>
                        <button onClick={() => setModalSemanaOpen(false)}>Cancelar</button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );

}
export default Horarios