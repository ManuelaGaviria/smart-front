
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

function ProgramarExamenC1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            } else {
                listExamenes();
                listExamenesProgramados();
                //listExamenesDisponibles();
                listHoras(new Date());
            }
        }
        verificar();
    }, [navigate]);

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [examenes, setExamen] = useState([]);
    const [examenesProgramados, setExamenProgramado] = useState([]);
    const [horas, setHoras] = useState([]);
    const [examenesSelect, setExamenSelect] = useState([]);
    const [examenSeleccionado, setExamenSeleccionado] = useState("");
    const [backgroundOpacity] = useState(0.5);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [selectedTime, setSelectedTime] = useState({ horaInicial: "", horaFinal: "" });

    const openAsignModal = () => {
        setAsignModalOpen(true);
    };

    const handleCloseModal = () => {
        //listExamenesDisponibles();
        listExamenesProgramados();
        setAsignModalOpen(false);
    };

    const openCancelModal = () => {
        //listExamenesDisponibles();
        listExamenesProgramados();
        setCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        //listExamenesDisponibles();
        listExamenesProgramados();
        setCancelModalOpen(false);
    };

    useEffect(() => {
        const obtenerExamenes = async () => {
            try {
                const respuesta = await fetchBody('/niveles/obtenerExamen', 'POST', { nivel: "C1" });
                if (respuesta.exito) {
                    const examenesFormateados = respuesta.lista.map(examen => ({
                        nombre: examen.id,
                        id: examen.id
                    }));
                    console.log('examenesFormateados :>> ', examenesFormateados);
                    setExamenSelect(examenesFormateados);
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
                    text: 'Error al procesar la solicitud para listar los examenes',
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        }
        obtenerExamenes();
        listExamenesProgramados();
        //listExamenesDisponibles();
    }, []);

    async function listExamenes() {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const idEst = payload.id;

                // Obtener la lista de examenes disponibles
                const respuestaExamenes = await fetchBody('/niveles/listarExamen', 'POST', { nivel: 'C1' });
                console.log('respuestaExamenes :>> ', respuestaExamenes);
                // Obtener el estado de los examenes programados
                const respuestaEstado = await fetchBody('/estudiantes/actualizarEstadoExamen', 'POST', { idEstudiante: idEst, nivel: 'C1' });
                console.log('respuestaEstado :>> ', respuestaEstado);
                if (respuestaExamenes.exito && respuestaEstado.exito) {
                    const examenesDisponibles = respuestaExamenes.lista;
                    const examenesProgramados = respuestaEstado.estadoExamenes;
                    console.log('examenesProgramados :>> ', examenesProgramados);
                    // Combinar ambas listas
                    const examenesCombinados = examenesDisponibles.map(examen => {
                        const examenProgramado = examenesProgramados.find(ep => ep.examenId === examen.id);
                        console.log('examenProgramado :>> ', examenProgramado);
                        return {
                            ...examen,
                            estado: examenProgramado ? examenProgramado.estado : 'pendiente',
                            nota: examenProgramado ? examenProgramado.nota : '0.0'
                        };
                    });

                    setExamen(examenesCombinados);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: respuestaExamenes.error || respuestaEstado.error,
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

    async function listExamenesProgramados() {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const idEst = payload.id;

                // Obtener la lista de clases disponibles
                const respuesta = await fetchBody('/estudiantes/listarExamenProgramado', 'POST', { idEstudiante: idEst, nivel: 'C1' });

                if (respuesta.exito) {
                    const examenesProgramados = respuesta.lista;

                    // Filtrar las clases programadas que no han pasado
                    const examenesValidos = examenesProgramados.filter(examen => {
                        const fechaHoraExamen = new Date(`${examen.fecha}T${examen.horaFinal}`);
                        const fechaHoraActual = new Date();
                        return fechaHoraExamen > fechaHoraActual;
                    });
                    setExamenProgramado(examenesValidos);
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
                text: 'Error al procesar la solicitud para listar los examenes programados',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    async function listExamenesDisponibles() {
        try {
            const respuestaExamenesDisponibles = await fetchBody('/niveles/listarExamen', 'POST', { nivel: "C1" });
            if (respuestaExamenesDisponibles.exito) {
                const token = localStorage.getItem("token");

                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const idEst = payload.id;

                    const respuestaExamenesProgramados = await fetchBody('/estudiantes/actualizarExamenesDisponibles', 'POST', { id: idEst, nivel: 'C1' });

                    if (respuestaExamenesProgramados.exito) {
                        const examenesProgramados = respuestaExamenesProgramados.examenesProgramados;

                        const examenesDisponibles = respuestaExamenesDisponibles.lista.filter(examen => !examenesProgramados.includes(examen.id));
                        // Obtener la próxima examen no programada
                        const siguienteExamen = examenesDisponibles.length > 0 ? [examenesDisponibles[0]] : [];

                        const examenesFormateados = siguienteExamen.map(examen => ({
                            nombre: examen.id,
                            id: examen.id
                        }));

                        setExamenSelect(examenesFormateados);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: respuestaExamenesProgramados.error,
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
                    text: respuestaExamenesDisponibles.error,
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
                text: 'Error al procesar la solicitud para listar los examenes disponibles',
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
                    const respuestaHorasAgendadas = await fetchBody('/estudiantes/obtenerHorasAgendadasExamen', 'POST', { idEstudiante: idEst, nivel: 'C1' });

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
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        listHoras(date);
    };

    const handleChange = (e) => {
        setExamenSeleccionado(e.target.value); // Actualizar el estado con el examen seleccionado
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
        const day = String(date.getDate()).padStart(2, '0'); // Días del mes

        return `${year}-${month}-${day}`;
    };

    async function programarExamen() {
        if (examenSeleccionado === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor selecciona un examen para programar.",
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

        const respuestaTareas = await Swal.fire({
            icon: 'question',
            title: '¿Ya realizaste las tareas de Cambridge?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            customClass: { confirmButton: 'btn-color', cancelButton: 'btn-color-cancel' },
            buttonsStyling: false
        });

        if (!respuestaTareas.isConfirmed) {
            Swal.fire({
                icon: 'info',
                title: 'Debes realizar las tareas',
                text: 'Completa las tareas de Cambridge antes de programar el examen.'
            });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idUsuario = payload.id;

        // Validar si puede agendar el examen (primera vez o por solicitud aprobada)
        const validacion = await fetchBody('/estudiantes/validarAgendamientoExamen', 'POST', {
            idEstudiante: idUsuario,
            examen: examenSeleccionado,
            nivel: 'C1'
        });

        if (!validacion.exito) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: validacion.error || "No se pudo validar el estado del examen.",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            return;
        }

        if (!validacion.puedeAgendar) {
            Swal.fire({
                icon: "warning",
                title: "No puedes agendar el examen",
                text: validacion.razon || "Debes completar las condiciones para poder agendar este examen.",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            return;
        }

        // Construir los datos para la solicitud
        const formattedDate = formatDate(selectedDate);
        const requestData = {
            nivel: 'C1',
            examen: examenSeleccionado,
            fecha: formattedDate,
            horaInicial: selectedTime.horaInicial,
            horaFinal: selectedTime.horaFinal,
            idEstudiante: idUsuario
        };

        // Realizar solicitud para programar el examen
        const respuesta = await fetchBody('/estudiantes/programarExamen', 'POST', requestData);

        if (respuesta.exito) {
            Swal.fire({
                icon: "success",
                title: "Examen programado con éxito!",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
            listExamenes();
           // listExamenesDisponibles();
            listExamenesProgramados();
            handleCloseModal();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: respuesta.error || 'Error al programar el examen',
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

    async function handleCancelExam(examenProgramado) {
        const id = examenProgramado.id;
        const fecha = examenProgramado.fecha;
        const hora = examenProgramado.horaInicial;
        try {
            // Obtener la lista actual de clases programadas
            const examenes = [...examenesProgramados];

            // Verificar si la clase a cancelar es la primera en la lista
            if (examenes[0].id !== id) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Debe cancelar primero el último examen agendado.",
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
                return;
            }

            // Mostrar alerta de confirmación
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro de cancelar este examen?',
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
                    const respuesta = await fetchBody('/estudiantes/cancelarExamen', 'POST', {
                        idEstudiante: idEst,
                        idExamen: id,
                        nivel: 'C1',
                        fecha: fecha,
                        hora: hora
                    });

                    if (respuesta.exito) {
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "El examen ha sido cancelado correctamente.",
                            customClass: {
                                confirmButton: 'btn-color'
                            },
                            buttonsStyling: false
                        });
                        listExamenes();
                        //listExamenesDisponibles();
                        listExamenesProgramados();
                        handleCloseModal();
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
                text: 'Error al procesar la solicitud para cancelar el examen.',
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
            <Logo3></Logo3>
            <FullscreenCard>
                <div>
                    <button onClick={openAsignModal} className="ButtonRegresar">Asignar</button>
                    <button onClick={openCancelModal} className="ButtonRegresar">Cancelar</button>
                    <ButtonLink destino="/HorarioExamenC1" clase="ButtonRegresar">Ver Horario</ButtonLink>
                </div>
                <br></br>
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Nivel</th>
                                <th style={{ width: '200px' }}>Examen #</th>
                                <th style={{ width: '200px' }}>Unidades</th>
                                <th style={{ width: '200px' }}>Descripcion</th>
                                <th style={{ width: '200px' }}>Clase que lo desbloquea</th>
                                <th style={{ width: '200px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examenes.map((examen) => (
                                <tr key={examen.id}>
                                    <td>INGC1</td>
                                    <td>{examen.examen}</td>
                                    <td>{examen.unidades}</td>
                                    <td>{examen.tematica}</td>
                                    <td>{examen.clase}</td>
                                    <td>{examen.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/ProgramarC1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>

            {asignModalOpen && (
                <>
                    <div
                        className="BackgroundOverlay"
                        style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Programar examen</h1>
                        <div className="InputContainer">
                            <label className='labelFecha'>Fecha</label>
                            <DateSelect onDateChange={handleDateChange}></DateSelect>
                            <b><Select titulo="Examen" opciones={examenesSelect}
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
                            <button onClick={programarExamen} className="ButtonRegresar">Agendar</button>

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
                        <h1>Cancelar examen</h1>
                        <div className="InputContainer">
                            <label className='labelFecha'>Fecha</label>
                            <DateSelect onDateChange={handleDateChange}></DateSelect>

                            <br />
                            <br />
                            <div>
                                <div className='CenterTable'>
                                    {examenesProgramados.length === 0 ? (
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
                                                {examenesProgramados.map((examenProgramado, index) => (
                                                    <tr key={examenProgramado.id}>
                                                        <td>{examenProgramado.id}</td>
                                                        <td>{examenProgramado.fecha}</td>
                                                        <td>{examenProgramado.horaInicial}</td>
                                                        <td>{examenProgramado.horaFinal}</td>
                                                        <td>
                                                            <button className='btn-color-cancel' onClick={() => handleCancelExam(examenProgramado)}>Cancelar</button>
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
    )
}

export default ProgramarExamenC1