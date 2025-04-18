import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody, fetchGet } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import DateSelect from '../../../../components/DateSelect';
import Checkbox from '../../../../components/Checkbox';
import Swal from 'sweetalert2';
import Select from '../../../../components/Select';

function ProgramarClaseA1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            } else {
                listClases();
                listClasesDisponibles();
                listClasesProgramadas();
                listHoras(new Date());
            }
        }
        verificar();
    }, [navigate]);

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [clases, setClase] = useState([]);
    const [clasesProgramadas, setClaseProgramada] = useState([]);
    const [horas, setHoras] = useState([]);
    const [clasesSelect, setClaseSelect] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState("");
    const [backgroundOpacity] = useState(0.5);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [selectedTime, setSelectedTime] = useState({ horaInicial: "", horaFinal: "" });

    const openAsignModal = () => {
        listClasesProgramadas();
        listClasesDisponibles();
        setAsignModalOpen(true);
    };

    const handleCloseModal = () => {
        listClasesProgramadas();
        listClasesDisponibles();
        setAsignModalOpen(false);
    };

    const openCancelModal = () => {
        listClasesProgramadas();
        listClasesDisponibles();
        setCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        listClasesProgramadas();
        listClasesDisponibles();
        setCancelModalOpen(false);
    };

    useEffect(() => {
        const obtenerClases = async () => {
            try {
                const respuesta = await fetchBody('/niveles/obtenerClase', 'POST', { nivel: "A1" });
                if (respuesta.exito) {
                    const clasesFormateadas = respuesta.lista.map(clase => ({
                        nombre: clase.id,
                        id: clase.id
                    }));
                    setClaseSelect(clasesFormateadas);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: respuesta.error,
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: 'Error al procesar la solicitud para listar las clases',
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        }
        obtenerClases();
    }, []);

    async function listClases() {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const idEst = payload.id;

                // Obtener la lista de clases disponibles
                const respuestaClases = await fetchBody('/niveles/listarClase', 'POST', { nivel: 'A1' });
                // Obtener el estado de las clases programadas
                const respuestaEstado = await fetchBody('/estudiantes/actualizarEstadoClases', 'POST', { idEstudiante: idEst, nivel: 'A1' });
                if (respuestaClases.exito && respuestaEstado.exito) {
                    const clasesDisponibles = respuestaClases.lista;
                    const clasesProgramadas = respuestaEstado.estadoClases;

                    // Combinar ambas listas
                    const clasesCombinadas = clasesDisponibles.map(clase => {
                        const claseProgramada = clasesProgramadas.find(c => c.id === clase.id);

                        let asistenciaIcono = "❌";
                        if (claseProgramada?.data?.asistencia) {
                            asistenciaIcono = "✅";
                        }

                        return {
                            ...clase,
                            asistencia: asistenciaIcono,
                            estado: claseProgramada ? claseProgramada.data.estado : 'pendiente'
                        };
                    });
                    setClase(clasesCombinadas);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: respuestaClases.error || respuestaEstado.error,
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                }

            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar las clases',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    async function listClasesProgramadas() {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const idEst = payload.id;

                // Obtener la lista de clases disponibles
                const respuesta = await fetchBody('/estudiantes/listarClaseProgramada', 'POST', { idEstudiante: idEst, nivel: 'A1' });

                if (respuesta.exito) {
                    const clasesProgramadas = respuesta.lista;

                    // Filtrar las clases programadas que no han pasado
                    const clasesValidas = clasesProgramadas.filter(clase => {
                        const fechaHoraClase = new Date(`${clase.fecha}T${clase.horaFinal}`);
                        const fechaHoraActual = new Date();
                        return fechaHoraClase > fechaHoraActual;
                    });

                    setClaseProgramada(clasesValidas);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: respuesta.error,
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se encontró el usuario",
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar las clases programadas',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }


    async function listClasesDisponibles() {
        try {
            const respuestaClasesDisponibles = await fetchBody('/niveles/listarClase', 'POST', { nivel: "A1" });
            if (respuestaClasesDisponibles.exito) {
                const token = localStorage.getItem("token");

                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const idEst = payload.id;

                    const respuestaClasesProgramadas = await fetchBody('/estudiantes/actualizarClasesDisponibles', 'POST', { id: idEst, nivel: 'A1' });

                    if (respuestaClasesProgramadas.exito) {
                        const clasesProgramadas = respuestaClasesProgramadas.clasesProgramadas;
                        const clasesDisponibles = respuestaClasesDisponibles.lista.filter(clase => !clasesProgramadas.includes(clase.id));
                        // Obtener la próxima clase no programada
                        const siguienteClase = clasesDisponibles.length > 0 ? [clasesDisponibles[0]] : [];

                        const clasesFormateadas = siguienteClase.map(clase => ({
                            nombre: clase.id,
                            id: clase.id
                        }));
                        setClaseSelect(clasesFormateadas);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: respuestaClasesProgramadas.error,
                            customClass: {
                                confirmButton: 'btn-color'
                            },
                            buttonsStyling: false
                        });
                    }
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: respuestaClasesDisponibles.error,
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar las clases disponibles',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    async function listHoras(date) {
        try {
            // Obtener las horas disponibles
            const respuesta = await fetchGet('/estudiantes/obtenerHora');
            if (respuesta.exito) {
                let { horasIniciales, horasFinales } = respuesta;

                // Emparejar las horas iniciales y finales
                let horas = horasIniciales.map((horaInicial, index) => ({
                    horaInicial,
                    horaFinal: horasFinales[index]
                }));

                // Obtener ID del estudiante desde el token
                const token = localStorage.getItem("token");
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const idEst = payload.id;

                    // Obtener horas agendadas
                    const respuestaHorasAgendadas = await fetchBody('/estudiantes/obtenerHorasAgendadas', 'POST', { idEstudiante: idEst, nivel: 'A1' });

                    if (respuestaHorasAgendadas.exito) {
                        const horasAgendadas = respuestaHorasAgendadas.horasAgendadas;
                        // Crear una nueva lista de horas disponibles filtrando horas agendadas
                        let horasDisponibles = horas.filter(hora => {
                            // Fecha seleccionada en formato YYYY-MM-DD
                            const seleccionadaFecha = date.toISOString().split('T')[0];
                            // Filtrar horas agendadas para la fecha seleccionada
                            const esHoraDisponible = !horasAgendadas.some(agendada => {
                                const agendadaFecha = agendada.fecha;

                                // Comparar horas agendadas con horas disponibles
                                const esMismaFecha = agendadaFecha === seleccionadaFecha;
                                const esMismaHoraInicial = agendada.horaInicial === hora.horaInicial;
                                const esMismaHoraFinal = agendada.horaFinal === hora.horaFinal;

                                return esMismaFecha && esMismaHoraInicial && esMismaHoraFinal;
                            });

                            return esHoraDisponible;
                        });

                        // Filtrar horas si la fecha seleccionada es hoy
                        if (isToday(date)) {
                            const now = new Date();
                            horasDisponibles = horasDisponibles.filter(hora => {
                                const horaDisponible = new Date(`${date.toDateString()} ${hora.horaInicial}`);
                                return horaDisponible > now;
                            });

                        }

                        setHoras(horasDisponibles);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: respuestaHorasAgendadas.error,
                            customClass: {
                                confirmButton: 'btn-color'
                            },
                            buttonsStyling: false
                        });
                    }
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: respuesta.error,
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar las horas',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    const isToday = (date) => {
        const today = new Date();

        // Normalizamos ambas fechas a medianoche para evitar problemas con la hora
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return dateMidnight.getTime() === todayMidnight.getTime();
    };


    const handleDateChange = (date) => {
        setSelectedDate(date);
        listHoras(date);
    };

    const handleChange = (e) => {
        setClaseSeleccionada(e.target.value); // Actualizar el estado con la clase seleccionada
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
        const day = String(date.getDate()).padStart(2, '0'); // Días del mes

        return `${year}-${month}-${day}`;
    };

    async function programarClase() {
        if (claseSeleccionada === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor selecciona una clase para programar.",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
            return;
        }

        if (selectedCheckbox === null) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor selecciona una hora para programar.",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idUsuario = payload.id;

        // Validar secuencia de clase
        const respuestaClasesProgramadas = await fetchBody('/estudiantes/actualizarClasesDisponibles', 'POST', {
            id: idUsuario,
            nivel: 'A1'
        });

        if (!respuestaClasesProgramadas.exito) return;

        const clasesProgramadas = respuestaClasesProgramadas.clasesProgramadas;
        const siguienteClase = clasesProgramadas.length + 1;
        const claseSiguienteId = `Clase${siguienteClase}`;

        if (claseSeleccionada !== claseSiguienteId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Debes seleccionar la clase en orden. Por favor selecciona ${claseSiguienteId}.`,
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
            return;
        }

        // ✅ Verificar si la clase anterior desbloquea un examen
        if (siguienteClase > 1) {
            const claseAnterior = `Clase${siguienteClase - 1}`;
            const examenes = await fetchBody('/niveles/obtenerExamenData', 'POST', { nivel: 'A1' });
            if (examenes.exito) {
                const examenesDesbloqueados = examenes.lista.filter(ex => ex.clase === claseAnterior);
                for (const examen of examenesDesbloqueados) {
                    const examenId = examen.id;
                    // Obtener intentos del examen
                    const respuestaExamen = await fetchBody('/estudiantes/obtenerIntentosExamen', 'POST', {
                        idEstudiante: idUsuario,
                        nivel: 'A1',
                        claseAProgramar: claseSeleccionada
                    });

                    if (!respuestaExamen.exito) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: respuestaExamen.error || "No se pudo validar la clase y el examen.",
                            customClass: { confirmButton: 'btn-color' },
                            buttonsStyling: false
                        });
                        return;
                    }

                    const { desbloqueaExamen, examenGanado, examenId2 } = respuestaExamen;

                    if (desbloqueaExamen && !examenGanado) {
                        Swal.fire({
                            icon: "warning",
                            title: "Examen pendiente",
                            text: `Antes de agendar esta clase debes presentar y aprobar el examen: ${examenId2}`,
                            customClass: { confirmButton: 'btn-color' },
                            buttonsStyling: false
                        });
                        return;
                    }
                }
            }
        }

        // ✅ Si pasa todas las validaciones, se agenda la clase
        const formattedDate = formatDate(selectedDate);

        const requestData = {
            nivel: 'A1',
            clase: claseSeleccionada,
            fecha: formattedDate,
            horaInicial: selectedTime.horaInicial,
            horaFinal: selectedTime.horaFinal,
            idEstudiante: idUsuario
        };

        const respuesta = await fetchBody('/estudiantes/programarClase', 'POST', requestData);

        if (respuesta.exito) {
            Swal.fire({
                icon: "success",
                title: "Clase programada con éxito",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
            listClases();
            listClasesDisponibles();
            listClasesProgramadas();
            handleCloseModal();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al programar la clase',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    const handleCheckboxChange = (index, horaInicial, horaFinal, checked) => {
        if (checked) {
            setSelectedCheckbox(index);
            setSelectedTime({ horaInicial, horaFinal });
        } else {
            // Aquí, al desmarcar, se limpia la selección solo si el índice coincide
            if (selectedCheckbox === index) {
                setSelectedCheckbox(null);
                setSelectedTime({ horaInicial: "", horaFinal: "" });
            }
        }
    };

    async function handleCancelClass(claseProgramada) {
        const id = claseProgramada.id;
        const fecha = claseProgramada.fecha;
        const hora = claseProgramada.horaInicial;
        try {
            // Obtener la lista actual de clases programadas
            const clases = [...clasesProgramadas];

            // Verificar si la clase a cancelar es la primera en la lista
            if (clases[0].id !== id) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Debe cancelar primero la última clase agendada.",
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
                return;
            }

            // Mostrar alerta de confirmación
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro de eliminar esta clase?',
                text: "Esta acción no se puede revertir",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                customClass: {
                    confirmButton: 'btn-color',
                    cancelButton: 'btn-color-cancel'
                },
                buttonsStyling: false
            });

            // Verificar si el usuario confirmó la eliminación
            if (confirmacion.isConfirmed) {
                const token = localStorage.getItem("token");

                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const idEst = payload.id;

                    // Realizar la solicitud para cancelar la clase
                    const respuesta = await fetchBody('/estudiantes/cancelarClase', 'POST', {
                        idEstudiante: idEst,
                        idClase: id,
                        nivel: 'A1',
                        fecha: fecha,
                        hora: hora
                    });

                    if (respuesta.exito) {
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "La clase ha sido cancelada correctamente.",
                            customClass: {
                                confirmButton: 'btn-color'
                            },
                            buttonsStyling: false
                        });
                        listClases();
                        listClasesProgramadas();
                        listClasesDisponibles();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: respuesta.error,
                            customClass: {
                                confirmButton: 'btn-color'
                            },
                            buttonsStyling: false
                        });
                    }
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para cancelar la clase.',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }



    return (
        <motion.div
            className='ContainerFull'
            initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
            animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
            exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
            transition={{ duration: 1 }}>
            <Logo3 />
            <FullscreenCard>
                <div>
                    <button onClick={openAsignModal} className="ButtonRegresar">Asignar</button>
                    <button onClick={openCancelModal} className="ButtonRegresar">Cancelar</button>
                    <ButtonLink destino="/HorarioA1" clase="ButtonRegresar">Ver Horario</ButtonLink>
                </div>
                <br />
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Código</th>
                                <th style={{ width: '200px' }}>Clase #</th>
                                <th style={{ width: '200px' }}>Descripción</th>
                                <th style={{ width: '200px' }}>Asistencia</th>
                                <th style={{ width: '200px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clases.map((clase) => (
                                <tr key={clase.id}>
                                    <td>{clase.codigo}</td>
                                    <td>Clase {clase.numero}</td>
                                    <td>{clase.descripcion}</td>
                                    <td>{clase.asistencia}</td>
                                    <td>{clase.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/ProgramarA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>

            {asignModalOpen && (
                <>
                    <div
                        className="BackgroundOverlay"
                        style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Programar clase</h1>
                        <div className="InputContainer">
                            <label className='labelFecha'>Fecha</label>
                            <DateSelect onDateChange={handleDateChange}></DateSelect>
                            <b><Select titulo="Clase" opciones={clasesSelect}
                                eventoCambio={handleChange}></Select></b>
                            <br />

                            <div>
                                <div className='CenterTable'>
                                    <table className='Table'>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '200px' }}>Hora Inicial</th>
                                                <th style={{ width: '200px' }}>Hora Final</th>
                                                <th style={{ width: '200px' }}>Seleccionar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {horas.map((hora, index) => (
                                                <tr key={index}>
                                                    <td>{hora.horaInicial}</td>
                                                    <td>{hora.horaFinal}</td>
                                                    <td>
                                                        <Checkbox
                                                            id={index}
                                                            label=""
                                                            checked={selectedCheckbox === index}
                                                            onChange={(checked) => handleCheckboxChange(index, hora.horaInicial, hora.horaFinal, checked)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button onClick={handleCloseModal} className="ButtonRegresar">Regresar</button>
                            <button onClick={programarClase} className="ButtonRegresar">Agendar</button>

                            <br />
                            <br />
                        </div>
                    </ContenedorForms>
                </>
            )}

            {cancelModalOpen && (
                <>
                    <div
                        className="BackgroundOverlay"
                        style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Cancelar clase</h1>
                        <div className="InputContainer">
                            <label className='labelFecha'>Fecha</label>
                            <DateSelect onDateChange={handleDateChange}></DateSelect>

                            <br />
                            <br />
                            <div>
                                <div className='CenterTable'>
                                    {clasesProgramadas.length === 0 ? (
                                        <p>No hay clases disponibles para cancelar</p>
                                    ) : (
                                        <table className='Table'>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '200px' }}>Clase #</th>
                                                    <th style={{ width: '200px' }}>Fecha</th>
                                                    <th style={{ width: '200px' }}>Hora Inicial</th>
                                                    <th style={{ width: '200px' }}>Hora Final</th>
                                                    <th style={{ width: '200px' }}>Cancelar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clasesProgramadas.map((claseProgramada, index) => (
                                                    <tr key={claseProgramada.id}>
                                                        <td>{claseProgramada.id}</td>
                                                        <td>{claseProgramada.fecha}</td>
                                                        <td>{claseProgramada.horaInicial}</td>
                                                        <td>{claseProgramada.horaFinal}</td>
                                                        <td>
                                                            <button className='btn-color-cancel' onClick={() => handleCancelClass(claseProgramada)}>Cancelar</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                            <button onClick={handleCloseCancelModal} className="ButtonRegresar">Regresar</button>
                            <br />
                            <br />
                        </div>
                    </ContenedorForms>
                </>
            )}
        </motion.div>
    );
}

export default ProgramarClaseA1;
